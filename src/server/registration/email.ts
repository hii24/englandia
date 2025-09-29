import nodemailer from 'nodemailer';

interface EmailData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

// Создаем транспортер для отправки email
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local')
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

export async function sendRegistrationEmail(data: EmailData): Promise<void> {
  try {
    const transporter = createTransporter();
    const frontendUrl = process.env.NEXT_PUBLIC_DOMAIN || process.env.FRONTEND_URL || 'https://englandia.me';
    
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
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
              <h3 style="margin-top: 0; color: #166534;">🚀 Готовы начать обучение?</h3>
              <p style="color: #166534; line-height: 1.6; margin: 0 0 10px;">Выберите подписку, которая подходит вам:</p>
              <ul style="color: #166534; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li><b>Базовый</b> — 8 уроков в месяц</li>
                <li><b>Стандарт</b> — 24 урока в месяц</li>
                <li><b>Премиум</b> — 48 уроков в месяц</li>
              </ul>
            </div>
          
            
            <p style="color: #666; line-height: 1.6;">
              Если у вас возникнут вопросы, не стесняйтесь обращаться к нам. 
              Мы всегда готовы помочь!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${frontendUrl}/dashboard" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Перейти в личный кабинет
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

Подписка и доступы:
- Базовый — 8 уроков/мес
- Стандарт — 24 урока/мес
- Премиум — 48 уроков/мес

Оформить подписку и начать занятия: ${frontendUrl}/dashboard

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

export async function sendTeacherRegistrationEmail({ email, password, firstName, lastName }: { email: string, password: string, firstName?: string, lastName?: string }) {
  try {
    const transporter = createTransporter();
    const frontendUrl = process.env.NEXT_PUBLIC_DOMAIN || process.env.FRONTEND_URL || 'https://englandia.me';
    
    // Если транспортер не создан (нет настроек), выводим данные в консоль
    if (!transporter) {
      console.log('=== EMAIL УЧИТЕЛЯ (РЕЖИМ РАЗРАБОТКИ) ===');
      console.log(`Кому: ${email}`);
      console.log(`Тема: Вас зарегистрировали как учителя на Eng-Landia`);
      console.log(`Имя: ${firstName} ${lastName}`);
      console.log(`Логин: ${email}`);
      console.log(`Пароль: ${password}`);
      console.log('=====================================');
      console.log('Для реальной отправки email настройте переменные окружения EMAIL_USER и EMAIL_PASSWORD');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@eng-landia.com',
      to: email,
      subject: 'Вас зарегистрировали как учителя на Eng-Landia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Добро пожаловать в команду Eng-Landia!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Вас зарегистрировали как учителя</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Здравствуйте, ${firstName} ${lastName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Вас зарегистрировали как учителя на платформе <strong>Eng-Landia</strong>. 
              Мы рады приветствовать вас в нашей команде преподавателей!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333;">Ваши данные для входа:</h3>
              <p style="margin: 10px 0;"><strong>Логин:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>Пароль:</strong> ${password}</p>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
              <h4 style="margin-top: 0; color: #166534;">🔐 Важная информация:</h4>
              <ul style="color: #166534; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Рекомендуем сменить пароль после первого входа в систему</li>
                <li>У вас есть доступ к панели учителя</li>
                <li>Вы можете просматривать назначенных учеников и их прогресс</li>
                <li>Доступны все материалы уроков и домашние задания</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Если у вас возникнут вопросы по работе с платформой, не стесняйтесь обращаться к администрации. 
              Мы всегда готовы помочь!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${frontendUrl}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Перейти на платформу
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
Добро пожаловать в команду Eng-Landia!

Здравствуйте, ${firstName} ${lastName}!

Вас зарегистрировали как учителя на платформе Eng-Landia. 
Мы рады приветствовать вас в нашей команде преподавателей!

Ваши данные для входа:
Логин: ${email}
Пароль: ${password}

🔐 Важная информация:
• Рекомендуем сменить пароль после первого входа в систему
• У вас есть доступ к панели учителя
• Вы можете просматривать назначенных учеников и их прогресс
• Доступны все материалы уроков и домашние задания

Если у вас возникнут вопросы по работе с платформой, не стесняйтесь обращаться к администрации. 
Мы всегда готовы помочь!

С уважением,
Команда Eng-Landia
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Teacher registration email отправлен успешно:', {
      messageId: info.messageId,
      to: email,
      subject: mailOptions.subject,
      teacherName: `${firstName} ${lastName}`
    });
    
  } catch (error) {
    console.error('Ошибка отправки teacher registration email:', error);
    
    // В режиме разработки выводим данные в консоль
    if (process.env.NODE_ENV === 'development') {
      console.log('=== EMAIL УЧИТЕЛЯ (РЕЖИМ РАЗРАБОТКИ) ===');
      console.log(`Кому: ${email}`);
      console.log(`Тема: Вас зарегистрировали как учителя на Eng-Landia`);
      console.log(`Имя: ${firstName} ${lastName}`);
      console.log(`Логин: ${email}`);
      console.log(`Пароль: ${password}`);
      console.log('=====================================');
    }
    
    throw new Error('Не удалось отправить email с данными для входа учителю');
  }
}

export async function sendPasswordResetEmail({ email, firstName, lastName, newPassword }: { email: string, firstName?: string, lastName?: string, newPassword: string }) {
  try {
    const transporter = createTransporter();
    const frontendUrl = process.env.NEXT_PUBLIC_DOMAIN || process.env.FRONTEND_URL || 'https://englandia.me';
    
    // Если транспортер не создан (нет настроек), выводим данные в консоль
    if (!transporter) {
      console.log('=== EMAIL ВОССТАНОВЛЕНИЯ ПАРОЛЯ (РЕЖИМ РАЗРАБОТКИ) ===');
      console.log(`Кому: ${email}`);
      console.log(`Тема: Восстановление пароля - Eng-Landia`);
      console.log(`Имя: ${firstName} ${lastName}`);
      console.log(`Логин: ${email}`);
      console.log(`Новый пароль: ${newPassword}`);
      console.log('=====================================');
      console.log('Для реальной отправки email настройте переменные окружения EMAIL_USER и EMAIL_PASSWORD');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@eng-landia.com',
      to: email,
      subject: 'Восстановление пароля - Eng-Landia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Восстановление пароля</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Eng-Landia</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Здравствуйте, ${firstName} ${lastName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Вы запросили восстановление пароля для вашего аккаунта на платформе <strong>Eng-Landia</strong>.
              Мы сгенерировали для вас новый пароль.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #333;">Ваши новые данные для входа:</h3>
              <p style="margin: 10px 0;"><strong>Логин:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>Новый пароль:</strong> ${newPassword}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h4 style="margin-top: 0; color: #856404;">⚠️ Важная информация:</h4>
              <ul style="color: #856404; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Рекомендуем сменить пароль после входа в систему</li>
                <li>Храните пароль в безопасном месте</li>
                <li>Не передавайте пароль третьим лицам</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Если вы не запрашивали восстановление пароля, пожалуйста, свяжитесь с нами немедленно.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${frontendUrl}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Войти в систему
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
Восстановление пароля - Eng-Landia

Здравствуйте, ${firstName} ${lastName}!

Вы запросили восстановление пароля для вашего аккаунта на платформе Eng-Landia.
Мы сгенерировали для вас новый пароль.

Ваши новые данные для входа:
Логин: ${email}
Новый пароль: ${newPassword}

Важная информация:
- Рекомендуем сменить пароль после входа в систему
- Храните пароль в безопасном месте
- Не передавайте пароль третьим лицам

Если вы не запрашивали восстановление пароля, пожалуйста, свяжитесь с нами немедленно.

С уважением,
Команда Eng-Landia
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Password reset email отправлен успешно:', {
      messageId: info.messageId,
      to: email,
      subject: mailOptions.subject,
      userName: `${firstName} ${lastName}`
    });
    
  } catch (error) {
    console.error('Ошибка отправки password reset email:', error);
    
    // В режиме разработки выводим данные в консоль
    if (process.env.NODE_ENV === 'development') {
      console.log('=== EMAIL ВОССТАНОВЛЕНИЯ ПАРОЛЯ (РЕЖИМ РАЗРАБОТКИ) ===');
      console.log(`Кому: ${email}`);
      console.log(`Тема: Восстановление пароля - Eng-Landia`);
      console.log(`Имя: ${firstName} ${lastName}`);
      console.log(`Логин: ${email}`);
      console.log(`Новый пароль: ${newPassword}`);
      console.log('=====================================');
    }
    
    throw new Error('Не удалось отправить email с новым паролем');
  }
} 

export async function sendAdminNewStudentEmail({ firstName, lastName, email, phone, age }: { firstName: string, lastName: string, email: string, phone?: string, age?: number }) {
  try {
    const transporter = createTransporter();
    const adminEmail = 'englandiame@gmail.com';
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@eng-landia.com',
      to: adminEmail,
      subject: 'Новый ученик на платформе Eng-Landia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Новый ученик зарегистрировался!</h1>
          </div>
          <div style="background: #f8f9fa; padding: 24px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Данные ученика:</h2>
            <ul style="color: #333; font-size: 16px;">
              <li><b>Имя:</b> ${firstName}</li>
              <li><b>Фамилия:</b> ${lastName}</li>
              <li><b>Email:</b> ${email}</li>
              ${phone ? `<li><b>Телефон:</b> ${phone}</li>` : ''}
              ${age ? `<li><b>Возраст:</b> ${age}</li>` : ''}
            </ul>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>Это автоматическое уведомление. Не отвечайте на него.</p>
            <p>&copy; 2025 Eng-Landia</p>
          </div>
        </div>
      `,
      text: `Новый ученик зарегистрировался!\n\nИмя: ${firstName}\nФамилия: ${lastName}\nEmail: ${email}${phone ? `\nТелефон: ${phone}` : ''}${age ? `\nВозраст: ${age}` : ''}`
    };
    await transporter.sendMail(mailOptions);
    console.log('Admin notification email отправлен успешно:', { to: adminEmail, student: email });
  } catch (error) {
    console.error('Ошибка отправки письма админу о новом ученике:', error);
  }
} 

export async function sendPaymentReceiptEmail({
  email,
  amount,
  currency,
  planName,
  intervalText,
  sessionId,
}: {
  email: string;
  amount: number; // в базовой валюте (например, usd)
  currency: string;
  planName?: string;
  intervalText?: string; // например: "1 month", "3 months"
  sessionId?: string;
}): Promise<void> {
  try {
    const transporter = createTransporter();
    const symbols: Record<string, string> = {
      rub: '₽', usd: '$', eur: '€', kzt: '₸', uah: '₴', gbp: '£', cny: '¥', jpy: '¥', byn: 'Br', pln: 'zł', czk: 'Kč', try: '₺'
    };
    const sym = symbols[currency?.toLowerCase?.() || ''] || currency?.toUpperCase?.() || '';
    const amountFormatted = `${amount} ${sym}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@eng-landia.com',
      to: email,
      subject: 'Квитанция об оплате — Eng-Landia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 22px;">Оплата прошла успешно</h1>
          </div>
          <div style="background: #f8f9fa; padding: 24px; border-radius: 0 0 10px 10px;">
            <p style="color: #333; line-height: 1.6; margin: 0 0 12px;">Спасибо за оплату на платформе <b>Eng-Landia</b>.</p>
            <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 12px;">
              <p style="margin: 6px 0;"><b>Сумма:</b> ${amountFormatted}</p>
              ${planName ? `<p style="margin: 6px 0;"><b>Тариф:</b> ${planName}${intervalText ? ` (${intervalText})` : ''}</p>` : ''}
              ${sessionId ? `<p style="margin: 6px 0;"><b>Номер операции:</b> ${sessionId}</p>` : ''}
            </div>
            <p style="color: #666; line-height: 1.6;">Квитанция сформирована автоматически. Если у вас есть вопросы, ответьте на это письмо.</p>
          </div>
        </div>
      `,
      text: `Оплата прошла успешно\n\nСумма: ${amountFormatted}\n${planName ? `Тариф: ${planName}${intervalText ? ` (${intervalText})` : ''}\n` : ''}${sessionId ? `Номер операции: ${sessionId}\n` : ''}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Payment receipt email отправлен:', { to: email, amount, currency, sessionId });
  } catch (error) {
    console.error('Ошибка отправки квитанции:', error);
  }
}