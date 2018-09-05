
//Variablen
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var Width = 640;
var Height = 640;
var fps = 60;

var grid_size = 35;

var mouse_x = 0;
var mouse_y = 0;
var pixel = [];
for(var i = 0; i < grid_size; i ++){
  pixel[i] = [];
}

ctx.fillStyle = "#999999";
ctx.fillRect(0,0,800,640);

function getMousePos(canvas,evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top};
}

canvas.addEventListener('mousemove',function(evt){
  var mousePos = getMousePos(canvas, evt);
  var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
  mouse_x = mousePos.x;
  mouse_y = mousePos.y;
},false);

function update(){}

function draw_grid(){
  for(var i = 0 ; i < grid_size-1; i++){
    for(var j = 0; j < grid_size-1; j++){
      ctx.fillStyle = "#BBBBBB"; ctx.fillRect(10+(j*(640/grid_size)),10+(i*(640/grid_size)),(600/grid_size),(600/grid_size));
      pixel[j][i] = 0;
    }
  }

}

function draw_canvas(){
  ctx.clearRect(0,0,Width,Height);
  ctx.fillStyle = "#888888"; ctx.fillRect(0,0,Width,Height);
  ctx.fillStyle = "#EEEEEE"; ctx.fillRect(5,5,Width-10,Height-10);
}

function loop(timestamp){
  var progress = timestamp - lastRender;
  update(progress);
  draw_canvas();
  draw_grid();
  lastRender = timestamp;

}
var lastRender = 0

function run(){
  setTimeout(function(){
    loop(lastRender);
    requestAnimationFrame(run);
    inc_v += 0.03;
  }, 1000 / fps);
}
run();
