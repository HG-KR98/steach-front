import React from 'react';

interface ChartRowProps {
  data: number[];
}

const ChartRow: React.FC<ChartRowProps> = ({ data }) => {
  const maxValue: number = Math.max(...data);

  // 색상 배열 생성 (원하는 색상을 추가할 수 있음)
  const colors: string[] = [
    'rgb(208, 53, 66)',
    'rgb(45, 106, 199)',
    'rgb(208, 159, 54)',
    'rgb(67, 132, 38)',
    'gray',
  ];

  const shape: string[] = [
    '▲',
    '◆',
    '●',
    '■',
  ];

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px' }}>
        {data.map((value: number, index: number) => (
          <div
            key={index}
            style={{
              position: 'relative', // 상대적 위치 지정
              width: '50px',
              height: value === 0 ? '5px' : `${(value / maxValue) * 100}%`,
              backgroundColor: colors[index % colors.length],
              marginRight: '5px',
              animation: 'grow 0.8s ease-in-out', // 애니메이션 적용
              animationDelay: `${index * 0.1}s`, // 애니메이션 딜레이 추가
              transformOrigin: 'bottom', // 애니메이션의 기준점을 하단으로 설정
            }}
          >
            { (
              <span
                style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '15px',
                  color: 'black',
                }}
              >
                {value}
              </span>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '20px' }}>
        {data.map((_, index: number) => (
          <div
            key={index}
            style={{
              width: '50px',
              height: '18px',
              backgroundColor: colors[index % colors.length],
              marginRight: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
            }}
          >
            {shape[index % shape.length]}
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes grow {
            from {
              transform: scaleY(0);
            }
            to {
              transform: scaleY(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChartRow;
