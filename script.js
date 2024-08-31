var ctx = document.getElementById('myChart').getContext('2d');
//values when the lines are moved
var xDe = 1
var yDe = 1
var xSu = 1
var ySu = 1
//x and y intersect values
//var xIn = (yDe/((ySu/xSu)+(yDe/xDe)))
//var yIn = ((-(yDe)/xDe)*(yDe/((ySu/xSu)+(yDe/xDe)))+yDe)

// Function to recalculate x and y intersection values
function recalculateIntersections() {
  xIn = (yDe / ((ySu / xSu) + (yDe / xDe)));
  yIn = ((-(yDe) / xDe) * (yDe / ((ySu / xSu) + (yDe / xDe))) + yDe);
}
recalculateIntersections();


function updateChartData(chart) {
  //updating the data point in the chart dataset
  //supply line
  chart.data.datasets[0].data = [{x: 0, y: 0}, {x: xSu, y: ySu}];
  //demand line
  chart.data.datasets[1].data = [{x: 0, y: yDe}, {x: xDe, y: 0}];
  //the inbetween bit
  //function is the x and y intersects
  chart.data.datasets[2].data = [{x: 0, y: 0}, {x:xIn, y:yIn}, {x: xDe, y: 0}];
  //x equilibrium
  chart.data.datasets[3].data = [{x: xIn, y: yIn}, {x: xIn, y: 0}];
  //y equiilibrium
  //red
  chart.data.datasets[4].data = [{x: 0, y: yIn}, {x: xIn, y: yIn}];

  // Find the maximum x and y values among all datasets
  let maxX = Math.max(xDe, xSu, xIn) + 0.2; // Adding 0.2 for extra space
  let maxY = Math.max(yDe, ySu, yIn) + 0.2; // Adding 0.2 for extra space

  // Update the axis limits
  chart.options.scales.x.min = 0;
  chart.options.scales.x.max = maxX;
  chart.options.scales.y.min = 0;
  chart.options.scales.y.max = maxY;

  
  chart.update() //redraws chart
}

//setting chart values etc
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    datasets: [{ //setting each line
      label: 'Supply',
      data: [{x: 0, y: 0}, {x: 1, y: 1}],
      borderColor: "#ff6385",
      fill: false,
    },
    {
      label: 'Demand',
      data: [{x: 0, y: 1}, {x: 1, y: 0}],
      borderColor: "#36a3eb",
      fill: false,
    },
    {
      label: 'S->D',
      data: [{x: 0, y: 0}, {x: xIn, y: yIn}, {x: xDe, y: 0}],
      borderColor: "#36a3eb", //so it blends in with the demand line
      fill: 'start',
    },
    {
      label: 'X-Equilibrium',
      data: [{x: xIn, y: yIn}, {x: xIn, y: 0}],
      borderColor: "black",
      borderDash: [4,4],
      fill: false,
    },
   {
     label: 'Y-Equilibrium',
     data: [{x: 0, y: yIn}, {x: xIn, y: yIn}],
     borderColor: /*"black"*/ "red",
     borderDash: [4,4],
     fill: false,
   }
              ]
  },
  options: {
    scales: {
      x: { //sets the x axis
        type: 'linear',
        position: 'bottom',
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

//'handles' to move the lines
function positionHandles() {
  var canvasPosition = myChart.canvas.getBoundingClientRect();

  //demand x handle
  var xDeHandle = document.getElementById('xDeHandle');
  xDeHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(xDe) - 10) + 'px'; // -10 for half of the handle width
  //xDeHandle.style.left = canvasPosition.left +(myChart.scales.x.getPixelForValue(xDe) - 10) + 'px'; //-10 for half of the handle width
  xDeHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(0) - 10) + 'px'; // -10 for half of the handle height
  //xDeHandle.style.top = canvasPosition.top + (myChart.scales.y.getPixelForValue(0) - 10) + 'px'; //-10 for half of the handle height
  console.log("top " + canvasPosition.top)
  console.log("scale " + (myChart.scales.y.getPixelForValue(0) - 10))
  console.log("handle " + xDeHandle.style.top)

  //demand y handle
  var yDeHandle = document.getElementById('yDeHandle');
  //yDeHandle.style.left = canvasPosition.left +(myChart.scales.x.getPixelForValue(0) - 10) + 'px'; //-10 for half of the handle width
  //yDeHandle.style.top = canvasPosition.top + (myChart.scales.y.getPixelForValue(yDe) - 10) + 'px'; //-10 for half of the handle height
  yDeHandle.style.left = (canvasPosition.left + window.scrollX + myChart.scales.x.getPixelForValue(0) - 10) + 'px'; // -10 for half of the handle width
  yDeHandle.style.top = (canvasPosition.top + window.scrollY + myChart.scales.y.getPixelForValue(yDe) - 10) + 'px'; // -10 for half of the handle height
 

  //delete the supply handle for the screenshot
  //supply handle
  var SuHandle = document.getElementById('SuHandle');
  SuHandle.style.left = canvasPosition.left +(myChart.scales.x.getPixelForValue(xSu) - 10) + 'px'; //-10 for half of the handle width
  SuHandle.style.top = canvasPosition.top + (myChart.scales.y.getPixelForValue(ySu) - 10) + 'px'; //-10 for half of the handle height
}

positionHandles()

//resizes the handles when the window is resized
//window.addEventListener('resize', positionHandles)
window.addEventListener('resize', function () {
  myChart.resize(); // Ensure the chart itself is resized correctly
  positionHandles(); // Update handle positions after resizing the chart

});

var xDeHandle = document.getElementById('xDeHandle');
var yDeHandle = document.getElementById('yDeHandle');
  
var isDragging = false;
var xDeDragging = false;
var yDeDragging = false;

xDeHandle.addEventListener('mousedown', function(e) {
  //the handle drags when the mouse is pressed down
  isDragging = true;
  xDeDragging = true;
  // console.log("dragging");
});
yDeHandle.addEventListener('mousedown', function (e) {
  //the handle drags when the mouse is pressed down
  isDragging = true;
  yDeDragging = true;
});
//add this for other handles!!!

window.addEventListener('mousemove', function(e) {
  //moves the handles when the mouse moves
  //toFixed means to the 1st decimal point (0 is none, 2 is 2nd etc)
  if(isDragging) {
    if(xDeDragging) {
      xDe = (myChart.scales.x.getValueForPixel(e.clientX - myChart.canvas.getBoundingClientRect().left)).toFixed(1);
      if (xDe <= 0) {
        //sets min as 0
        xDe = 0;
      }

      console.log(xDe);
      //updateChartData(myChart);
    }
    if(yDeDragging) {
      yDe = (myChart.scales.y.getValueForPixel(e.clientY - myChart.canvas.getBoundingClientRect().top)).toFixed(1);
      if (yDe <= 0) {
        //sets min as 0
        yDe = 0;
      }

      console.log(yDe);
    }

    //add ***Dragging for the rest
    updateChartData(myChart); //updated chart for all the drags
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
})
