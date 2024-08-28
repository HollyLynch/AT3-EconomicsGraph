var ctx = document.getElementById('myChart').getContext('2d');
//values when the lines are moved
var xDe = 1
var yDe = 1
var xSu = 1
var ySu = 1
//x and y intersect values
var xIn = (yDe/((ySu/xSu)+(yDe/xDe)))
var yIn = ((-(yDe)/xDe)*(yDe/((ySu/xSu)+(yDe/xDe)))+yDe)

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
     borderColor: "black",
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
      }
    }
  }
});
updateChartData(myChart)

//screenshot^^^^

//'handles' to move the lines
function positionHandles() {
  var canvasPosition = myChart.canvas.getBoundingClientRect();

  //demand x handle
  var xDeHandle = document.getElementById('xDeHandle');
  xDeHandle.style.left = canvasPosition.left +(myChart.scales.x.getPixelForValue(xDe) - 10) + 'px'; //-10 for half of the handle width
  xDeHandle.style.top = canvasPosition.top + (myChart.scales.y.getPixelForValue(0) - 10) + 'px'; //-10 for half of the handle height

  //demand y handle
  var yDeHandle = document.getElementById('yDeHandle');
  yDeHandle.style.left = canvasPosition.left +(myChart.scales.x.getPixelForValue(0) - 10) + 'px'; //-10 for half of the handle width
  yDeHandle.style.top = canvasPosition.top + (myChart.scales.y.getPixelForValue(yDe) - 10) + 'px'; //-10 for half of the handle height

  //supply handle
  var SuHandle = document.getElementById('SuHandle');
  SuHandle.style.left = canvasPosition.left +(myChart.scales.x.getPixelForValue(xSu) - 10) + 'px'; //-10 for half of the handle width
  SuHandle.style.top = canvasPosition.top + (myChart.scales.y.getPixelForValue(ySu) - 10) + 'px'; //-10 for half of the handle height
}

positionHandles()
//resizes the handles when the window is resized
window.addEventListener('resize', positionHandles)

var xDeHandle = document.getElementById('xDeHandle');
var yDeHandle = document.getElementById('yDeHandle');
  
var isDragging = false;
var xDeDragging = false;
var yDeDragging = false;

xDeHandle.addEventListener('mousedown', function(e) {
  //the handle drags when the mouse is pressed down
  isDragging = true;
  xDeDragging = true;
  yDeDragging = true;
  // console.log("dragging");
});
//add this for other handles

window.addEventListener('mousemove', function(e) {
  //moves the handles when the mouse moves
  if(isDragging) {
    if(xDeDragging) {
      xDe = (myChart.scales.x.getValueForPixel(e.clientX - myChart.canvas.getBoundingClientRect().left)).toFixed(1);
      console.log(xDe);

      updateChartData(myChart);
    }
    if(yDeDragging) { //HAVENT FINISHED
      yDe = (myChart.scales.x.getValueForPixel(e.clientY - myChart.canvas.getBoundingClientRect().top));
    }
    //add ***Dragging for the rest

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
