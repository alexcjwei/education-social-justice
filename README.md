# education-social-justice

Using vanilla Javascript and D3.js.


To add a new chart, add the following inside the `<body>` of `index.html`.

```html
<svg id="chartname"></svg>
<script src="scripts/chartname.js"></script>
```

Ofc, replace "chartname" with a descriptive name of the chart.

Then, create the `chartname.js` file in the `scripts` directory. Somewhere in the file, you want to select the `svg` element we previously created in the `index.html` file like so:

```javascript
const svg = d3.select("#chartname")
```

Then, you can add elements to this `svg`. Please refer to D3js docs for more: https://d3js.org/d3-axis examples.


I will add an example of how to use real data in the charts.

