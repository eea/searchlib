import React from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import { SliderRail, Handle, Track, Tick } from './SliderComponents';
import Histogram from './Histogram';

import { max, min } from 'd3-array';
import { scaleLinear as linear } from 'd3-scale';

const sliderStyle = {
  position: 'relative',
  width: '100%',
};

// const domain = [100, 500];
// const defaultValues = [200, 400];

const HistogramSlider = ({
  data,
  // width = 400,
  height = 200,
  padding = 10,
  sliderHeight = 20,
  defaultWidth = 200,
}) => {
  const [update, setUpdate] = React.useState([]);
  const [width, setWidth] = React.useState(defaultWidth);
  // const [selection, setSelection] = React.useState([]);

  const innerHeight = height - padding * 2;
  const innerWidth = width - padding * 2;
  const histogramHeight = innerHeight - sliderHeight;

  const sortedData = data.sort((a, b) => +a.x0 - +b.x0);
  const extent = [
    min(sortedData, ({ x0 }) => +x0),
    max(sortedData, ({ x }) => +x),
  ];
  const [values, setValues] = React.useState([extent[0], extent[1]]);

  const maxValue = max(sortedData, ({ y }) => +y);

  const scale = linear().domain(extent).range([0, innerWidth]);
  scale.clamp(true);
  const step = (extent[1] - extent[0]) / data.length;
  console.log('domain', { extent, innerWidth, ex: scale(2010), step });

  // TODO: fix step, ticks count
  // const nodeRef = React.useRef(nodeRef);

  return (
    <div
      style={{ height, width: '100%' }}
      ref={(node) => {
        node && setWidth(node.clientWidth);
      }}
    >
      <Histogram
        height={histogramHeight}
        data={data}
        selection={values}
        scale={scale}
        width={width}
        reset={() => setValues([extent[0], extent[1]])}
        max={maxValue}
        barPadding={0}
        padding={0}
        onChange={(value) => setValues(value)}
      />
      <Slider
        mode={2}
        step={step}
        domain={extent}
        rootStyle={sliderStyle}
        onUpdate={(update) => setUpdate(update)}
        onChange={(values) => setValues(values)}
        values={values}
      >
        <Rail>
          {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
        </Rail>
        <Handles>
          {({ handles, activeHandleID, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map((handle) => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  domain={extent}
                  isActive={handle.id === activeHandleID}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="slider-tracks">
              {tracks.map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
        <Ticks count={5}>
          {({ ticks }) => (
            <div className="slider-ticks">
              {ticks.map((tick) => (
                <Tick key={tick.id} tick={tick} count={ticks.length} />
              ))}
            </div>
          )}
        </Ticks>
      </Slider>
    </div>
  );
};

export default HistogramSlider;
