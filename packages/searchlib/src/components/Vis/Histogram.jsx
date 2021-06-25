import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { withParentSize } from '@visx/responsive';
import { withTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
// import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'white',
  color: 'white',
  boxShadow: '0px 0px 10px 0px rgb(0 0 0 / 50%)',
  borderRadius: '0.3em',
  padding: '1em',
};

// const defaultMargin = { top: 40, left: 50, right: 40, bottom: 100 };

// TODO: implement active range
// TODO: move styles to less classes

export function HistogramChart(props) {
  const {
    onClick,
    data,
    backgroundColor = 'white',
    barBackgroundColor = 'rgb(83, 147, 180)',
    verticalMargin = 20,

    // tooltip props
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = props;

  const width = props.width || props.parentWidth;
  const height = props.height || props.parentHeight;

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

  // console.log(data, xMax, yMax);
  // const margin = defaultMargin;

  const tooltipTimeout = React.useRef();

  return width < 10 ? null : (
    <>
      <svg width={width} height={height}>
        <rect width={width} height={height} fill={backgroundColor} />
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
                onMouseLeave={() => {
                  tooltipTimeout.current = window.setTimeout(() => {
                    hideTooltip();
                  }, 300);
                }}
                onMouseMove={() => {
                  if (tooltipTimeout.current)
                    clearTimeout(tooltipTimeout.current);
                  const top = barY; //+ margin.top;
                  const left = barX; //+ barWidth + margin.left;
                  showTooltip({
                    tooltipData: d,
                    tooltipTop: top,
                    tooltipLeft: left,
                  });
                }}
              />
            );
          })}
        </Group>
      </svg>
      {tooltipOpen && (
        <Tooltip top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div style={{ color: 'black' }}>
            <strong>{tooltipData.x}</strong>
          </div>
        </Tooltip>
      )}
    </>
  );
}

export const ResponsiveHistogramChart = withTooltip(
  withParentSize(HistogramChart),
);
