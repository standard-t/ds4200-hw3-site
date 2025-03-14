// Load the data
const socialMedia = d3.csv("socialMedia.csv");

// Once the data is loaded, proceed with plotting
socialMedia.then(function (data) {
  // Convert string values to numbers
  data.forEach(function (d) {
    d.Likes = +d.Likes;
  });

  // Define the dimensions and margins for the SVG
  const width = 600, height = 400;
  const margin = { top: 30, bottom: 40, left: 50, right: 30 };

  // Create the SVG container
  const svg = d3.select("#boxplot")
    .attr("width", width)
    .attr("height", height)
    .style('background', '#e9f7f2');

  // Set up scales for x and y axes
  // You can use the range 0 to 1000 for the number of Likes, or if you want, you can use
  // d3.min(data, d => d.Likes) to achieve the min value and 
  // d3.max(data, d => d.Likes) to achieve the max value
  // For the domain of the xscale, you can list all four platforms or use
  // [...new Set(data.map(d => d.Platform))] to achieve a unique list of the platform

  const xScale = d3.scaleBand()
    .domain([...new Set(data.map(d => d.Platform))])
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Likes), d3.max(data, d => d.Likes)])
    .range([height - margin.bottom, margin.top]);

  // Add scales     

  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft().scale(yScale));

  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom().scale(xScale));


  // Add x-axis label

  svg.append('text')
    .text('Platform')
    .attr('x', width / 2)
    .attr('y', height - 5)


  // Add y-axis label

  svg.append('text')
    .text('Likes')
    .attr('x', 0 - height / 2)
    .attr('y', 20)
    .attr('transform', 'rotate(-90)')


  // Complete rollup function with all quartiles
  const rollupFunction = function (groupData) {
    const values = groupData.map(d => d.Likes).sort(d3.ascending);
    return {
      min: d3.min(values),
      q1: d3.quantile(values, 0.25),
      median: d3.quantile(values, 0.5),
      q3: d3.quantile(values, 0.75),
      max: d3.max(values)
    };
  };

  // the below line groups the data by platform and applies the rollupFunction (which takes the data from one platform 
  // and returns the min, q1, median, q3, and max) to each group, storing the results in the quantilesByGroups constant
  const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.Platform);


  // the below line iterates over the quantilesByGroups constant and computes the x position (placement location) 
  // and boxWidth for each box within the side-by-side boxplot based on the xScale 
  quantilesByGroups.forEach((quantiles, platform) => {
    const x = xScale(platform);
    const boxWidth = xScale.bandwidth();

    // Draw vertical lines 
    svg.append('line')
      .attr('x1', x + boxWidth / 2)
      .attr('x2', x + boxWidth / 2)
      .attr('y1', yScale(quantiles.min))
      .attr('y2', yScale(quantiles.q1))
      .attr('stroke', 'black');

    svg.append('line')
      .attr('x1', x + boxWidth / 2)
      .attr('x2', x + boxWidth / 2)
      .attr('y1', yScale(quantiles.q3))
      .attr('y2', yScale(quantiles.max))
      .attr('stroke', 'black');

    // Draw box
    svg.append('rect')
      .attr('x', x)
      .attr('y', yScale(quantiles.q3))
      .attr('width', boxWidth)
      .attr('height', yScale(quantiles.q1) - yScale(quantiles.q3))
      .attr('fill', 'lightblue')
      .attr('stroke', 'black');

    // Draw median line
    svg.append('line')
      .attr('x1', x)
      .attr('x2', x + boxWidth)
      .attr('y1', yScale(quantiles.median))
      .attr('y2', yScale(quantiles.median))
      .attr('stroke', 'red')
      .attr('stroke-width', 2);
  });
});



// Prepare you data and load the data again. 
// This data should contains three columns, platform, post type and average number of likes. 
const socialMediaAvg = d3.csv("socialMediaAvg.csv");

socialMediaAvg.then(function (data) {
  // Convert string values to numbers
  data.forEach(function (d) {
    d.Likes = +d.Likes;
  });

  // Define the dimensions and margins for the SVG
  const width = 600, height = 400;
  const margin = { top: 30, bottom: 40, left: 50, right: 100 };

  // Create the SVG container
  const svg = d3.select("#barplot")
    .attr("width", width)
    .attr("height", height)
    .style('background', '#e9f7f2');


  const x0 = d3.scaleBand()
    .domain([...new Set(data.map(d => d.Platform))])
    .range([margin.left, width - margin.right])
    .padding(0.2);  // Add padding between platform groups

  const x1 = d3.scaleBand()
    .domain([...new Set(data.map(d => d.PostType))])
    .range([0, x0.bandwidth()])  // Range is now bandwidth of x0
    .padding(0.05);  // Add small padding between bars within groups

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Likes) * 1.1])  // Start from 0 and add 10% headroom
    .range([height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal()
    .domain([...new Set(data.map(d => d.PostType))])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  // Add scales x0 and y
  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0));

  // Add x-axis label
  svg.append('text')
    .text('Platform')
    .attr('x', width / 2)
    .attr('y', height - 5)
    .attr('text-anchor', 'middle');

  // Add y-axis label
  svg.append('text')
    .text('Likes')
    .attr('x', -height / 2)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle');

  // Group container for bars
  const barGroups = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${x0(d.Platform)},0)`);

  // Draw bars
  barGroups.append("rect")
    .attr("x", d => x1(d.PostType))
    .attr("y", d => y(d.Likes))
    .attr("width", x1.bandwidth())
    .attr("height", d => height - margin.bottom - y(d.Likes))
    .attr("fill", d => color(d.PostType));

  // Add the legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 150}, ${margin.top})`);

  const types = [...new Set(data.map(d => d.PostType))];

  // Alread have the text information for the legend. 
  // Now add a small square/rect bar next to the text with different color.
  types.forEach((type, i) => {
    legend.append("rect")
      .attr("x", 70)
      .attr("y", i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color(type));


    legend.append("text")
      .attr("x", 90)
      .attr("y", i * 20 + 7.5)
      .text(type)
      .attr("alignment-baseline", "middle");
  });
});

// Prepare you data and load the data again. 
// This data should contains three columns, platform, post type and average number of likes. 
const socialMediaTime = d3.csv("socialMediaTime.csv");

socialMediaTime.then(function (data) {
  // Convert string values to numbers
  data.forEach(function (d) {
    d.Likes = +d.Likes;
  });

  // Define the dimensions and margins for the SVG
  const width = 600, height = 400;
  const margin = { top: 30, bottom: 70, left: 50, right: 100 };

  // Create the SVG container
  const svg = d3.select("#lineplot")
    .attr("width", width)
    .attr("height", height)
    .style('background', '#e9f7f2');

  // Set up scales for x and y axes  

  const xScale = d3.scaleBand()
    .domain([...new Set(data.map(d => d.Date))])
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Likes), d3.max(data, d => d.Likes)])
    .range([height - margin.bottom, margin.top]);

  // Draw the axis, you can rotate the text in the x-axis here

  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft().scale(yScale));

  const xLabels = svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom().scale(xScale));

  xLabels.selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-25)");

  // Add x-axis label
  svg.append('text')
    .text('Date')
    .attr('x', width / 2)
    .attr('y', height - 5)
    .attr('text-anchor', 'middle');

  // Add y-axis label
  svg.append('text')
    .text('Likes')
    .attr('x', -height / 2)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle');


  // Draw the line and path. Remember to use curveNatural. 

  let line = d3.line()
    .x(d => xScale(d.Date) + xScale.bandwidth() / 2)
    .y(d => yScale(d.Likes))
    .curve(d3.curveNatural)


  let path = svg.append('path')
    .datum(data)
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('d', line)
    .attr('fill', 'none')


});


