// FloatingEmoji.tsx
//효림이가 만든 하트가 나오는 버튼!
import React, { useState } from 'react';
import './floatingHeart.css';

// Emoji 타입 정의
interface Emoji {
  id: number;
  emoji: string;
}

const FloatingEmoji: React.FC = () => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  const addEmoji = () => {
    const newEmoji: Emoji = {
      id: Math.random(),
      emoji: '💖',
    };
    setEmojis([...emojis, newEmoji]);

    // 일정 시간 후 이모지를 제거
    setTimeout(() => {
      setEmojis((emojis) => emojis.filter((e) => e.id !== newEmoji.id));
    }, 2000); // 애니메이션 시간이 2초이므로, 2초 후에 제거
  };

  return (
    <div style={{ position: 'relative', height: '100px' }}>
      <div>
        {emojis.map((emoji) => (
          <span key={emoji.id} className="emoji">
            {emoji.emoji}
          </span>
        ))}
      </div>
      <button onClick={addEmoji}  style={{ backgroundColor: 'rgb(150, 50, 50)' }}>Emoji Up!</button>
    </div>
  );
};

export default FloatingEmoji;
