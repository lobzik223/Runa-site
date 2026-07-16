type RunaFinanceTextProps = {
  width?: number;
  height?: number;
  className?: string;
};

/* Тот же viewBox по высоте, что у RunaLogo (298×73 → 59px) */
const VIEW_H = 73;
const LETTER_SIZE = 68;

export default function RunaFinanceText({ width = 418, height = 59, className }: RunaFinanceTextProps) {
  const viewW = 520;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${viewW} ${VIEW_H}`}
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <linearGradient id="runaFinanceGrad" x1="-76" y1="14" x2="326" y2="195" gradientUnits="userSpaceOnUse">
          <stop offset="0.26" stopColor="#495AEE" />
          <stop offset="0.75" stopColor="#1F0280" />
        </linearGradient>
      </defs>
      <text
        x={viewW / 2}
        y="58"
        textAnchor="middle"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize={LETTER_SIZE}
        letterSpacing="4"
        fill="url(#runaFinanceGrad)"
      >
        FINANCE
      </text>
    </svg>
  );
}
