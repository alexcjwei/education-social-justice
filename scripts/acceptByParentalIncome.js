const csvFile = 'data/CollegeAdmissions_Data.csv';
const chart = '#acceptByParentalIncome';

// Function to process and visualize the data
function visualizeData(data) {
  // Clear existing chart
  d3.select(chart).selectAll('*').remove();
  // Set the dimensions and margins of the graph
  const margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // Append the SVG object to the body of the page
  const svg = d3
    .select(chart)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Chart Title
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 0 + margin.top)
    .attr('text-anchor', 'middle')
    .style('font-size', '20px')
    .style('text-decoration', 'underline')
    .text('Admission Rates by Parental Income Bin');

  // X axis
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map((d) => d.par_income_lab))
    .padding(0.2);
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x))
    .selectAll('.axis-label')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-65)');

  // X Axis Label
  svg
    .append('text')
    .attr(
      'transform',
      'translate(' + width / 2 + ' ,' + (height + margin.top + 20) + ')'
    )
    .style('text-anchor', 'middle')
    .text('Parental Income Percentile');

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.attend)])
    .range([height, 0]);
  svg.append('g').call(d3.axisLeft(y));

  // Y Axis Label
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Admission Rate');

  // Tooltip
  const tooltip = d3.select('#tooltip');
  const mouseover = (event, d) => {
    tooltip.transition().duration(200).style('opacity', 0.9);
    tooltip
      .html(d3.format('.1%')(d.attend))
      .style('left', event.pageX + 'px')
      .style('top', event.pageY - 28 + 'px');
  };
  const mouseout = (d) => {
    tooltip.transition().duration(500).style('opacity', 0);
  };

  // Bars
  svg
    .selectAll('mybar')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.par_income_lab))
    .attr('y', (d) => y(d.attend))
    .attr('width', x.bandwidth())
    .attr('height', (d) => height - y(d.attend))
    .attr('class', 'bar')
    .on('mouseover', mouseover)
    .on('mouseout', (d) => mouseout);
}

// Load and process the CSV data
d3.csv(csvFile, function (d) {
  return {
    name: d.name,
    par_income_lab: d.par_income_lab,
    attend: +d.attend, // Convert string to number
    tier_name: d.tier_name,
  };
}).then(function (data) {
  // Load unique tier names into the dropdown
  const tierNames = Array.from(new Set(data.map((d) => d.tier_name)));
  tierNames.forEach((tier) => {
    d3.select('#tier-select').append('option').text(tier).attr('value', tier);
  });

  // Initial visualization with all data
  updateVisualization('all');

  // Update visualization when a new tier is selected
  d3.select('#tier-select').on('change', function () {
    updateVisualization(this.value);
  });

  function updateVisualization(selectedTier) {
    let filteredData =
      selectedTier === 'all'
        ? data
        : data.filter((d) => d.tier_name === selectedTier);

    // Group by parental income bin and calculate average attend rates
    const aggregatedData = Array.from(
      d3.group(filteredData, (d) => d.par_income_lab),
      ([par_income_lab, group]) => ({
        par_income_lab,
        attend: d3.mean(group, (g) => g.attend),
      })
    );

    // Sort the data by income bin order
    const incomeBinOrder = {
      '0-20': 1,
      '20-40': 2,
      '40-60': 3,
      '60-70': 4,
      '70-80': 5,
      '80-90': 6,
      '90-95': 7,
      '95-99': 8,
      'Top 1': 9,
      'Top 0.1': 10,
    };
    aggregatedData.sort(
      (a, b) =>
        incomeBinOrder[a.par_income_lab] - incomeBinOrder[b.par_income_lab]
    );

    // Visualize the processed data
    visualizeData(aggregatedData);
  }
});
