const dataset = await d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
);
dataset.monthlyVariance.map((d) => {
  d.month = d.month - 1;
});

// Chart dimensions
const margin = { top: 100, right: 30, bottom: 150, left: 80 };
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const monthToString = (month) => {
  const date = new Date(0);
  date.setUTCMonth(month);
  return d3.utcFormat('%B')(date);
};

const svg = d3
  .select('#chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const defs = svg.append('defs');
const gradient1 = defs.append('linearGradient').attr('id', 'gradient1');
gradient1.append('stop').attr('class', 'stop1').attr('offset', '0%');
gradient1.append('stop').attr('class', 'stop2').attr('offset', '100%');
const gradient2 = defs.append('linearGradient').attr('id', 'gradient2');
gradient2.append('stop').attr('class', 'stop2').attr('offset', '0%');
gradient2.append('stop').attr('class', 'stop3').attr('offset', '100%');
const gradient3 = defs.append('linearGradient').attr('id', 'gradient3');
gradient3.append('stop').attr('class', 'stop3').attr('offset', '0%');
gradient3.append('stop').attr('class', 'stop4').attr('offset', '100%');
const gradient4 = defs.append('linearGradient').attr('id', 'gradient4');
gradient4.append('stop').attr('class', 'stop4').attr('offset', '0%');
gradient4.append('stop').attr('class', 'stop5').attr('offset', '100%');

svg
  .append('text')
  .attr('id', 'title')
  .attr('x', width / 2)
  .attr('y', 0 - margin.top / 2)
  .attr('text-anchor', 'middle')
  .style('font-weight', 'bold')
  .style('font-size', '2rem')
  .text('Monthly Global Land-Surface Temperature');

svg
  .append('text')
  .attr('id', 'description')
  .attr('x', width / 2)
  .attr('y', 0 - margin.top / 2 + 25)
  .attr('text-anchor', 'middle')
  .style('font-weight', 'bold')
  .style('font-size', '1.2rem')
  .style('fill', 'gray')
  .text(
    `${d3.min(dataset.monthlyVariance, (d) => d.year)} - ${d3.max(
      dataset.monthlyVariance,
      (d) => d.year
    )}: base temperature ${dataset.baseTemperature}℃`
  );

// Chart scales
const x = d3.scaleBand().range([0, width]);
const y = d3.scaleBand().range([0, height]);

// Chart domains
x.domain(dataset.monthlyVariance.map((v) => v.year));
y.domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

// Chart x-axis
svg
  .append('g')
  .attr('id', 'x-axis')
  .attr('transform', `translate(0, ${height})`)
  .call(
    d3
      .axisBottom(x)
      .tickValues(x.domain().filter((year) => year % 10 === 0))
      .tickFormat((year) => {
        const date = new Date(0);
        date.setUTCFullYear(year);
        return d3.utcFormat('%Y')(date);
      })
  );

// Chart y-axis
svg
  .append('g')
  .attr('id', 'y-axis')
  .call(d3.axisLeft(y).tickValues(y.domain()).tickFormat(monthToString));

// Chart tooltip
const tooltip = d3.select('#tooltip');

// Chart data event handlers
const onMouseOver = (event, d) => {
  tooltip
    .style('opacity', 1)
    .style('display', 'block')
    .html(
      `${d.year} ${monthToString(d.month)}<br>${
        dataset.baseTemperature + d.variance
      }<br>${d.variance}`
    )
    .style('left', `${event.x + 20}px`)
    .style('top', `${event.y - 20}px`)
    .attr('data-year', d.year);
};
const onMouseOut = (event, d) => {
  tooltip.style('opacity', 0).style('display', 'hidden');
};

// Chart legend
const legendX = d3.scaleLinear().range([0, 44]);
legendX.domain([2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8]);

const legend = svg
  .append('g')
  .attr('id', 'legend')
  .attr('transform', `translate(0, ${height + 100})`)
  .attr('width', 400)
  .attr('height', 50)
  .call(
    d3
      .axisBottom(legendX)
      .tickValues(legendX.domain())
      .tickFormat(d3.format('.1f'))
  );

legend
  .append('rect')
  .attr('x', 0)
  .attr('y', -50)
  .attr('width', 100)
  .attr('height', 50)
  .attr('fill', 'url(#gradient1)');
legend
  .append('rect')
  .attr('x', 100)
  .attr('y', -50)
  .attr('width', 100)
  .attr('height', 50)
  .attr('fill', 'url(#gradient2)');
legend
  .append('rect')
  .attr('x', 200)
  .attr('y', -50)
  .attr('width', 100)
  .attr('height', 50)
  .attr('fill', 'url(#gradient3)');
legend
  .append('rect')
  .attr('x', 300)
  .attr('y', -50)
  .attr('width', 100)
  .attr('height', 50)
  .attr('fill', 'url(#gradient4)');

const stop1 = { r: 29, g: 72, b: 119 };
const stop2 = { r: 27, g: 138, b: 90 };
const stop3 = { r: 251, g: 176, b: 33 };
const stop4 = { r: 246, g: 136, b: 56 };
const stop5 = { r: 238, g: 62, b: 50 };

const interpolateColor = (variance) => {
  const temp = dataset.baseTemperature + variance;
  const factor = temp / 12.8;
  let color1;
  let color2;

  if (factor < 0.25) {
    color1 = stop1;
    color2 = stop2;
  } else if (factor < 0.5) {
    color1 = stop2;
    color2 = stop3;
  } else if (factor < 0.75) {
    color1 = stop3;
    color2 = stop4;
  } else {
    color1 = stop4;
    color2 = stop5;
  }

  const color = {
    r: Math.round(color1.r + factor * (color2.r - color1.r)),
    g: Math.round(color1.g + factor * (color2.g - color1.g)),
    b: Math.round(color1.b + factor * (color2.b - color1.b)),
  };

  return `#${((1 << 24) + (color.r << 16) + (color.g << 8) + color.b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
};

// Chart data
svg
  .selectAll('.cell')
  .data(dataset.monthlyVariance)
  .enter()
  .append('rect')
  .attr('class', 'cell')
  .attr('x', (d) => x(d.year))
  .attr('y', (d) => y(d.month))
  .attr('width', (d) => x.bandwidth(d.year))
  .attr('height', (d) => y.bandwidth(d.month))
  .attr('fill', (d) => interpolateColor(d.variance))
  .attr('data-month', (d) => d.month)
  .attr('data-year', (d) => d.year)
  .attr('data-temp', (d) => dataset.baseTemperature + d.variance)
  .on('mouseover', onMouseOver)
  .on('mouseout', onMouseOut);
