import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import { Schema, model, Types, models } from 'mongoose';
import { buffer } from 'micro';
import { Payment } from '@/server/payments/model';
import { sendPaymentReceiptEmail, sendAdminStripeReceiptEmail, sendSubscriptionCancellationEmail } from '@/server/registration/email';
import Subscription from '@/server/subscription/model';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Модель пользователя для обновления роли
const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  age: Number,
  comment: String,
  password: String,
  role: { type: String, enum: ['admin', 'teacher', 'student', 'guest'], default: 'guest' },
  isEmailVerified: { type: Boolean, default: false },
  subscription: { type: Types.ObjectId, ref: 'Subscription' },
  teacherId: { type: Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('🔔 Webhook endpoint called:', {
    method: req.method,
    url: req.url,
    headers: {
      'stripe-signature': req.headers['stripe-signature'] ? 'present' : 'missing',
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent']
    }
  });

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    console.log('✅ Database connected');

    // Получаем raw body
    const buf = await buffer(req);
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      console.error('❌ Missing stripe-signature header');
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    if (!endpointSecret) {
      console.error('❌ Missing STRIPE_WEBHOOK_SECRET environment variable');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    console.log('🔍 Webhook secret configured:', endpointSecret ? 'yes' : 'no');

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, signature, endpointSecret);
      console.log('✅ Webhook signature verified successfully');
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    console.log('📨 Received webhook event:', {
      type: event.type,
      id: event.id,
      created: event.created,
      dataObjectType: event.data?.object?.object
    });

    // Обрабатываем различные типы событий
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('💳 Checkout session completed:', session.id);
        console.log('📋 Session metadata:', session.metadata);
        console.log('📋 Session subscription:', session.subscription);
        
        // Получаем данные из метаданных
        const userId = session.metadata?.userId;
        const subscriptionType = session.metadata?.subscriptionType;
        const userEmail = session.metadata?.userEmail;
        
        console.log('🔍 Extracted data from session:', {
          userId,
          subscriptionType,
          userEmail,
          hasSubscription: !!session.subscription
        });
        
        if (userId && session.subscription) {
          try {
            // Получаем пользователя
            const user = await findUserById(userId);
            if (!user) {
              console.error('❌ User not found for subscription activation:', userId);
              break;
            }

            console.log('👤 Found user:', {
              userId: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              currentRole: user.role
            });

            // Проверяем, что пользователь имеет роль 'guest'
            if (user.role !== 'guest') {
              console.log('⚠️ User is not a guest, skipping role update:', {
                userId,
                currentRole: user.role,
                expectedRole: 'guest'
              });
              break;
            }

            // Обновляем роль пользователя с 'guest' на 'student'
            const updateResult = await User.findByIdAndUpdate(userId, {
              role: 'student',
              updatedAt: new Date()
            }, { new: true });

            console.log('✅ User role updated from guest to student:', {
              userId,
              userEmail,
              subscriptionType,
              oldRole: 'guest',
              newRole: 'student',
              updateResult: !!updateResult
            });

            // Сохраняем платеж
            await Payment.create({
              userId: user._id,
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
              stripeSessionId: session.id,
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: session.payment_status || 'unknown',
              eventType: event.type,
              rawEvent: event
            });
            console.log('💾 Payment record created for user:', user._id);

            // Письмо-квитанция
            try {
              const planName = subscriptionType === 'BASIC' ? 'Базовый (8/мес)' : subscriptionType === 'STANDARD' ? 'Стандарт (24/мес)' : 'Премиум (48/мес)';
              await sendPaymentReceiptEmail({
                email: user.email,
                amount: (session.amount_total || 0) / 100,
                currency: session.currency || 'usd',
                planName,
                intervalText: undefined,
                sessionId: session.id,
              });
              // Письмо для админа с ссылками на инвойс/чек
              const invoiceId = (session as any).invoice as string | undefined;
              if (invoiceId) {
                const invoice = await stripe.invoices.retrieve(invoiceId, { expand: ['charge'] } as any);
                await sendAdminStripeReceiptEmail({
                  customerEmail: user.email,
                  amount: (session.amount_total || 0) / 100,
                  currency: session.currency || 'usd',
                  invoiceId,
                  invoicePdfUrl: (invoice as any).invoice_pdf,
                  hostedInvoiceUrl: (invoice as any).hosted_invoice_url,
                  receiptUrl: (invoice as any).charge?.receipt_url,
                  subscriptionId: (session as any).subscription as string,
                  sessionId: session.id,
                });
              } else {
                await sendAdminStripeReceiptEmail({
                  customerEmail: user.email,
                  amount: (session.amount_total || 0) / 100,
                  currency: session.currency || 'usd',
                  subscriptionId: (session as any).subscription as string,
                  sessionId: session.id,
                });
              }
            } catch (e) {
              console.warn('⚠️ Не удалось отправить квитанцию:', e);
            }

            // Создаем запись подписки в базе данных
            const lessonsByType: Record<string, number> = {
              BASIC: 8,
              STANDARD: 24,
              PREMIUM: 48
            };
            const internalTypeByMeta: Record<string, 'basic' | 'standard' | 'premium'> = {
              BASIC: 'basic',
              STANDARD: 'standard',
              PREMIUM: 'premium'
            } as const;

            const isMetaType = (value: unknown): value is 'BASIC' | 'STANDARD' | 'PREMIUM' =>
              value === 'BASIC' || value === 'STANDARD' || value === 'PREMIUM';

            const typeKey: 'BASIC' | 'STANDARD' | 'PREMIUM' = isMetaType(subscriptionType) ? subscriptionType : 'BASIC';

            
            const subscriptionData = {
              userId: user._id,
              type: internalTypeByMeta[typeKey],
              status: 'active',
              startDate: new Date(),
              autoRenewal: true,
              lessonsPerMonth: lessonsByType[typeKey],
              stripeSubscriptionId: session.subscription,
              stripeCustomerId: session.customer,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            const newSubscription = await Subscription.create(subscriptionData);
            console.log('💾 Subscription record created for user:', {
              userId: user._id,
              subscriptionId: newSubscription._id,
              type: subscriptionData.type,
              lessonsPerMonth: subscriptionData.lessonsPerMonth
            });

            // Обновляем поле subscription в модели пользователя
            await User.findByIdAndUpdate(userId, {
              subscription: newSubscription._id,
              updatedAt: new Date()
            });
            console.log('✅ User subscription field updated:', {
              userId,
              subscriptionId: newSubscription._id
            });

          } catch (error) {
            console.error('❌ Error activating subscription:', error);
          }
        } else {
          console.log('⚠️ Missing userId or subscription in session:', {
            userId,
            subscription: session.subscription,
            metadata: session.metadata,
            hasUserId: !!userId,
            hasSubscription: !!session.subscription
          });
        }
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object;
        console.log('🆕 Subscription created:', subscription.id);
        console.log('Status:', subscription.status);
        console.log('Customer:', subscription.customer);
        console.log('Metadata:', subscription.metadata);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const previousAttributes = event.data.previous_attributes;
        
        console.log('🔄 Subscription updated:', subscription.id);
        console.log('Status:', subscription.status);
        console.log('Previous status:', previousAttributes?.status);
        console.log('cancel_at_period_end:', (subscription as any).cancel_at_period_end, 'prev:', previousAttributes?.cancel_at_period_end);
        
        // Если подписка стала активной
        if (subscription.status === 'active' && previousAttributes?.status === 'incomplete') {
          console.log('✅ Subscription became active, payment completed');
        }
        
        // Если включили отмену в конце периода (cancel_at_period_end стал true)
        const nowCancelAtPeriodEnd = (subscription as any).cancel_at_period_end === true;
        const wasCancelAtPeriodEnd = previousAttributes?.cancel_at_period_end === true;
        if (nowCancelAtPeriodEnd && !wasCancelAtPeriodEnd) {
          console.log('🛑 Subscription set to cancel at period end');
          const userId = (subscription as any).metadata?.userId as string | undefined;
          try {
            // Обновляем локальную запись подписки
            const subDoc = await Subscription.findOne({ stripeSubscriptionId: subscription.id });
            let endDate: Date | undefined = undefined;
            if ((subscription as any).cancel_at) {
              endDate = new Date((subscription as any).cancel_at * 1000);
            } else if ((subscription as any).current_period_end) {
              endDate = new Date((subscription as any).current_period_end * 1000);
            }
            if (subDoc) {
              subDoc.status = 'cancelled';
              subDoc.autoRenewal = false;
              if (endDate) subDoc.endDate = endDate;
              await subDoc.save();
              console.log('💾 Local subscription updated as cancelled with endDate:', endDate);
            }

            // Письмо пользователю
            if (userId) {
              const user = await findUserById(userId);
              if (user?.email) {
                const planName = subDoc?.type === 'basic' ? 'Базовый (8 уроков/мес)'
                  : subDoc?.type === 'standard' ? 'Стандарт (24 урока/мес)'
                  : subDoc?.type === 'premium' ? 'Премиум (48 уроков/мес)'
                  : undefined;
                await sendSubscriptionCancellationEmail({
                  email: user.email,
                  firstName: (user as any).firstName,
                  lastName: (user as any).lastName,
                  endDate,
                  planName,
                });
                console.log('📧 Cancellation email sent from webhook for user:', userId);
              }
            }
          } catch (error) {
            console.error('❌ Error processing cancel_at_period_end:', error);
          }
        }

        // Если подписка была полностью отменена (стала canceled)
        if (subscription.status === 'canceled' && previousAttributes?.status === 'active') {
          console.log('❌ Subscription was canceled immediately');
          const userId = subscription.metadata?.userId;
          if (userId) {
            try {
              await User.findByIdAndUpdate(userId, {
                role: 'guest',
                updatedAt: new Date()
              });
              console.log('✅ User role reverted to guest due to subscription cancellation:', userId);
            } catch (error) {
              console.error('❌ Error reverting user role:', error);
            }
          }
          // Обновляем локальную подписку как истекшую
          try {
            const subDoc = await Subscription.findOne({ stripeSubscriptionId: subscription.id });
            if (subDoc) {
              subDoc.status = 'expired';
              subDoc.autoRenewal = false;
              await subDoc.save();
              console.log('💾 Local subscription marked as expired');
            }
          } catch (e) {
            console.warn('⚠️ Could not update local subscription to expired:', e);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('🗑️ Subscription deleted:', subscription.id);
        
        // Изменяем роль пользователя обратно на 'guest'
        const userId = subscription.metadata?.userId;
        if (userId) {
          try {
            await User.findByIdAndUpdate(userId, {
              role: 'guest',
              updatedAt: new Date()
            });
            console.log('✅ User role reverted to guest due to subscription deletion:', userId);
          } catch (error) {
            console.error('❌ Error reverting user role:', error);
          }
        }
        // Обновляем локальную подписку как истекшую
        try {
          const subDoc = await Subscription.findOne({ stripeSubscriptionId: subscription.id });
          if (subDoc) {
            subDoc.status = 'expired';
            subDoc.autoRenewal = false;
            if (!subDoc.endDate) {
              subDoc.endDate = new Date();
            }
            await subDoc.save();
            console.log('💾 Local subscription marked as expired (deleted webhook)');
          }
        } catch (e) {
          console.warn('⚠️ Could not update local subscription to expired on deleted:', e);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('💸 Invoice payment failed:', invoice.id);
        console.log('Customer email:', invoice.customer_email);
        console.log('Subscription ID:', (invoice as any).subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const email = invoice.customer_email || undefined;
        if (email) {
          try {
            await sendPaymentReceiptEmail({
              email,
              amount: (invoice.amount_paid || 0) / 100,
              currency: invoice.currency || 'usd',
              planName: undefined,
              intervalText: undefined,
              sessionId: invoice.id,
            });
            await sendAdminStripeReceiptEmail({
              customerEmail: email,
              amount: (invoice.amount_paid || 0) / 100,
              currency: invoice.currency || 'usd',
              invoiceId: invoice.id,
              invoicePdfUrl: invoice.invoice_pdf,
              hostedInvoiceUrl: invoice.hosted_invoice_url,
              receiptUrl: invoice.charge?.receipt_url,
              subscriptionId: invoice.subscription,
            });
          } catch (e) {
            console.warn('⚠️ Не удалось отправить квитанцию по invoice:', e);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 