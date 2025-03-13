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

  const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.Platform);

  quantilesByGroups.forEach((quantiles, platform) => {
    const x = xScale(platform);
    const boxWidth = xScale.bandwidth();

    // Draw vertical lines (whiskers)
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


  // Define the dimensions and margins for the SVG


  // Create the SVG container


  // Define four scales
  // Scale x0 is for the platform, which divide the whole scale into 4 parts
  // Scale x1 is for the post type, which divide each bandwidth of the previous x0 scale into three part for each post type
  // Recommend to add more spaces for the y scale for the legend
  // Also need a color scale for the post type

  const x0 = d3.scaleBand()


  const x1 = d3.scaleBand()


  const y = d3.scaleLinear()


  const color = d3.scaleOrdinal()
    .domain([...new Set(data.map(d => d.PostType))])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  // Add scales x0 and y     


  // Add x-axis label


  // Add y-axis label


  // Group container for bars
  const barGroups = svg.selectAll("bar")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${x0(d.Platform)},0)`);

  // Draw bars
  barGroups.append("rect")


  // Add the legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width - 150}, ${margin.top})`);

  const types = [...new Set(data.map(d => d.PostType))];

  types.forEach((type, i) => {

    // Alread have the text information for the legend. 
    // Now add a small square/rect bar next to the text with different color.
    legend.append("text")
      .attr("x", 20)
      .attr("y", i * 20 + 12)
      .text(type)
      .attr("alignment-baseline", "middle");
  });

});

// Prepare you data and load the data again. 
// This data should contains two columns, date (3/1-3/7) and average number of likes. 

const socialMediaTime = d3.csv("socialMediaTime.csv");

socialMediaTime.then(function (data) {
  // Convert string values to numbers


  // Define the dimensions and margins for the SVG


  // Create the SVG container


  // Set up scales for x and y axes  


  // Draw the axis, you can rotate the text in the x-axis here


  // Add x-axis label


  // Add y-axis label


  // Draw the line and path. Remember to use curveNatural. 

});
