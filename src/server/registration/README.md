# Настройка Email для регистрации

## Переменные окружения

Создайте файл `.env` в корне проекта со следующими переменными:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=englandia

# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@eng-landia.com

# Alternative SMTP Configuration
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## Настройка Gmail для отправки email

### 1. Включение двухфакторной аутентификации
1. Перейдите в настройки Google аккаунта
2. Включите двухфакторную аутентификацию

### 2. Создание App Password
1. В настройках безопасности найдите "Пароли приложений"
2. Создайте новый пароль для приложения
3. Используйте этот пароль в `EMAIL_PASSWORD`

### 3. Альтернативные SMTP сервисы

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

#### Yandex
```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_USER=your-email@yandex.ru
SMTP_PASS=your-app-password
SMTP_SECURE=true
```

## Тестирование

Для тестирования в режиме разработки:
1. Установите переменные окружения
2. Запустите сервер: `bun run dev`
3. Зарегистрируйте нового пользователя
4. Проверьте консоль сервера на наличие логов отправки email

## Troubleshooting

### Ошибка "Invalid login"
- Проверьте правильность email и пароля
- Убедитесь, что используется App Password, а не обычный пароль

### Ошибка "Connection timeout"
- Проверьте настройки брандмауэра
- Убедитесь, что порт 587 не заблокирован

### Email не отправляется
- Проверьте логи в консоли
- Убедитесь, что все переменные окружения установлены
- В режиме разработки данные email выводятся в консоль 