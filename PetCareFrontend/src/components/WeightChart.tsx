import React from 'react';
import { WeightRecord } from '../types';
import { TrendingUp, Scale } from 'lucide-react';

interface WeightChartProps {
  records: WeightRecord[];
}

export const WeightChart: React.FC<WeightChartProps> = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <div className="weight-chart-empty">
        <Scale size={28} className="empty-icon" />
        <p>Chưa có dữ liệu cân nặng. Hãy ghi cân nặng đầu tiên của bé!</p>
      </div>
    );
  }

  const sorted = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const weights = sorted.map(r => r.weight);
  const minWeight = Math.max(0, Math.floor(Math.min(...weights) - 1));
  const maxWeight = Math.ceil(Math.max(...weights) + 1);
  const weightRange = maxWeight - minWeight || 1;

  // Chart dimensions
  const svgWidth = 360;
  const svgHeight = 160;
  const paddingX = 35;
  const paddingY = 25;

  const getCoordinates = (index: number, weight: number) => {
    const x = paddingX + (index / (sorted.length - 1 || 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((weight - minWeight) / weightRange) * (svgHeight - paddingY * 2);
    return { x, y };
  };

  // Build SVG Path
  const points = sorted.map((r, i) => getCoordinates(i, r.weight));
  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Fill area under path
  const areaD = points.length > 1 
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  const latestWeight = sorted[sorted.length - 1].weight;
  const prevWeight = sorted.length > 1 ? sorted[sorted.length - 2].weight : latestWeight;
  const diff = Math.round((latestWeight - prevWeight) * 10) / 10;

  return (
    <div className="weight-chart-card card">
      <div className="chart-header">
        <div className="chart-title-wrap">
          <div className="icon-badge">
            <Scale size={18} />
          </div>
          <div>
            <h4 className="title">Theo dõi cân nặng</h4>
            <span className="subtitle">{sorted.length} lần ghi nhận</span>
          </div>
        </div>

        <div className="current-weight-badge">
          <span className="weight-num">{latestWeight}</span>
          <span className="weight-unit">kg</span>
          {diff !== 0 && (
            <span className={`diff-pill ${diff > 0 ? 'gain' : 'loss'}`}>
              <TrendingUp size={12} />
              {diff > 0 ? `+${diff}` : diff} kg
            </span>
          )}
        </div>
      </div>

      <div className="svg-container">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="weight-svg">
          <defs>
            <linearGradient id="weightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#149a8c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#149a8c" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line 
            x1={paddingX} 
            y1={svgHeight - paddingY} 
            x2={svgWidth - paddingX} 
            y2={svgHeight - paddingY} 
            stroke="var(--border-color)" 
            strokeDasharray="3 3"
          />
          <line 
            x1={paddingX} 
            y1={paddingY} 
            x2={svgWidth - paddingX} 
            y2={paddingY} 
            stroke="var(--border-color)" 
            strokeDasharray="3 3"
          />

          {/* Area under curve */}
          {areaD && <path d={areaD} fill="url(#weightGrad)" />}

          {/* Line */}
          {pathD && (
            <path 
              d={pathD} 
              fill="none" 
              stroke="#149a8c" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          )}

          {/* Dots */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#149a8c" strokeWidth="2.5" />
              <text 
                x={p.x} 
                y={p.y - 10} 
                fontSize="11" 
                fontWeight="700" 
                textAnchor="middle" 
                fill="var(--text-main)"
              >
                {sorted[i].weight}
              </text>
              <text 
                x={p.x} 
                y={svgHeight - 8} 
                fontSize="9" 
                textAnchor="middle" 
                fill="var(--text-muted)"
              >
                {sorted[i].date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <style>{`
        .weight-chart-card {
          margin-bottom: 16px;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .chart-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon-badge {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--primary-soft);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chart-title-wrap .title {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .chart-title-wrap .subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .current-weight-badge {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .weight-num {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }

        .weight-unit {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .diff-pill {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-full);
          margin-left: 6px;
        }

        .diff-pill.gain {
          background: var(--primary-soft);
          color: var(--primary);
        }

        .diff-pill.loss {
          background: var(--warning-soft);
          color: var(--warning);
        }

        .svg-container {
          width: 100%;
          overflow-x: auto;
        }

        .weight-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .weight-chart-empty {
          padding: 24px;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
          background: var(--bg-card);
          border-radius: var(--radius-md);
          border: 1px dashed var(--border-color);
        }

        .empty-icon {
          margin-bottom: 6px;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};
