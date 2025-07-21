'use client';

import { useState } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <section className={styles.videoSection} id={id}>
      <div className={styles.container}>
        <h2 className={styles.title}>Как проходят наши уроки</h2>
        
        <div className={styles.videoLayout}>
          {/* Background images */}
          <div className={styles.backgroundImages}>
            <Image 
              src="/video-bg-1.jpg" 
              alt="Урок английского 1" 
              width={468} 
              height={576}
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
            {!isPlaying && (
              <>
                <Image 
                  src="/video-bg-3.jpg" 
                  alt="Превью видео урока" 
                  width={900} 
                  height={500}
                  className={styles.videoPreview}
                />
                <button 
                  className={styles.playButton}
                  onClick={handlePlayClick}
                  aria-label="Воспроизвести видео"
                >
                  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8L30 19L12 30V8Z" fill="#440693"/>
                  </svg>
                </button>
              </>
            )}
            
            {isPlaying && showVideo && (
              <div className={styles.videoPlayer}>
                <BunnyVideoPlayer
                  videoId={videoId}
                  autoplay={true}
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