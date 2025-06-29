# Исправление Webhook Signature Verification Failed

## Проблема
Webhook доходит до сервера, но проваливается верификация подписи:
```
HTTP status code: 400
"error": "Webhook signature verification failed"
```

## Решение

### 1. Получите правильный webhook secret

1. Перейдите в [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Найдите ваш webhook endpoint
3. Нажмите на него
4. В разделе "Signing secret" нажмите "Reveal"
5. Скопируйте секрет (начинается с `whsec_`)

### 2. Обновите переменную окружения

В файле `.env.local` обновите:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
```

### 3. Перезапустите сервер

```bash
bun run dev
```

### 4. Проверьте логи

После следующей оплаты в логах сервера должно появиться:
```
✅ Webhook signature verified successfully
📨 Received webhook event: checkout.session.completed
```

## Проверка

1. Перейдите на `/test-webhook`
2. Запустите "Проверить переменные окружения"
3. Убедитесь, что `STRIPE_WEBHOOK_SECRET` показывает `✅`

## Важно

- Webhook secret должен начинаться с `whsec_`
- Не используйте старый или неправильный secret
- После изменения переменной окружения обязательно перезапустите сервер 