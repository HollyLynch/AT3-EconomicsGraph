var ctx = document.getElementById('myChart').getContext('2d');
//values when the lines are moved
var xDeL = 10;
var yDeL = 0;
var xDeU = 0;
var yDeU = 10;
var xSuU = 10;
var ySuU = 10;
var xSuL = 0;
var ySuL = 0;

// Function to recalculate x and y intersection values
function recalculateIntersections() {
  //yIn is the demand linear equation
  //xIn = ((yDe / ((ySuU / xSuU)+(yDe / xDe))));
  //yIn = ((-(yDe) / xDe) * (yDe / ((ySuU / xSuU) + (yDe / xDe))) + yDe);

  //x intersect
  //xIn = (yDeU - ySuL) / (((ySuU - ySuL) / xSuU) + (yDeU / xDeL));
  //xIn = ((yDeL / xDeL) - ((yDeL - yDeU) / (xDeL - xDeU))) - ((ySuL / xSuL) - ((ySuU - ySuL) / (xSuU = xSuL))) / (((ySuU - ySuL) / (xSuU - xSuL)) + ((yDeL - yDeU) / (xDeL - xDeU)));

  //putting the x into an equation
  //yIn = (-yDeU / xDeL) * xIn+yDeU;
  //yIn = ((yDeL - yDeU) / (xDeL - xDeU)) * xIn + ((yDeL / xDeL) - ((yDeL - yDeU) / (xDeL - xDeU)));
  //console.log("yIn:",yIn)

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
  document.getElementById("xDLVal").innerHTML = xDeL.toFixed(3); //demand lower
  document.getElementById("yDLVal").innerHTML = yDeL.toFixed(3);
  document.getElementById("xDUVal").innerHTML = xDeU.toFixed(3); //demand upper
  document.getElementById("yDUVal").innerHTML = yDeU.toFixed(3);
  document.getElementById("xSLVal").innerHTML = xSuL.toFixed(3); //supply lower
  document.getElementById("ySLVal").innerHTML = ySuL.toFixed(3);
  document.getElementById("xSUVal").innerHTML = xSuU.toFixed(3); //supply upper
  document.getElementById("ySUVal").innerHTML = ySuU.toFixed(3);
  document.getElementById("xInVal").innerHTML = xIn.toFixed(3); //equilibrium
  document.getElementById("yInVal").innerHTML = yIn.toFixed(3);
  document.getElementById("xIVal").innerHTML = xIn.toFixed(3); //intersect
  document.getElementById("yIVal").innerHTML = yIn.toFixed(3); //intersect


}
updateSummary();

function updateChartData(chart) {
  //updating the data point in the chart dataset
  //supply line
  chart.data.datasets[0].data = [{x: xSuL, y: ySuL}, {x: xSuU, y: ySuU}];
  //demand line
  chart.data.datasets[1].data = [{x: xDeU, y: yDeU}, {x: xDeL, y: yDeL}];
  //the inbetween bit
  //function is the x and y intersects
  chart.data.datasets[2].data = [{x: xSuL, y: ySuL}, {x:xIn, y:yIn}, {x: xDeL, y: yDeL}];
  //x equilibrium
  chart.data.datasets[3].data = [{x: xIn, y: yIn}, {x: xIn, y: 0}];
  //y equiilibrium
  //red
  chart.data.datasets[4].data = [{x: 0, y: yIn}, {x: xIn, y: yIn}];

  // Find the maximum x and y values among all datasets
  let maxX = Math.max(xDeL, xDeU, xSuL, xSuU, xIn) + 0.2; // Adding 0.2 for extra space
  let maxY = Math.max(yDeL, yDeU, ySuU, ySuL, yIn) + 0.2; // Adding 0.2 for extra space

  // Update the axis limits
  chart.options.scales.x.min = 0;
  chart.options.scales.x.max = maxX;
  chart.options.scales.y.min = 0;
  chart.options.scales.y.max = maxY;

  recalculateIntersections();
  
  chart.update() //redraws chart
}

//setting chart values etc
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    datasets: [{ //setting each line
      label: 'Supply',
      data: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      borderColor: "#ff6385",
      fill: false,
      hidden: false,
    },
    {
      label: 'Demand',
      data: [{ x: 0, y: 1 }, { x: 1, y: 0 }],
      borderColor: "#36a3eb",
      fill: false,
    },
    {
      label: 'S->D',
      data: [{ x: xSuL, y: ySuL }, { x: xIn, y: yIn }, { x: xDeL, y: yDeL }],
      borderColor: "#36a3eb", //so it blends in with the demand line
      fill: 'start',
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
      borderColor: /*"black"*/ "red",
      borderDash: [4, 4],
      fill: false,
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
        }
      },
        afterRender: function (chart) {
          positionHandles();
        }
    }
  }
});
updateChartData(myChart)
console.log(myChart)

//'handles' to move the lines
function positionHandles() {
  var canvasPosition = myChart.canvas.getBoundingClientRect();
  //demand x handle
  var xDeHandle = document.getElementById('xDeHandle');
  //xDeHandle.style.left = canvasPosition.left +(myChart.scales.x.getPixelForValue(xDe) - 10) + 'px'; //-10 for half of the handle width
  //xDeHandle.style.top = canvasPosition.top + (myChart.scales.y.getPixelForValue(0) - 10) + 'px'; //-10 for half of the handle height
  xDeHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(xDeL) - 10) + 'px'; // -10 for half of the handle width
  xDeHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(yDeL) - 10) + 'px'; // -10 for half of the handle height
  //console.log("top " + canvasPosition.top)
  //console.log("scale " + (myChart.scales.y.getPixelForValue(0) - 10))
  //console.log("handle " + xDeHandle.style.top)

  //demand y handle
  var yDeHandle = document.getElementById('yDeHandle');
  //yDeHandle.style.left = canvasPosition.left +(myChart.scales.x.getPixelForValue(0) - 10) + 'px'; //-10 for half of the handle width
  //yDeHandle.style.top = canvasPosition.top + (myChart.scales.y.getPixelForValue(yDe) - 10) + 'px'; //-10 for half of the handle height
  yDeHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(xDeU) - 10) + 'px'; // -10 for half of the handle width
  yDeHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(yDeU) - 10) + 'px'; // -10 for half of the handle height
 

  //supply y handle
  var ySuHandle = document.getElementById('ySuHandle');
  ySuHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(xSuU) - 10) + 'px'; // -10 for half of the handle width
  ySuHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(ySuU) - 10) + 'px'; // -10 for half of the handle height
  //SuHandle.style.left = canvasPosition.left +(myChart.scales.x.getPixelForValue(xSuU) - 10) + 'px'; //-10 for half of the handle width
  //SuHandle.style.top = canvasPosition.top + (myChart.scales.y.getPixelForValue(ySuU) - 10) + 'px'; //-10 for half of the handle height

  //supply x handle
  var xSuHandle = document.getElementById('xSuHandle');
  xSuHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(xSuL) - 10) + 'px'; // -10 for half of the handle width
  xSuHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(ySuL) - 10) + 'px'; // -10 for half of the handle height
}

positionHandles()

//resizes the handles when the window is resized
//window.addEventListener('resize', positionHandles)
window.addEventListener('resize', function () {
  myChart.resize(); // Ensure the chart itself is resized correctly

  updateChartData(myChart);
  positionHandles(); // Update handle positions after resizing the chart

});

var xDeHandle = document.getElementById('xDeHandle');
var yDeHandle = document.getElementById('yDeHandle');
var ySuHandle = document.getElementById('ySuHandle');
var xSuHandle = document.getElementById('xSuHandle');

var isDragging = false;
var xDeDragging = false;
var yDeDragging = false;
var ySuDragging = false;
var xSuDragging = false;

xDeHandle.addEventListener('mousedown', function(e) {
  //the handle drags when the mouse is pressed down
  isDragging = true;
  xDeDragging = true;
  // console.log("dragging");
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
//add this for other handles!!!

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
      console.log(xIn + " x")
      console.log(yIn + " y")

      console.log(xDeL);
      //updateChartData(myChart);
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
      console.log(yDeU + " yDe", xDeL + " xDe", xSuU + " xSuU", ySuU + " ySuU", ySuL + " ySuL");
      console.log(xIn + " x")
      console.log(yIn + " y")
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
      console.log("xSuU: ", xSuU, "ySuU: ", ySuU)
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

    //add ***Dragging for the rest
    recalculateIntersections();
    updateChartData(myChart); //updated chart for all the drags
    updateSummary();
    positionHandles(); //updates the handles
  }
});

window.addEventListener('mouseup', function(e) {
  if (isDragging) {
    isDragging = false;
    // console.log("not dragging");
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
})
