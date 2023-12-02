# education-social-justice

Using vanilla Javascript and D3.js.


To add a new chart, add the following inside the `<body>` of `index.html`.

```html
<svg id="chartName"></svg>
<script src="scripts/chartName.js"></script>
```

Ofc, replace "chartName" with a descriptive name of the chart.

Then, create the `chartName.js` file in the `scripts` directory. Somewhere in the file, you want to select the `svg` element we previously created in the `index.html` file like so:

```javascript
const svg = d3.select("#chartName")
```

Then, you can add elements to this `svg`. Please refer to D3js docs for more: https://d3js.org/d3-axis examples.

To view the webpage locally, run this command from the root directory of the project:
```python
python -m http.server
```
This will run a server locally and let us load data from the `/data` directory.

I will add an example of how to use real data in the charts.

