const state = {
  data: [],
  passengerClass: "",
  selectedSex: null,
  // TODO store selected survived state
};



function createHistogram(svgSelector) {
  const margin = {
    top: 40,
    bottom: 10,
    left: 120,
    right: 20
  };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Creates sources <svg> element
  const svg = d3.select(svgSelector)
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

  // Group used to enforce margin
  const g = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);


  // Scales setup
  const xscale = d3.scaleLinear().range([0, width]);
  const yscale = d3.scaleLinear().range([0, height]);

  // Axis setup
  const xaxis = d3.axisTop().scale(xscale);
  const g_xaxis = g.append('g').attr('class', 'x axis');
  const yaxis = d3.axisLeft().scale(yscale);
  const g_yaxis = g.append('g').attr('class', 'y axis');


  function update(new_data) { //: (IPerson[] & {x0: number, x1: number})[]
    //update the scales
    xscale.domain([0, d3.max(new_data, (d) => d.length)]);
    yscale.domain([new_data[0].x0, new_data[new_data.length - 1].x1]);
    //render the axis
    g_xaxis.transition().call(xaxis);
    g_yaxis.transition().call(yaxis);

    // Render the chart with new data

    // DATA JOIN
    const rect = g.selectAll('rect').data(new_data);

    // ENTER
    // new elements
    const rect_enter = rect.enter().append('rect')
    .attr('x', 0) //set intelligent default values for animation
    .attr('y', 0)
    .attr('width', 0)
    .attr('height', 0);
    rect_enter.append('title');

    // ENTER + UPDATE
    // both old and new elements
    rect.merge(rect_enter).transition()
      .attr('height', (d) => yscale(d.x1) - yscale(d.x0) - 2)
      .attr('width', (d) => xscale(d.length))
      .attr('y', (d) => yscale(d.x0) + 1);

    rect.merge(rect_enter).select('title').text((d) => `${d.x0}: ${d.length}`);

    // EXIT
    // elements that aren't associated with data
    rect.exit().remove();
  }

  return update;
}

function createPieChart(svgSelector) {
  const margin = 10;
  const radius = 100;

  // Creates sources <svg> element
  const svg = d3.select(svgSelector)
  .attr('width', radius * 2 + margin * 2)
  .attr('height', radius * 2 + margin * 2);

  // Group used to enforce margin
  const g = svg.append('g')
  .attr('transform', `translate(${radius + margin},${radius + margin})`);

  const pie = d3.pie().value((d) => d.values.length).sortValues(null).sort(null);
  const arc = d3.arc().outerRadius(radius).innerRadius(0);
  const cscale = d3.scaleOrdinal(d3.schemeSet3);


  function update(new_data) { //{key: string, values: IPerson[]}[]
    const pied = pie(new_data);
    // Render the chart with new data

    cscale.domain(new_data.map((d) => d.key));

    // DATA JOIN
    const path = g.selectAll('path').data(pied, (d) => d.data.key);

    // ENTER
    // new elements
    const path_enter = path.enter().append('path');
    path_enter.on('click', (event, d) => {
      if (state.selectedSex === d.data.key) {
        state.selectedSex = null;
      } else {
        state.selectedSex = d.data.key;
      }
      updateApp();
    });
    path_enter.append('title');

    // ENTER + UPDATE
    // both old and new elements
    path.merge(path_enter)
      .classed('selected', (d) => d.data.key === state.selectedSex)
      .attr('d', arc)
      .style('fill', (d) => cscale(d.data.key));

    path.merge(path_enter).select('title').text((d) => `${d.data.key}: ${d.data.values.length}`);

    // EXIT
    // elements that aren't associated with data
    path.exit().remove();
  }

  return update;
}

/////////////////////////

const ageHistogram = createHistogram('#age');
const sexPieChart = createPieChart('#sex');
// TODO create two new visualzations for fare and survived

function filterData() {
  return state.data.filter((d) => {
    if (state.passengerClass && d.pclass !== state.passengerClass) {
      return false;
    }
    if (state.selectedSex && d.sex !== state.selectedSex) {
      return false;
    }
    // TODO apply additional selected survived filter
    return true;
  });
}

function wrangleData(filtered) {
  const ageHistogram = d3.bin()
  .domain([0, 100])
  .thresholds(10)
  .value((d) => d.age);

  const ageHistogramData = ageHistogram(filtered);

  // always the two categories
  const sexPieData = ['female', 'male'].map((key) => ({
    key,
    values: filtered.filter((d) => d.sex === key)
  }));

  // TODO wrangle also for fare and survived state

  return {ageHistogramData, sexPieData};
}

function updateApp() {
  const filtered = filterData();

  const {ageHistogramData, sexPieData} = wrangleData(filtered);
  ageHistogram(ageHistogramData);
  sexPieChart(sexPieData);
  // TODO update also the new charts with the wrangled data

  d3.select('#selectedSex').text(state.selectedSex || 'None');
  // TODO also update the label for the selected survived state
}

d3.csv('https://rawgit.com/sgratzl/d3tutorial/master/examples/titanic3.csv').then((parsed) => {
  state.data = parsed.map((row) => {
    row.age = parseInt(row.age, 10);
    row.fare = parseFloat(row.fare);
    return row;
  });

  updateApp();
});

//interactivity
d3.select('#passenger-class').on('change', function () {
  const selected = d3.select(this).property('value');
  state.passengerClass = selected;
  updateApp();
});