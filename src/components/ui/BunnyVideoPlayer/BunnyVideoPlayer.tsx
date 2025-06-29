import React from 'react';

interface BunnyVideoPlayerProps {
  videoId: string;
  libraryId?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: boolean;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const BunnyVideoPlayer: React.FC<BunnyVideoPlayerProps> = ({
  videoId,
  libraryId = '459943', // ID библиотеки по умолчанию
  autoplay = false,
  loop = false,
  muted = false,
  preload = true,
  responsive = true,
  className = '',
  style = {}
}) => {
  const iframeSrc = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=${autoplay}&loop=${loop}&muted=${muted}&preload=${preload}&responsive=${responsive}`;

  return (
    <div 
      className={`bunny-video-player ${className}`}
      style={{ 
        position: 'relative', 
        paddingTop: '56.25%', 
        width: '100%',
        minHeight: '400px',
        ...style 
      }}
    >
      <iframe 
        src={iframeSrc}
        loading="lazy" 
        style={{ 
          border: 0, 
          position: 'absolute', 
          top: 0, 
          height: '100%', 
          width: '100%',
          borderRadius: '20px'
        }} 
        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" 
        allowFullScreen={true}
        title="Bunny.net Video Player"
      />
    </div>
  );
}; 