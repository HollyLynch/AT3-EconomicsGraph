var ctx = document.getElementById('myChart').getContext('2d');
//values when the lines are moved
var xDeL = 10; //x demand lower
var yDeL = 0;
var xDeU = 0; //x demand upper
var yDeU = 10;
var xSuU = 10; //x supply upper
var ySuU = 10;
var xSuL = 0; //x supply lower
var ySuL = 0;

var axDeL = 8; //extra x demand lower
var ayDeL = 0;
var axDeU = 0; //extra x demand upper
var ayDeU = 8;
var axSuU = 10; //extra x supply upper
var aySuU = 8;
var axSuL = 2; //extra x supply lower
var aySuL = 0;

// Function to recalculate x and y intersection values
function recalculateIntersections() {
  //demand line y=mx+c variables
  mDe = (yDeL - yDeU) / (xDeL - xDeU);
  cDe = yDeU - (mDe * xDeU);
  //supply line y=mx+c variables
  mSu = (ySuU - ySuL) / (xSuU - xSuL);
  cSu = ySuL - (mSu * xSuL);
  //x intersect (S=D)
  xIn = (cDe - cSu) / (mSu - mDe);
  //putting x into D
  yIn = (mDe * xIn) + cDe;
}
recalculateIntersections();

function updateSummary() {
  //original demand & supply
  document.getElementById("xDLVal").innerHTML = xDeL.toFixed(1); //demand lower
  document.getElementById("yDLVal").innerHTML = yDeL.toFixed(1);
  document.getElementById("xDUVal").innerHTML = xDeU.toFixed(1); //demand upper
  document.getElementById("yDUVal").innerHTML = yDeU.toFixed(1);
  document.getElementById("xSLVal").innerHTML = xSuL.toFixed(1); //supply lower
  document.getElementById("ySLVal").innerHTML = ySuL.toFixed(1);
  document.getElementById("xSUVal").innerHTML = xSuU.toFixed(1); //supply upper
  document.getElementById("ySUVal").innerHTML = ySuU.toFixed(1);
  //ADDITIONAL demand & supply
  document.getElementById("axDLVal").innerHTML = axDeL.toFixed(1); //demand lower
  document.getElementById("ayDLVal").innerHTML = ayDeL.toFixed(1);
  document.getElementById("axDUVal").innerHTML = axDeU.toFixed(1); //demand upper
  document.getElementById("ayDUVal").innerHTML = ayDeU.toFixed(1);
  document.getElementById("axSLVal").innerHTML = axSuL.toFixed(1); //supply lower
  document.getElementById("aySLVal").innerHTML = aySuL.toFixed(1);
  document.getElementById("axSUVal").innerHTML = axSuU.toFixed(1); //supply upper
  document.getElementById("aySUVal").innerHTML = aySuU.toFixed(1);
  //equilibrium
  document.getElementById("xInVal").innerHTML = xIn.toFixed(3); //equilibrium
  document.getElementById("yInVal").innerHTML = yIn.toFixed(3);
  //document.getElementById("xIVal").innerHTML = xIn.toFixed(3); //intersect
  //document.getElementById("yIVal").innerHTML = yIn.toFixed(3); //intersect
}
updateSummary();

function updateChartData(chart) {
  //updating the data point in the chart dataset
  //supply line
  chart.data.datasets[0].data = [{ x: xSuL, y: ySuL }, { x: xSuU, y: ySuU }];
  //demand line
  chart.data.datasets[1].data = [{ x: xDeU, y: yDeU }, { x: xDeL, y: yDeL }];
  //function is the x and y intersects (S->D)
  chart.data.datasets[2].data = [{ x: xSuL, y: ySuL }, { x: xIn, y: yIn }, { x: xDeL, y: yDeL }];

  //additional supply line
  chart.data.datasets[3].data = [{ x: axSuL, y: aySuL }, { x: axSuU, y: aySuU }];
  //addtional demand line
  chart.data.datasets[4].data = [{ x: axDeU, y: ayDeU }, { x: axDeL, y: ayDeL }];

  //x equilibrium
  chart.data.datasets[5].data = [{ x: xIn, y: yIn }, { x: xIn, y: 0 }];
  //y equiilibrium
  //red
  chart.data.datasets[6].data = [{ x: 0, y: yIn }, { x: xIn, y: yIn }];

  //consumer surplus
  chart.data.datasets[7].data = [{ x: 0, y: yDeU }, { x: xDeU, y: yDeU }, { x: xIn, y: yIn }];
  //producer surplus
  chart.data.datasets[8].data = [{ x: 0, y: ySuL }, { x: xSuL, y: ySuL }, { x: xIn, y: yIn }];

  // Find the maximum x and y values among all datasets
  let maxX = Math.max(xDeL, xDeU, xSuL, xSuU, xIn, axDeL, axDeU, axSuL, axSuU) + 0.2; // Adding 0.2 for extra space
  let maxY = Math.max(yDeL, yDeU, ySuU, ySuL, yIn, ayDeL, ayDeU, aySuL, aySuU) + 0.2; // Adding 0.2 for extra space

  // Update the axis limits
  chart.options.scales.x.min = 0;
  chart.options.scales.x.max = maxX;
  chart.options.scales.y.min = 0;
  chart.options.scales.y.max = maxY;

  recalculateIntersections();
  
  chart.update() //redraws chart
}

const legendOnClick = function(e,legendItem,legend) {

  const index = legendItem.datasetIndex;
  const ci = legend.chart;
  if (ci.isDatasetVisible(index)) {
    ci.hide(index);
    legendItem.hidden = true;
    console.log('hidden');
  } else {
    ci.show(index);
    legendItem.hidden = false;
    console.log('visible');
  }

  //Su
  if (!myChart.isDatasetVisible(0)) {
    console.log("hidden");
    document.getElementById('xSuHandle').style.display = "none";
    document.getElementById('ySuHandle').style.display = "none";
  }
  if (myChart.isDatasetVisible(0)) {
    console.log("visable");
    document.getElementById('xSuHandle').style.display = "block";
    document.getElementById('ySuHandle').style.display = "block";
  }
  //De
  if (!myChart.isDatasetVisible(1)) {
    console.log("hidden");
    document.getElementById('xDeHandle').style.display = "none";
    document.getElementById('yDeHandle').style.display = "none";
  }
  if (myChart.isDatasetVisible(1)) {
    console.log("visable");
    document.getElementById('xDeHandle').style.display = "block";
    document.getElementById('yDeHandle').style.display = "block";
  }
  //aSu
  if (!myChart.isDatasetVisible(3)) {
    console.log("hidden");
    document.getElementById('axSuHandle').style.display = "none";
    document.getElementById('aySuHandle').style.display = "none";
  }
  if (myChart.isDatasetVisible(3)) {
    console.log("visable");
    document.getElementById('axSuHandle').style.display = "block";
    document.getElementById('aySuHandle').style.display = "block";
  }
  //aDe
  if (!myChart.isDatasetVisible(4)) {
    console.log("hidden");
    document.getElementById('axDeHandle').style.display = "none";
    document.getElementById('ayDeHandle').style.display = "none";
  }
  if (myChart.isDatasetVisible(4)) {
    console.log("visable");
    document.getElementById('axDeHandle').style.display = "block";
    document.getElementById('ayDeHandle').style.display = "block";
  }
}


//setting chart values etc
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    datasets: [{ //setting each line
      label: 'Supply',
      data: [{ x: xSuL, y: ySuL }, { x: xSuU, y: ySuU }],
      borderColor: "#ff6385",
      fill: false,
      backgroundColor: "#ff6385",
      hidden: false,
    },
    {
      label: 'Demand',
      data: [{ x: xDeU, y: yDeU }, { x: xDeL, y: yDeL }],
      borderColor: "#36a3eb",
      fill: false,
      backgroundColor: "#36a3eb",
    },
    {
      label: 'S->D',
      data: [{ x: xSuL, y: ySuL }, { x: xIn, y: yIn }, { x: xDeL, y: yDeL }],
      borderColor: "#36a3eb", //so it blends in with the demand line
      fill: 'start',
    },
    {
      label: 'supply2',
      data: [{ x: axSuL, y: aySuL }, { x: axSuU, y: aySuU }],
      borderColor: "#ff2937",
      fill: false,
      backgroundColor: "#ff2937",
      hidden: true,
    },
    {
      label: 'demand2',
      data: [{ x: axDeU, y: ayDeU }, { x: axDeL, y: ayDeL }],
      borderColor: "#236af7",
      fill: false,
      backgroundColor: "#236af7",
      hidden: true,
    },
    {
      label: 'X-Equilibrium',
      data: [{ x: xIn, y: yIn }, { x: xIn, y: 0 }],
      borderColor: "black",
      borderDash: [4, 4],
      fill: false,
    },
    {
      label: 'Y-Equilibrium',
      data: [{ x: 0, y: yIn }, { x: xIn, y: yIn }],
      borderColor: "black" /*"red"*/,
      borderDash: [4, 4],
      fill: false,
    },
    {
      label: 'Consumer Surplus',
      data: [{ x: 0, y: yDeU }, { x: xDeU, y: yDeU }, { x: xIn, y: yIn }],
      borderColor: "#ffa742",
      fill: "-1", //fills to the one before (y-equilibrium)
      backgroundColor: "#ffa742",
    },
    {
      label: 'Producer Surplus',
      data: [{ x: 0, y: ySuL }, { x: xSuL, y: ySuL }, { x: xIn, y: yIn }],
      borderColor: "#a3ff75",
      fill: "-2", //fill to 2 before (y-equilibrium)
      backgroundColor: "#a3ff75",
    }

              ]
  },
  options: {
    scales: {
      x: { //sets the x axis
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Quantity'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price'
        }
      }
    },
    elements: {
      line: {
        tension: 0 //disables bezier curves (only linear lines)
      }
    },
    plugins: {
      legend: {
        labels: {
          filter: function(item, chart) {
            //if the label is any of them, don't show it
            return item.text !== 'S->D' && item.text !== 'X-Equilibrium' && item.text !== 'Y-Equilibrium';
          }
        },
        onclick: legendOnClick,
      },
        afterRender: function (chart) {
          positionHandles();
        }
    }
  }
});
updateChartData(myChart)



//'handles' to move the lines
function positionHandles() {
  //ADD A DIV IN INDEX!!
  var canvasPosition = myChart.canvas.getBoundingClientRect();
  //demand x handle
  var xDeHandle = document.getElementById('xDeHandle');
  xDeHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(xDeL) - 10) + 'px'; // -10 for half of the handle width
  xDeHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(yDeL) - 10) + 'px'; // -10 for half of the handle height
  //demand y handle
  var yDeHandle = document.getElementById('yDeHandle');
  yDeHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(xDeU) - 10) + 'px';
  yDeHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(yDeU) - 10) + 'px';

  //supply y handle
  var ySuHandle = document.getElementById('ySuHandle');
  ySuHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(xSuU) - 10) + 'px';
  ySuHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(ySuU) - 10) + 'px';
  //supply x handle
  var xSuHandle = document.getElementById('xSuHandle');
  xSuHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(xSuL) - 10) + 'px';
  xSuHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(ySuL) - 10) + 'px';


  //additional demand x handle
  var axDeHandle = document.getElementById('axDeHandle');
  axDeHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(axDeL) - 10) + 'px';
  axDeHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(ayDeL) - 10) + 'px';
  //additional demand y handle
  var ayDeHandle = document.getElementById('ayDeHandle');
  ayDeHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(axDeU) - 10) + 'px';
  ayDeHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(ayDeU) - 10) + 'px';


  //additional supply y handle
  var aySuHandle = document.getElementById('aySuHandle');
  aySuHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(axSuU) - 10) + 'px';
  aySuHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(aySuU) - 10) + 'px';
  //additional supply x handle
  var axSuHandle = document.getElementById('axSuHandle');
  axSuHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(axSuL) - 10) + 'px';
  axSuHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(aySuL) - 10) + 'px';
  //check each dataset in chart
  //if dataset is hidden, hide handles

}

positionHandles()

//resizes the handles when the window is resized
//window.addEventListener('resize', positionHandles)
window.addEventListener('resize', function () {
  myChart.resize(); // Ensure the chart itself is resized correctly

  updateChartData(myChart);
  positionHandles(); // Update handle positions after resizing the chart
});

//values form listener
//ADD ADDITIONAL VALUES WHEN UPDATING SUMMARY
document.getElementById("values-form").addEventListener("submit", function (event) {
  event.preventDefault();

    //original
    xDeU = parseInt(document.getElementById("xDeUVal").value);
    yDeU = parseInt(document.getElementById("yDeUVal").value);
    xDeL = parseInt(document.getElementById("xDeLVal").value);
    yDeL = parseInt(document.getElementById("yDeLVal").value);
    xSuL = parseInt(document.getElementById("xSuLVal").value);
    ySuL = parseInt(document.getElementById("ySuLVal").value);
    xSuU = parseInt(document.getElementById("xSuUVal").value);
    ySuU = parseInt(document.getElementById("ySuUVal").value);
    //additional
    axDeU = parseInt(document.getElementById("axDeUVal").value);
    ayDeU = parseInt(document.getElementById("ayDeUVal").value);
    axDeL = parseInt(document.getElementById("axDeLVal").value);
    ayDeL = parseInt(document.getElementById("ayDeLVal").value);
    axSuL = parseInt(document.getElementById("axSuLVal").value);
    aySuL = parseInt(document.getElementById("aySuLVal").value);
    axSuU = parseInt(document.getElementById("axSuUVal").value);
    aySuU = parseInt(document.getElementById("aySuUVal").value);
  
  //forces the variables to be at the equilbrium point and not below
  if (xDeU >= xIn) {
    xDeU = xIn;
  }
  if (yDeU <= yIn) {
    yDeU = yIn;
  }
  if (xDeL <= xIn) {
    xDeL = xIn;
  }
  if (yDeL >= yIn) {
    yDeL = yIn;
  }
  if (xSuU <= xIn) {
    xSuU = xIn;
  }
  if (ySuU <= yIn) {
    ySuU = yIn;
  }
  if (xSuL >= xIn) {
    xSuL = xIn;
  }
  if (ySuL >= yIn) {
    ySuL = yIn;
  }

  recalculateIntersections();
  updateChartData(myChart); //updated chart for all the drags
  updateSummary();
  positionHandles(); //updates the handles
});

//resets all values
function reset() {
  //resets graph
  xDeL = 10;
  yDeL = 0;
  xDeU = 0;
  yDeU = 10;
  xSuU = 10;
  ySuU = 10;
  xSuL = 0;
  ySuL = 0;
  //additional lines
  axDeL = 8;
  ayDeL = 0;
  axDeU = 0;
  ayDeU = 8;
  axSuU = 10;
  aySuU = 8;
  axSuL = 2;
  aySuL = 0;

  //resets input defaults
  document.getElementById("xDeLVal").value = 10;
  document.getElementById("yDeLVal").value = 0;
  document.getElementById("xDeUVal").value = 0;
  document.getElementById("yDeUVal").value = 10;
  document.getElementById("xSuLVal").value = 0;
  document.getElementById("ySuLVal").value = 0;
  document.getElementById("xSuUVal").value = 10;
  document.getElementById("ySuUVal").value = 10;

  document.getElementById("axDeLVal").value = 8;
  document.getElementById("ayDeLVal").value = 0;
  document.getElementById("axDeUVal").value = 0;
  document.getElementById("ayDeUVal").value = 8;
  document.getElementById("axSuLVal").value = 2;
  document.getElementById("aySuLVal").value = 0;
  document.getElementById("axSuUVal").value = 10;
  document.getElementById("aySuUVal").value = 8;


  recalculateIntersections();
  updateChartData(myChart); //updated chart for all the drags
  updateSummary();
  positionHandles(); //updates the handles
}


//original
var xDeHandle = document.getElementById('xDeHandle');
var yDeHandle = document.getElementById('yDeHandle');
var ySuHandle = document.getElementById('ySuHandle');
var xSuHandle = document.getElementById('xSuHandle');
//additional
var axDeHandle = document.getElementById('axDeHandle');
var ayDeHandle = document.getElementById('ayDeHandle');
var aySuHandle = document.getElementById('aySuHandle');
var axSuHandle = document.getElementById('axSuHandle');

//original
var isDragging = false;
var xDeDragging = false;
var yDeDragging = false;
var ySuDragging = false;
var xSuDragging = false;
//additional
var axDeDragging = false;
var ayDeDragging = false;
var aySuDragging = false;
var axSuDragging = false;

xDeHandle.addEventListener('mousedown', function(e) {
  //the handle drags when the mouse is pressed down
  isDragging = true;
  xDeDragging = true;
});
yDeHandle.addEventListener('mousedown', function (e) {
  isDragging = true;
  yDeDragging = true;
});
ySuHandle.addEventListener('mousedown', function (e) {
  isDragging = true;
  ySuDragging = true;
});
xSuHandle.addEventListener('mousedown', function (e) {
  isDragging = true;
  xSuDragging = true;
});
axDeHandle.addEventListener('mousedown', function (e) {
  //the handle drags when the mouse is pressed down
  isDragging = true;
  axDeDragging = true;
});
ayDeHandle.addEventListener('mousedown', function (e) {
  isDragging = true;
  ayDeDragging = true;
});
aySuHandle.addEventListener('mousedown', function (e) {
  isDragging = true;
  aySuDragging = true;
});
axSuHandle.addEventListener('mousedown', function (e) {
  isDragging = true;
  axSuDragging = true;
});

window.addEventListener('mousemove', function(e) {
  //moves the handles when the mouse moves
  //toFixed means to the 1st decimal point (0 is none, 2 is 2nd etc)
  if (isDragging) {

    if(xDeDragging) {
      xDeL = (myChart.scales.x.getValueForPixel(e.clientX - myChart.canvas.getBoundingClientRect().left)).toFixed(1);
      if (xDeL <= 0) {
        //sets min as 0
        xDeL = 0;
      }
      else if (xDeL <= xIn){
        xDeL = xIn;
      }
      else {
        xDeL = parseFloat(xDeL);
      }
      yDeL = (myChart.scales.y.getValueForPixel(e.clientY - myChart.canvas.getBoundingClientRect().top)).toFixed(1);
      if (yDeL <= 0) {
        //sets min as 0
        yDeL = 0;
      }
      else if (yDeL >= yIn) {
        yDeL = yIn;
      }
      else {
        yDeL = parseFloat(yDeL);
      }
    }
    if(yDeDragging) {
      yDeU = (myChart.scales.y.getValueForPixel(e.clientY - myChart.canvas.getBoundingClientRect().top)).toFixed(1);
      if (yDeU <= 0) {
        //sets min as 0
        yDeU = 0;
      }
      else if (yDeU <= yIn) {
        yDeU = yIn;
      }
      else {
        yDeU = parseFloat(yDeU);
      }
      xDeU = (myChart.scales.x.getValueForPixel(e.clientX - myChart.canvas.getBoundingClientRect().left)).toFixed(1);
      if (xDeU <= 0) {
        //sets min as 0
        xDeU = 0;
      }
      else if (xDeU >= xIn) {
        xDeU = xIn;
      }
      else {
        xDeU = parseFloat(xDeU);
      }
    }
    if(ySuDragging) {
      ySuU = (myChart.scales.y.getValueForPixel(e.clientY - myChart.canvas.getBoundingClientRect().top)).toFixed(1);
      if (ySuU <= 0) {
        //sets min as 0
        ySuU = 0;
      }
      else if (ySuU <= yIn) {
        ySuU = yIn;
      }
      else {
        ySuU = parseFloat(ySuU);
      }
      xSuU = (myChart.scales.x.getValueForPixel(e.clientX - myChart.canvas.getBoundingClientRect().left)).toFixed(1);
      if (xSuU <= 0) {
        //sets min as 0
        xSuU = 0;
      }
      else if (xSuU <= xIn) {
        xSuU = xIn;
      }
      else {
        xSuU = parseFloat(xSuU);
      }
    }
    if(xSuDragging) {
      ySuL = (myChart.scales.y.getValueForPixel(e.clientY - myChart.canvas.getBoundingClientRect().top)).toFixed(1);
      if (ySuL <= 0) {
        //sets min as 0
        ySuL = 0;
      }
      else if (ySuL >= yIn) {
        ySuL = yIn;
      }
      else {
        ySuL = parseFloat(ySuL);
      }
      xSuL = (myChart.scales.x.getValueForPixel(e.clientX - myChart.canvas.getBoundingClientRect().left)).toFixed(1);
      if (xSuL <= 0) {
        //sets min as 0
        xSuL = 0;
      }
      else if (xSuL >= xIn) {
        xSuL = xIn;
      }
      else {
        xSuL = parseFloat(xSuL);
      }
    }

    if (axDeDragging) {
      axDeL = (myChart.scales.x.getValueForPixel(e.clientX - myChart.canvas.getBoundingClientRect().left)).toFixed(1);
      if (axDeL <= 0) {
        //sets min as 0
        axDeL = 0;
      }
      //else if (axDeL <= xIn) {
      //  axDeL = xIn;
      //}
      else {
        axDeL = parseFloat(axDeL);
      }
      ayDeL = (myChart.scales.y.getValueForPixel(e.clientY - myChart.canvas.getBoundingClientRect().top)).toFixed(1);
      if (ayDeL <= 0) {
        //sets min as 0
        ayDeL = 0;
      }
      //else if (ayDeL >= yIn) {
      //  ayDeL = yIn;
      //}
      else {
        ayDeL = parseFloat(ayDeL);
      }
    }
    if (ayDeDragging) {
      ayDeU = (myChart.scales.y.getValueForPixel(e.clientY - myChart.canvas.getBoundingClientRect().top)).toFixed(1);
      if (ayDeU <= 0) {
        //sets min as 0
        ayDeU = 0;
      }
      //else if (ayDeU <= yIn) {
      //  ayDeU = yIn;
      //}
      else {
        ayDeU = parseFloat(ayDeU);
      }
      axDeU = (myChart.scales.x.getValueForPixel(e.clientX - myChart.canvas.getBoundingClientRect().left)).toFixed(1);
      if (axDeU <= 0) {
        //sets min as 0
        axDeU = 0;
      }
      //else if (axDeU >= xIn) {
      //  axDeU = xIn;
      //}
      else {
        axDeU = parseFloat(axDeU);
      }
    }
    if (aySuDragging) {
      aySuU = (myChart.scales.y.getValueForPixel(e.clientY - myChart.canvas.getBoundingClientRect().top)).toFixed(1);
      if (aySuU <= 0) {
        //sets min as 0
        aySuU = 0;
      }
      //else if (aySuU <= yIn) {
      //  aySuU = yIn;
      //}
      else {
        aySuU = parseFloat(aySuU);
      }
      axSuU = (myChart.scales.x.getValueForPixel(e.clientX - myChart.canvas.getBoundingClientRect().left)).toFixed(1);
      if (axSuU <= 0) {
        //sets min as 0
        axSuU = 0;
      }
      //else if (axSuU <= xIn) {
      //  axSuU = xIn;
      //}
      else {
        axSuU = parseFloat(axSuU);
      }
    }
    if (axSuDragging) {
      aySuL = (myChart.scales.y.getValueForPixel(e.clientY - myChart.canvas.getBoundingClientRect().top)).toFixed(1);
      if (aySuL <= 0) {
        //sets min as 0
        aySuL = 0;
      }
      //else if (aySuL >= yIn) {
      //  aySuL = yIn;
      //}
      else {
        aySuL = parseFloat(aySuL);
      }
      axSuL = (myChart.scales.x.getValueForPixel(e.clientX - myChart.canvas.getBoundingClientRect().left)).toFixed(1);
      if (axSuL <= 0) {
        //sets min as 0
        axSuL = 0;
      }
      //else if (axSuL >= xIn) {
      //  axSuL = xIn;
      //}
      else {
        axSuL = parseFloat(axSuL);
      }
    }
    recalculateIntersections();
    updateChartData(myChart); //updated chart for all the drags
    updateSummary();
    positionHandles(); //updates the handles
  }
});

window.addEventListener('mouseup', function(e) {
  if (isDragging) {
    isDragging = false;
  }
  if (xDeDragging) {
    xDeDragging = false;
  }
  if (yDeDragging) {
    yDeDragging = false;
  }
  if (ySuDragging) {
    ySuDragging = false;
  }
  if (xSuDragging) {
    xSuDragging = false;
  }

  if (axDeDragging) {
    axDeDragging = false;
  }
  if (ayDeDragging) {
    ayDeDragging = false;
  }
  if (aySuDragging) {
    aySuDragging = false;
  }
  if (axSuDragging) {
    axSuDragging = false;
})

