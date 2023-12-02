// Declare the chart dimensions and margins.
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// Create the SVG container.
var svg = d3
  .select('#loadDataExample')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Helper to plot data onto the svg above
const plotData = (data) => {
  // Define the x scale
  var x = d3
    .scaleLinear()
    .domain(
      d3.extent(data, function (d) {
        return d.par_income_bin;
      })
    )
    .range([0, width]);
  // Draw the x scale
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  // Define the y scale
  var y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.avg_attend)])
    .range([height, 0]);
  // Draw the y scale
  svg.append('g').call(d3.axisLeft(y));

  // Draw the line
  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x((d) => x(d.par_income_bin))
        .y((d) => y(d.avg_attend))
    );

  // create a tooltip
  const Tooltip = d3
    .select('#loadDataExample')
    .append('div')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('background-color', 'white')
    .style('border', 'solid')
    .style('border-width', '2px')
    .style('border-radius', '5px')
    .style('padding', '5px');

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = (event, d) => {
    Tooltip.style('opacity', 1);
  };
  const mousemove = (event, d) => {
    Tooltip.html('Exact value: ' + d.avg_attend)
      .style('left', `${event.layerX + 10}px`)
      .style('top', `${event.layerY}px`);
  };
  const mouseleave = (event, d) => {
    Tooltip.style('opacity', 0);
  };

  // Add the points
  svg
    .append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'myCircle')
    .attr('cx', (d) => x(d.par_income_bin))
    .attr('cy', (d) => y(d.avg_attend))
    .attr('r', 8)
    .attr('stroke', '#69b3a2')
    .attr('stroke-width', 3)
    .attr('fill', 'white')
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave);
};

// Load the csv
d3.csv('data/CollegeAdmissions_Data.csv').then((data) => {
  const aggData = {};

  data.forEach((d) => {
    const incomeBin = d.par_income_bin;
    const attend = d.attend;

    // Add a bin for this income bin if haven't already
    if (!aggData[incomeBin]) {
      aggData[incomeBin] = [];
    }

    // Add attend to this incoem bin
    aggData[incomeBin].push(attend);
  });

  // Average attend values out for each bin
  const summaryData = Object.entries(aggData).map(
    ([incomeBin, attendArray]) => {
      const avgAttend = d3.mean(attendArray);
      return { par_income_bin: parseFloat(incomeBin), avg_attend: avgAttend };
    }
  );

  // Order by par_income_bin
  summaryData.sort((a, b) => {
    return a.par_income_bin < b.par_income_bin ? -1 : 1;
  });

  console.log(summaryData);
  plotData(summaryData);
});
