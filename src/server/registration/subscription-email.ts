import nodemailer from 'nodemailer';
import { findUserById } from '../db';
import Lesson from '../lessons/model';
import StudentProgress from '../progress/model';
import { Types } from 'mongoose';

interface SubscriptionEmailData {
  studentId: string;
  studentEmail: string;
  studentName: string;
  lessonTitle: string;
}

// Создаем транспортер для отправки email
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Gmail credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env.local')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

// Альтернативная конфигурация для других SMTP серверов
const createCustomTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true для 465, false для других портов
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendSubscriptionEmail(data: SubscriptionEmailData): Promise<void> {
  try {
    const transporter = createTransporter();
    
    // Если транспортер не создан (нет настроек), выводим данные в консоль
    if (!transporter) {
      console.log('=== EMAIL ПОДПИСКИ (РЕЖИМ РАЗРАБОТКИ) ===');
      console.log(`Кому: ${data.studentEmail}`);
      console.log(`Тема: Поздравляем с первым уроком! Оформите подписку`);
      console.log(`Студент: ${data.studentName}`);
      console.log(`Урок: ${data.lessonTitle}`);
      console.log('==========================================');
      console.log('Для реальной отправки email настройте переменные окружения EMAIL_USER и EMAIL_PASSWORD');
      return;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@eng-landia.com',
      to: data.studentEmail,
      subject: 'Поздравляем с первым уроком! Оформите подписку',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Поздравляем!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Вы успешно завершили первый урок</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Здравствуйте, ${data.studentName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Отличная работа! Вы успешно завершили урок <strong>"${data.lessonTitle}"</strong> 
              и сделали первый шаг в изучении английского языка с Eng-Landia.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333;">🚀 Готовы продолжить обучение?</h3>
              <p style="color: #666; line-height: 1.6;">
                Чтобы получить доступ ко всем урокам и материалам, оформите подписку на нашу платформу.
              </p>
              <ul style="color: #666; line-height: 1.6;">
                <li>✅ Доступ ко всем урокам курса</li>
                <li>✅ Персональные занятия с учителем</li>
                <li>✅ Домашние задания и материалы</li>
                <li>✅ Отслеживание прогресса</li>
                <li>✅ Гибкое расписание занятий</li>
              </ul>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
              <h3 style="margin-top: 0; color: #166534;">💡 Наши тарифы:</h3>
              <div style="display: flex; gap: 20px; margin-top: 15px;">
                <div style="flex: 1; background: white; padding: 15px; border-radius: 6px; text-align: center;">
                  <h4 style="margin: 0 0 10px 0; color: #333;">Базовый</h4>
                  <p style="margin: 0; font-size: 24px; font-weight: bold; color: #667eea;">4 урока/мес</p>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Идеально для начинающих</p>
                </div>
                <div style="flex: 1; background: white; padding: 15px; border-radius: 6px; text-align: center;">
                  <h4 style="margin: 0 0 10px 0; color: #333;">Интенсивный</h4>
                  <p style="margin: 0; font-size: 24px; font-weight: bold; color: #667eea;">8 уроков/мес</p>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Для быстрого прогресса</p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                🎯 Оформить подписку
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-top: 20px;">
              Если у вас возникнут вопросы по подписке или обучению, не стесняйтесь обращаться к нам. 
              Мы всегда готовы помочь!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>Это автоматическое письмо, не отвечайте на него.</p>
            <p>&copy; 2024 Eng-Landia. Все права защищены.</p>
          </div>
        </div>
      `,
      text: `
Поздравляем с первым уроком! Оформите подписку

Здравствуйте, ${data.studentName}!

Отличная работа! Вы успешно завершили урок "${data.lessonTitle}" 
и сделали первый шаг в изучении английского языка с Eng-Landia.

🚀 Готовы продолжить обучение?

Чтобы получить доступ ко всем урокам и материалам, оформите подписку на нашу платформу.

✅ Доступ ко всем урокам курса
✅ Персональные занятия с учителем
✅ Домашние задания и материалы
✅ Отслеживание прогресса
✅ Гибкое расписание занятий

💡 Наши тарифы:
- Базовый: 4 урока/мес (идеально для начинающих)
- Интенсивный: 8 уроков/мес (для быстрого прогресса)

Оформить подписку: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription

Если у вас возникнут вопросы по подписке или обучению, не стесняйтесь обращаться к нам. 
Мы всегда готовы помочь!

С уважением,
Команда Eng-Landia
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Subscription email отправлен успешно:', {
      messageId: info.messageId,
      to: data.studentEmail,
      subject: mailOptions.subject,
      studentName: data.studentName,
      lessonTitle: data.lessonTitle
    });
    
  } catch (error) {
    console.error('Ошибка отправки subscription email:', error);
    
    // В режиме разработки выводим данные в консоль
    if (process.env.NODE_ENV === 'development') {
      console.log('=== EMAIL ПОДПИСКИ (РЕЖИМ РАЗРАБОТКИ) ===');
      console.log(`Кому: ${data.studentEmail}`);
      console.log(`Тема: Поздравляем с первым уроком! Оформите подписку`);
      console.log(`Студент: ${data.studentName}`);
      console.log(`Урок: ${data.lessonTitle}`);
      console.log('==========================================');
    }
    
    throw new Error('Не удалось отправить email с предложением подписки');
  }
}

// Функция для проверки, является ли это первым завершенным уроком студента
export async function checkAndSendSubscriptionEmail(studentId: string, lessonId: string): Promise<void> {
  try {
    // Получаем данные студента
    const student = await findUserById(studentId);
    if (!student) {
      console.log('Student not found for subscription email:', studentId);
      return;
    }

    // Проверяем, что студент имеет роль 'guest' (не имеет подписки)
    if (student.role !== 'guest') {
      console.log('Student already has subscription, skipping email:', studentId);
      return;
    }

    // Получаем данные урока
    const lesson = await Lesson.findById(lessonId);
    const lessonTitle = lesson?.title || "Первый урок";

    // Проверяем, что это действительно первый урок (orderNumber === 1)
    if (lesson && lesson.orderNumber !== 1) {
      console.log('Not the first lesson, skipping subscription email:', lessonId);
      return;
    }

    // Проверяем, что у студента нет других завершенных уроков
    const completedLessons = await StudentProgress.find({
      studentId: new Types.ObjectId(studentId),
      attended: true,
      lessonId: { $ne: new Types.ObjectId(lessonId) }
    });

    if (completedLessons.length > 0) {
      console.log('Student already has other completed lessons, skipping subscription email:', studentId);
      return;
    }

    // Отправляем email с предложением подписки
    await sendSubscriptionEmail({
      studentId,
      studentEmail: student.email,
      studentName: `${student.firstName} ${student.lastName}`,
      lessonTitle
    });

    console.log('Subscription email sent successfully for student:', studentId);
    
  } catch (error) {
    console.error('Error in checkAndSendSubscriptionEmail:', error);
    // Не бросаем ошибку, чтобы не прерывать основной процесс
  }
} 