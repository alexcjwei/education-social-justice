d3.csv('data/CollegeAdmissions_Data.csv', (d) => {
  return {
    name: d.name,
    par_income_lab: d.par_income_lab,
    rel_apply: +d.rel_apply, // Convert string to number
    rel_apply_unwgt: +d.rel_apply_unwgt, // Convert string to number
    tier_name: d.tier_name,
  };
}).then((data) => {
  // Update visualization when a new tier is selected
  d3.select('#weighted-checkbox').on('change.apply', function () {
    updateVisualization(this.checked, false);
  });

  const updateVisualization = (weighted, create) => {
    // Get the unique groups
    const x = Array.from(new Set(data.map((x) => x.par_income_lab)));
    const y = Array.from(new Set(data.map((x) => x.tier_name)));

    const groupedData = data.reduce((acc, curr) => {
      const key = `${curr.tier_name}-${curr.par_income_lab}`;
      if (!acc[key]) {
        acc[key] = { sum: 0, count: 0 };
      }

      if (weighted && !!curr.rel_apply) {
        // Use weighted values
        acc[key].sum += curr.rel_apply;
      } else if (!weighted && !!curr.rel_apply_unwgt) {
        // Use unweighted values
        acc[key].sum += curr.rel_apply_unwgt;
      }

      acc[key].count += 1;
      return acc;
    }, {});

    // Initialize the N x M matrix "z" with zeros
    const z = Array.from({ length: x.length }, () =>
      Array.from({ length: y.length }, () => 0)
    );

    // Fill the matrix "z" with mean values
    y.forEach((tier, i) => {
      x.forEach((income, j) => {
        const key = `${tier}-${income}`;
        if (groupedData[key]) {
          z[i][j] = groupedData[key].sum / groupedData[key].count;
        }
      });
    });

    const layout = {
      title: 'Relative Applications by Parental Income, by University tier',
      annotations: [],
      xaxis: {
        ticks: '',
        side: 'top',
      },
      yaxis: {
        ticks: '',
        ticksuffix: ' ',
        width: 700,
        height: 700,
        autosize: true,
      },
    };

    if (create) {
      Plotly.newPlot(
        'apply-by-parental-income',
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
        'apply-by-parental-income',
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
