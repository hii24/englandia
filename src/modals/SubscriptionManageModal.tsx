import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button/Button';

interface SubscriptionManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: any | null;
  loading: boolean;
  onCancel: () => Promise<void>;
  onPay: (type: 'basic' | 'standard' | 'premium') => Promise<void>;
}

export const SubscriptionManageModal: React.FC<SubscriptionManageModalProps> = ({
  isOpen,
  onClose,
  subscription,
  loading,
  onCancel,
  onPay
}) => {
  const [cancelLoading, setCancelLoading] = useState(false);
  const [payLoading, setPayLoading] = useState<'basic' | 'standard' | 'premium' | null>(null);
  const [prices, setPrices] = useState<{
    basic: number;
    standard: number;
    premium: number;
    basicCurrency: string;
    standardCurrency: string;
    premiumCurrency: string;
  } | null>(null);
  const [pricesLoading, setPricesLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPricesLoading(true);
      fetch('/api/subscription/prices')
        .then(res => res.json())
        .then(data => {
          setPrices({
            basic: data.basic,
            standard: data.standard,
            premium: data.premium,
            basicCurrency: data.basicCurrency,
            standardCurrency: data.standardCurrency,
            premiumCurrency: data.premiumCurrency
          });
        })
        .catch(() => setPrices(null))
        .finally(() => setPricesLoading(false));
    }
  }, [isOpen]);

  // Корректное отображение "Действует до" и статуса
  let endDateText = '—';
  let statusText = '';
  if (subscription && subscription.status === 'active') {
    if (subscription.cancelAtPeriodEnd && subscription.endDate) {
      endDateText = new Date(subscription.endDate).toLocaleDateString();
      statusText = `Подписка отменена, действует до ${endDateText}`;
    } else if (subscription.endDate) {
      endDateText = new Date(subscription.endDate).toLocaleDateString();
      statusText = 'Активна, продлевается автоматически';
    } else if (subscription.autoRenewal) {
      endDateText = 'Подписка продлевается автоматически';
      statusText = 'Активна, продлевается автоматически';
    } else {
      endDateText = '—';
      statusText = 'Активна';
    }
  } else if (subscription && subscription.status === 'cancelled' && subscription.endDate) {
    endDateText = new Date(subscription.endDate).toLocaleDateString();
    statusText = `Подписка отменена, действует до ${endDateText}`;
  }

  // Функция для красивого отображения валюты
  function formatPrice(amount: number | null, currency: string | undefined) {
    if (!amount || !currency) return '';
    const symbols: Record<string, string> = {
      rub: '₽',
      usd: '$',
      eur: '€',
      kzt: '₸',
      uah: '₴',
      gbp: '£',
      cny: '¥',
      jpy: '¥',
      byn: 'Br',
      pln: 'zł',
      czk: 'Kč',
      try: '₺',
    };
    const symbol = symbols[currency.toLowerCase()] || currency.toUpperCase();
    return `${amount} ${symbol}`;
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-4">Управление подпиской</h2>
        {loading ? (
          <div>Загрузка...</div>
        ) : subscription && subscription.status === 'active' ? (
          <>
            <div className="mb-4">
              <div className="text-lg font-semibold mb-2">Текущий тариф: {
                subscription.type === 'basic'
                  ? 'Базовый (8 уроков/мес)'
                  : subscription.type === 'standard'
                  ? 'Стандарт (24 урока/мес)'
                  : 'Премиум (48 уроков/мес)'
              }</div>
              <div className="text-gray-600 mb-2">Статус: <b>{statusText}</b></div>
              <div className="text-gray-600 mb-2">Автопродление: {subscription.autoRenewal ? 'Включено' : 'Отключено'}</div>
              <div className="text-gray-600 mb-2">Действует до: {endDateText}</div>
              
            </div>
            {!subscription.cancelAtPeriodEnd && (
              <Button 
                variant="danger" 
                size="large" 
                fullWidth 
                loading={cancelLoading}
                onClick={async () => {
                  setCancelLoading(true);
                  await onCancel();
                  setCancelLoading(false);
                }}
              >Отменить подписку</Button>
            )}
            {subscription.cancelAtPeriodEnd && (
              <div className="text-yellow-600 font-semibold mt-2 mb-2">Подписка уже отменена, доступ сохранится до конца оплаченного периода.</div>
            )}
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="text-lg font-semibold mb-2">Выберите тариф для оформления подписки:</div>
              <div className="flex flex-col gap-4">
                <div className="border rounded-lg p-4 text-left">
                  <div className="font-bold mb-1">Базовый</div>
                  <div className="mb-2">8 уроков в месяц</div>
                  <Button 
                    variant="primary" 
                    size="large" 
                    fullWidth 
                    loading={payLoading === 'basic' || pricesLoading}
                    disabled={pricesLoading || !prices}
                    onClick={async () => {
                      setPayLoading('basic');
                      await onPay('basic');
                      setPayLoading(null);
                    }}
                  >Оформить {prices ? formatPrice(prices.basic, prices.basicCurrency) : ''}</Button>
                </div>
                <div className="border rounded-lg p-4 text-left">
                  <div className="font-bold mb-1">Стандарт</div>
                  <div className="mb-2">24 урока в месяц</div>
                  <Button 
                    variant="primary" 
                    size="large" 
                    fullWidth 
                    loading={payLoading === 'standard' || pricesLoading}
                    disabled={pricesLoading || !prices}
                    onClick={async () => {
                      setPayLoading('standard');
                      await onPay('standard');
                      setPayLoading(null);
                    }}
                  >Оформить {prices ? formatPrice(prices.standard, prices.standardCurrency) : ''}</Button>
                </div>
                <div className="border rounded-lg p-4 text-left">
                  <div className="font-bold mb-1">Премиум</div>
                  <div className="mb-2">48 уроков в месяц</div>
                  <Button 
                    variant="primary" 
                    size="large" 
                    fullWidth 
                    loading={payLoading === 'premium' || pricesLoading}
                    disabled={pricesLoading || !prices}
                    onClick={async () => {
                      setPayLoading('premium');
                      await onPay('premium');
                      setPayLoading(null);
                    }}
                  >Оформить {prices ? formatPrice(prices.premium, prices.premiumCurrency) : ''}</Button>
                </div>
              </div>
            </div>
          </>
        )}
        
      </div>
    </Modal>
  );
}; 