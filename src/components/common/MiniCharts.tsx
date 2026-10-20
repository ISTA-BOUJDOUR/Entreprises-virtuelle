import React from 'react';
import { TrendingUp, TrendingDown, Users, Wallet, Smile, ArrowUpRight } from 'lucide-react';
import { PeriodPerformance } from '../../types/simulation';

interface TrendMiniChartProps {
  title: string;
  data: { label: string; value: number }[];
  color: 'orange' | 'emerald' | 'blue' | 'purple';
  unit?: string;
  formatter?: (val: number) => string;
  currentValue: number;
  previousValue?: number;
}

export const TrendMiniChart: React.FC<TrendMiniChartProps> = ({
  title,
  data,
  color,
  unit = 'MAD',
  formatter = (v) => v.toLocaleString('fr-FR'),
  currentValue,
  previousValue,
}) => {
  const hasHistory = data.length > 1;
  const values = data.map(d => d.value);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 100);
  const range = maxVal - minVal || 1;

  // SVG dimensions
  const width = 280;
  const height = 80;
  const paddingX = 15;
  const paddingY = 12;

  // Calculate coordinates for SVG polyline
  const points = data.map((d, index) => {
    const x = paddingX + (index / Math.max(data.length - 1, 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((d.value - minVal) / range) * (height - 2 * paddingY);
    return { x, y, label: d.label, val: d.value };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Area under curve
  const areaPoints = points.length > 0 
    ? `${points[0].x},${height - paddingY} ${polylinePoints} ${points[points.length - 1].x},${height - paddingY}`
    : '';

  const colorStyles = {
    orange: {
      stroke: '#ea580c',
      fill: 'rgba(234, 88, 12, 0.12)',
      dot: '#ea580c',
      badge: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    emerald: {
      stroke: '#059669',
      fill: 'rgba(5, 150, 105, 0.12)',
      dot: '#059669',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    blue: {
      stroke: '#2563eb',
      fill: 'rgba(37, 99, 235, 0.12)',
      dot: '#2563eb',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    purple: {
      stroke: '#9333ea',
      fill: 'rgba(147, 51, 234, 0.12)',
      dot: '#9333ea',
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  }[color];

  const diffPct = previousValue !== undefined && previousValue !== 0
    ? Math.round(((currentValue - previousValue) / Math.abs(previousValue)) * 100)
    : null;

  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {title}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900">
              {formatter(currentValue)} {unit}
            </span>
            {diffPct !== null && (
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                diffPct >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {diffPct >= 0 ? '+' : ''}{diffPct}%
              </span>
            )}
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${colorStyles.badge}`}>
          {data.length} période(s)
        </span>
      </div>

      {/* Mini SVG Chart */}
      <div className="mt-2 w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16 overflow-visible">
          <defs>
            <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colorStyles.stroke} stopOpacity="0.25" />
              <stop offset="100%" stopColor={colorStyles.stroke} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area */}
          {hasHistory && areaPoints && (
            <polygon
              points={areaPoints}
              fill={`url(#grad-${color})`}
            />
          )}

          {/* Polyline */}
          {hasHistory ? (
            <polyline
              fill="none"
              stroke={colorStyles.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />
          ) : (
            <line
              x1={paddingX}
              y1={height / 2}
              x2={width - paddingX}
              y2={height / 2}
              stroke={colorStyles.stroke}
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {/* Points */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#ffffff"
                stroke={colorStyles.stroke}
                strokeWidth="2"
              />
              <text
                x={p.x}
                y={height - 2}
                textAnchor="middle"
                className="text-[9px] fill-slate-400 font-semibold"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

interface PerformanceGaugeProps {
  label: string;
  value: number; // 0 to 100
  color: 'orange' | 'emerald' | 'amber' | 'blue';
  subtitle?: string;
  icon?: React.ReactNode;
}

export const PerformanceGauge: React.FC<PerformanceGaugeProps> = ({
  label,
  value,
  color,
  subtitle,
  icon,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  // Circumference for radius 38
  const radius = 38;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Semi-circle or 240 deg arc
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (clampedValue / 100) * arcLength;

  const colorHex = {
    orange: '#ea580c',
    emerald: '#059669',
    amber: '#d97706',
    blue: '#2563eb',
  }[color];

  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm flex items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          {icon}
          <span>{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-900">
            {clampedValue}%
          </span>
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
        )}
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
        <svg height="80" width="80" className="rotate-[-135deg]">
          {/* Background Arc */}
          <circle
            stroke="#fed7aa"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="40"
            cy="40"
          />
          {/* Progress Arc */}
          <circle
            stroke={colorHex}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.6s ease' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="40"
            cy="40"
          />
        </svg>
        <span className="absolute font-black text-xs text-slate-700">
          {clampedValue}%
        </span>
      </div>
    </div>
  );
};
