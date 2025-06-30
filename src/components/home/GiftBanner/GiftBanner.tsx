'use client';

import { useModal } from '@/hooks/useModal';
import { Button } from '@/components/ui';
import styles from './GiftBanner.module.scss';

interface GiftBannerProps {
  showIcon?: boolean;
  iconColor?: 'default' | 'white';
}

export default function GiftBanner({ 
  showIcon = true, 
  iconColor = 'default' 
}: GiftBannerProps) {
  const { openRegistrationModal } = useModal();

  const handleGetGift = () => {
    openRegistrationModal();
  };

  return (
    <section className={styles.giftBanner}>
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.content}>
            <div className={styles.titleBlock}>
              <h3 className={styles.subtitle}>Подарок!</h3>
              <h2 className={styles.title}>1 месяц бесплатных занятий</h2>
            </div>

            <p className={styles.description}>
              в нашем разговорном клубе, при покупке пакета занятий на 6-12
              месяцев
            </p>

            <div className={styles.buttonWrapper}>
              <Button 
                className={styles.giftButton}
                onClick={handleGetGift}
                showIcon={showIcon}
                iconColor={iconColor}
              >
                Получить подарок
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 