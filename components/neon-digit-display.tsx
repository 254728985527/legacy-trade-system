'use client';

interface NeonDigitDisplayProps {
  digit: number;
  percentage: number;
  isHighest?: boolean;
  isLowest?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export function NeonDigitDisplay({
  digit,
  percentage,
  isHighest = false,
  isLowest = false,
  isSelected = false,
  onClick,
}: NeonDigitDisplayProps) {
  let borderColor = 'rgb(51, 51, 51)';
  let glowColor = 'rgba(51, 51, 51, 0.3)';
  let textColor = 'rgb(200, 200, 200)';

  if (isHighest) {
    borderColor = 'rgb(0, 255, 0)';
    glowColor = 'rgba(0, 255, 0, 0.6)';
    textColor = 'rgb(0, 255, 0)';
  } else if (isLowest) {
    borderColor = 'rgb(255, 51, 51)';
    glowColor = 'rgba(255, 51, 51, 0.6)';
    textColor = 'rgb(255, 51, 51)';
  }

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-2 cursor-pointer"
      style={{
        opacity: isSelected ? 1 : 0.7,
        transition: 'opacity 0.2s',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: `2px solid ${borderColor}`,
          boxShadow: `0 0 15px ${glowColor}, inset 0 0 10px ${glowColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          fontFamily: "'Courier New', monospace",
          color: textColor,
          transition: 'all 0.3s',
        }}
      >
        {digit}
      </div>
      <div
        style={{
          fontSize: '12px',
          fontWeight: '600',
          fontFamily: "'Courier New', monospace",
          color: textColor,
        }}
      >
        {percentage.toFixed(1)}%
      </div>
    </div>
  );
}
