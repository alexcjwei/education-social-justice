// Hide div based on resolution value
const prefixes = [
  'par_income_lab_vs_attend',
  'par_income_lab_vs_rel_att_cond_app',
  'par_income_lab_vs_rel_attend',
  'par_income_lab_vs_rel_apply_unwgt',
  'par_income_lab_vs_rel_attend',
];
const suffixes = [
  'high_10_percentile_bucket',
  'high_5_percentile_bucket',
  'high_1_percentile_bucket',
  'high_0.1_percentile_bucket',
  '1_percent_buckets',
  'original_buckets',
];
const setChartResolution = (idx) => {
  prefixes.forEach((prefix) => {
    suffixes.forEach((suffix, i) => {
      // Set all to hidden, except suffix with index i
      const chartId = `${prefix}-${i}`;
      console.log(chartId);
      const chart = document.getElementById(chartId);
      console.log(chartId, i !== idx);
      chart.hidden = i !== idx;
    });
  });
};
const rangeSlider = document.getElementById('resolution-range');
const setSlider = (value) => {
  rangeSlider.setAttribute('value', value);
};

// Set each to first first
setChartResolution(0);
