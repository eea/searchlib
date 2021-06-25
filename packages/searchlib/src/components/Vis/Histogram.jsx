import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { withParentSize } from '@visx/responsive';
import { withTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
// import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';

// TODO: implement active range
export function isPointActive(point, activeRange) {
  const { config } = point;
  return (
    (config.from ?? config.to) >= activeRange[0] &&
    (config.to ?? config.from) <= activeRange[1]
  );
}

const DataTooltip = ({
  tooltipLeft,
  tooltipData,
  tooltipTop,
  fieldName,
  ...rest
}) => (
  <Tooltip
    top={tooltipTop}
    left={tooltipLeft}
    style={{
      ...defaultStyles,
      lineHeight: 'initial',
      boxShadow: '',
      fontSize: 'x-small',
    }}
  >
    <div style={{ color: 'black' }}>
      <strong>
        {tooltipData.config.from ?? tooltipData.x}
        {typeof tooltipData.config.to !== 'undefined' &&
          ` to ${tooltipData.config.to}`}{' '}
      </strong>
      <br />
      {fieldName}
      <br />
      {`${tooltipData.y} items`}
    </div>
  </Tooltip>
);

export function HistogramChart(props) {
  const {
    onClick,
    data,
    backgroundColor = 'white',
    barBackgroundColor = 'rgb(83, 147, 180)',
    inactiveBarBackgroundColor = 'gray',
    verticalMargin = 20,

    activeRange, // show active range with a different color

    // tooltip props
    tooltipOpen,
    hideTooltip,
    showTooltip,
  } = props;

  const hist_data = data?.map(({ count, value, config }) => ({
    x: value.name,
    y: count,
    config,
  }));

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
        domain: hist_data.map((d) => d.x),
        padding: 0.4,
      }),
    [xMax, hist_data],
  );
  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...hist_data.map((d) => d.y))],
      }),
    [yMax, hist_data],
  );

  // const margin = defaultMargin;

  const tooltipTimeout = React.useRef();

  return width < 10 ? null : (
    <>
      <svg width={width} height={height}>
        <rect width={width} height={height} fill={backgroundColor} />
        <Group top={verticalMargin / 2}>
          {hist_data.map((d) => {
            const barWidth = xScale.bandwidth();
            const barHeight = yMax - yScale(d.y);
            const barX = xScale(d.x);
            const barY = yMax - barHeight;
            const isActive = activeRange ? isPointActive(d, activeRange) : true;

            return (
              <Bar
                key={`bar-${d.x}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={
                  isActive ? barBackgroundColor : inactiveBarBackgroundColor
                }
                onClick={() => onClick && onClick(d)}
                onMouseLeave={() => {
                  tooltipTimeout.current = window.setTimeout(() => {
                    hideTooltip();
                  }, 1000);
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
      {tooltipOpen && <DataTooltip {...props} fieldName={props.label} />}
    </>
  );
}

export const ResponsiveHistogramChart = withTooltip(
  withParentSize(HistogramChart),
);
