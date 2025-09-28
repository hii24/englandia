'use client';
import Image from 'next/image';
import { BunnyVideoPlayer } from '@/components/ui';
import styles from './VideoSection.module.scss';

interface VideoSectionProps {
  videoId?: string;
  showVideo?: boolean;
  id?: string;
}

export default function VideoSection({ 
  videoId = '02fd037d-e52b-4bb8-a6be-a8b64cf80e81', 
  showVideo = true,
  id
}: VideoSectionProps) {
  return (
    <section className={styles.videoSection} id={id}>
      <div className={styles.container}>
        <h2 className={styles.title}>Как проходят наши уроки</h2>
        
        <div className={styles.videoLayout}>
          {/* Background images */}
          <div className={styles.backgroundImages}>
            <Image 
              src="/video-bg-1.png" 
              alt="Урок английского 1" 
              width={468} 
              height={776}
              className={styles.bgImage1}
            />
            <Image 
              src="/video-bg-2.jpg" 
              alt="Урок английского 2" 
              width={297} 
              height={297}
              className={styles.bgImage2}
            />
          </div>
          
          {/* Main video container */}
          <div className={styles.videoContainer}>
            {showVideo && (
              <div className={styles.videoPlayer}>
                <BunnyVideoPlayer
                  videoId={videoId}
                  autoplay={false}
                  className={styles.bunnyPlayer}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 