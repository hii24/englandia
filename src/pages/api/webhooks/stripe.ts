import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { dbConnect } from '@/server/db';
import { findUserById } from '@/server/db';
import { Schema, model, Types, models } from 'mongoose';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    const body = req.body;
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      console.error('Missing stripe-signature header');
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    if (!endpointSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({ error: 'Webhook signature verification failed' });
    }

    console.log('✅ Webhook signature verified successfully');
    console.log('📨 Received webhook event:', event.type, 'ID:', event.id);

    // Обрабатываем различные типы событий
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('💳 Checkout session completed:', session.id);
        
        // Получаем данные из метаданных
        const userId = session.metadata?.userId;
        const subscriptionType = session.metadata?.subscriptionType;
        const userEmail = session.metadata?.userEmail;
        
        if (userId && session.subscription) {
          try {
            // Получаем пользователя
            const user = await findUserById(userId);
            if (!user) {
              console.error('User not found for subscription activation:', userId);
              break;
            }

            // Обновляем роль пользователя с 'guest' на 'student'
            await User.findByIdAndUpdate(userId, {
              role: 'student',
              updatedAt: new Date()
            });

            console.log('✅ User role updated from guest to student:', {
              userId,
              userEmail,
              subscriptionType
            });

            // Здесь можно добавить создание записи подписки в базе данных
            // если нужно отслеживать подписки локально

          } catch (error) {
            console.error('❌ Error activating subscription:', error);
          }
        } else {
          console.log('⚠️ Missing userId or subscription in session:', {
            userId,
            subscription: session.subscription,
            metadata: session.metadata
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
        
        // Если подписка стала активной
        if (subscription.status === 'active' && previousAttributes?.status === 'incomplete') {
          console.log('✅ Subscription became active, payment completed');
        }
        
        // Если подписка была отменена
        if (subscription.status === 'canceled' && previousAttributes?.status === 'active') {
          console.log('❌ Subscription was canceled');
          
          // Можно добавить логику для изменения роли пользователя обратно на 'guest'
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
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('💸 Invoice payment failed:', invoice.id);
        console.log('Customer email:', invoice.customer_email);
        console.log('Subscription ID:', (invoice as any).subscription);
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