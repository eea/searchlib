import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { withParentSize } from '@visx/responsive';

export function HistogramChart({
  width,
  parentWidth,
  height,
  parentHeight,
  onClick,
  data,
  backgroundColor = 'teal',
  barBackgroundColor = 'rgba(23, 233, 217, .5)',
  verticalMargin = 20,
}) {
  width = width || parentWidth;
  height = height || parentHeight;

  // bounds
  const xMax = width;
  const yMax = height - verticalMargin;

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, xMax],
        round: true,
        domain: data.map((d) => d.x),
        padding: 0.4,
      }),
    [xMax, data],
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map((d) => d.y))],
      }),
    [yMax, data],
  );

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={verticalMargin / 2}>
        {data.map((d) => {
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - yScale(d.y);
          const barX = xScale(d.x);
          const barY = yMax - barHeight;
          return (
            <Bar
              key={`bar-${d.x}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={barBackgroundColor}
              onClick={() => onClick && onClick(d)}
            />
          );
        })}
      </Group>
    </svg>
  );
}

export const ResponsiveHistogramChart = withParentSize(HistogramChart);
