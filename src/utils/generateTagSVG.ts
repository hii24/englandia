export interface TagData {
  text: string;
  isEmoji?: boolean;
}

export const generateTagSVG = (tagData: TagData): string => {
  const { text, isEmoji = false } = tagData;
  
  // Создаем временный элемент для измерения размеров текста
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.visibility = 'hidden';
  tempDiv.style.whiteSpace = 'nowrap';
  tempDiv.style.fontFamily = isEmoji ? 'Inter, sans-serif' : 'Rubik, sans-serif';
  tempDiv.style.fontWeight = isEmoji ? '400' : '600';
  tempDiv.style.fontSize = isEmoji ? '24px' : '16px';
  tempDiv.style.lineHeight = isEmoji ? '1.2' : '1.5';
  tempDiv.textContent = text;
  
  document.body.appendChild(tempDiv);
  const textWidth = tempDiv.offsetWidth;
  const textHeight = tempDiv.offsetHeight;
  document.body.removeChild(tempDiv);
  
  const padding = isEmoji ? 10 : 20;
  const paddingVertical = 10;
  const width = isEmoji ? 50 : textWidth + (padding * 2);
  const height = isEmoji ? 50 : textHeight + (paddingVertical * 2);
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .tag-text {
            font-family: ${isEmoji ? 'Inter, sans-serif' : 'Rubik, sans-serif'};
            font-weight: ${isEmoji ? '400' : '600'};
            font-size: ${isEmoji ? '24px' : '16px'};
            fill: #000000;
            text-anchor: middle;
            dominant-baseline: central;
          }
        </style>
      </defs>
      <rect 
        x="0" 
        y="0" 
        width="${width}" 
        height="${height}" 
        rx="25" 
        ry="25" 
        fill="#ffffff" 
        stroke="#ffffff" 
        stroke-width="1"
      />
      <text 
        x="${width / 2}" 
        y="${height / 2}" 
        class="tag-text"
      >${text}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}; 