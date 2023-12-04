d3.csv('data/CollegeAdmissions_Data.csv', (d) => {
  return {
    name: d.name,
    par_income_lab: d.par_income_lab,
    rel_attend: +d.rel_attend, // Convert string to number
    rel_attend_unwgt: +d.rel_attend_unwgt, // Convert string to number
    tier_name: d.tier_name,
  };
}).then((data) => {
  // Update visualization when a new tier is selected
  d3.select('#weighted-checkbox').on('change.attend', function () {
    updateVisualization(this.checked, false);
  });

  // Get the unique groups
  const x = Array.from(new Set(data.map((x) => x.par_income_lab)));
  const y = Array.from(new Set(data.map((x) => x.tier_name)));

  const groupedData = data.reduce((acc, curr) => {
    const key = `${curr.tier_name}-${curr.par_income_lab}`;
    if (!acc[key]) {
      acc[key] = { sum: 0, weighted_sum: 0, count: 0 };
    }

    if (!!curr.rel_attend) {
      // Use weighted values
      acc[key].weighted_sum += curr.rel_attend;
    }
    if (!!curr.rel_attend_unwgt) {
      // Use unweighted values
      acc[key].sum += curr.rel_attend_unwgt;
    }

    acc[key].count += 1;
    return acc;
  }, {});

  const updateVisualization = (weighted, create) => {
    // Initialize the N x M matrix "z" with zeros
    const z = Array.from({ length: x.length }, () =>
      Array.from({ length: y.length }, () => 0)
    );

    // Fill the matrix "z" with mean values
    y.forEach((tier, i) => {
      x.forEach((income, j) => {
        const key = `${tier}-${income}`;
        if (groupedData[key]) {
          z[i][j] =
            (weighted ? groupedData[key].weighted_sum : groupedData[key].sum) /
            groupedData[key].count;
        }
      });
    });

    const layout = {
      title: 'Attendance Rate by Parental Income, by University tier',
      annotations: [],
      xaxis: {
        ticks: '',
        side: 'top',
        tickangle: 30,
      },
      yaxis: {
        ticks: '',
        ticksuffix: ' ',
        width: 700,
        height: 700,
        autosize: true,
        automargin: true,
      },
    };

    if (create) {
      Plotly.newPlot(
        'attend-by-parental-income',
        [
          {
            z,
            x,
            y,
            type: 'heatmap',
            hoverongaps: false,
          },
        ],
        layout
      );
    } else {
      Plotly.react(
        'attend-by-parental-income',
        [
          {
            z,
            x,
            y,
            type: 'heatmap',
            hoverongaps: false,
          },
        ],
        layout
      );
    }
  };

  // Original state
  updateVisualization(false, true);
});
