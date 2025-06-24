import nodemailer from 'nodemailer';

interface EmailData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

// Создаем транспортер для отправки email
const createTransporter = () => {
  // Проверяем, настроены ли переменные окружения
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email не настроен. Создаем тестовый транспортер.');
    return null;
  }

  // Для разработки используем Gmail SMTP
  // В продакшене лучше использовать специализированные сервисы (SendGrid, Mailgun, etc.)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // App Password для Gmail
    },
  });
};

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

export async function sendRegistrationEmail(data: EmailData): Promise<void> {
  try {
    const transporter = createTransporter();
    
    // Если транспортер не создан (нет настроек), выводим данные в консоль
    if (!transporter) {
      console.log('=== EMAIL ДАННЫЕ (РЕЖИМ РАЗРАБОТКИ) ===');
      console.log(`Кому: ${data.email}`);
      console.log(`Тема: Добро пожаловать в Eng-Landia!`);
      console.log(`Имя: ${data.firstName} ${data.lastName}`);
      console.log(`Логин: ${data.email}`);
      console.log(`Пароль: ${data.password}`);
      console.log('=====================================');
      console.log('Для реальной отправки email настройте переменные окружения EMAIL_USER и EMAIL_PASSWORD');
      return;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@eng-landia.com',
      to: data.email,
      subject: 'Добро пожаловать в Eng-Landia!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Добро пожаловать в Eng-Landia!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Ваша регистрация прошла успешно</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Здравствуйте, ${data.firstName} ${data.lastName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Спасибо за регистрацию в нашей платформе обучения английскому языку. 
              Мы рады приветствовать вас в сообществе Eng-Landia!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333;">Ваши данные для входа:</h3>
              <p style="margin: 10px 0;"><strong>Логин:</strong> ${data.email}</p>
              <p style="margin: 10px 0;"><strong>Пароль:</strong> ${data.password}</p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>Важно:</strong> Рекомендуем сменить пароль после первого входа в систему.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Если у вас возникнут вопросы, не стесняйтесь обращаться к нам. 
              Мы всегда готовы помочь!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Перейти на сайт
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>Это автоматическое письмо, не отвечайте на него.</p>
            <p>&copy; 2024 Eng-Landia. Все права защищены.</p>
          </div>
        </div>
      `,
      text: `
Добро пожаловать в Eng-Landia!

Здравствуйте, ${data.firstName} ${data.lastName}!

Спасибо за регистрацию в нашей платформе обучения английскому языку. 
Мы рады приветствовать вас в сообществе Eng-Landia!

Ваши данные для входа:
Логин: ${data.email}
Пароль: ${data.password}

Важно: Рекомендуем сменить пароль после первого входа в систему.

Если у вас возникнут вопросы, не стесняйтесь обращаться к нам. 
Мы всегда готовы помочь!

С уважением,
Команда Eng-Landia
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email отправлен успешно:', {
      messageId: info.messageId,
      to: data.email,
      subject: mailOptions.subject,
    });
    
  } catch (error) {
    console.error('Ошибка отправки email:', error);
    
    // В режиме разработки выводим данные в консоль
    if (process.env.NODE_ENV === 'development') {
      console.log('=== EMAIL ДАННЫЕ (РЕЖИМ РАЗРАБОТКИ) ===');
      console.log(`Кому: ${data.email}`);
      console.log(`Тема: Добро пожаловать в Eng-Landia!`);
      console.log(`Имя: ${data.firstName} ${data.lastName}`);
      console.log(`Логин: ${data.email}`);
      console.log(`Пароль: ${data.password}`);
      console.log('=====================================');
    }
    
    throw new Error('Не удалось отправить email с данными для входа');
  }
} 