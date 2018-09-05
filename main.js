
//Variablen
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var Width = 640;
var Height = 640;
var fps = 100;

var grid_size = 80;

var mouse_x = 0;
var mouse_y = 0;
var mousedown = false;

var pixel2d = [];

ctx.clearRect(0,0,Width,Height);
ctx.fillStyle = "#888888"; ctx.fillRect(0,0,Width,Height);
ctx.fillStyle = "#EEEEEE"; ctx.fillRect(5,5,Width-10,Height-10);

function Pixel(changed,state){
  this.changed = changed;
  this.state = 0;
  this.next_state = 0;
  var rand_clr =44 + Math.round((Math.random() * 20)+1);
  this.color = "#" + rand_clr + ""+ rand_clr + "" + rand_clr;
}

for(var i = 0; i < grid_size; i++){
  pixel2d[i] = [];
}

for(var i = 0; i < grid_size; i++){
  for(var j = 0; j < grid_size; j++){
    pixel2d[j][i] = new Pixel(false,0);
  }
}



ctx.fillStyle = "#999999";
ctx.fillRect(0,0,800,640);
ctx.fillStyle = "#EEEEEE";
ctx.fillRect(5,5,Width-10,Height-10);

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
canvas.addEventListener('mousedown',function(evt){mousedown = true;},false);
canvas.addEventListener('mouseup',function(evt){mousedown=false;
/*
alert("["+Math.round(mouse_x/(640/grid_size)-1)+ "]["+Math.round(mouse_y/(640/grid_size)-1)+"]: " +
        pixel2d[Math.round(mouse_x/(640/grid_size)-1)][Math.round(mouse_y/(640/grid_size)-1)].state);
*/
},false);

function update(){
}

function place_pixel(){
  var grid_x = Math.round(mouse_x/(640/grid_size)-1);
  var grid_y = Math.round(mouse_y/(640/grid_size)-1);

  for(var i = 0; i < 10; i++){
    for(var j = 0; j < 10; j++){
      pixel2d[grid_x+j][grid_y+i].next_state = 1;
      pixel2d[grid_x+j][grid_y+i].changed = 1;
    }
  }
}


function draw_grid(){
  for(var i = 0 ; i < grid_size-1; i++){
    for(var j = 0; j < grid_size-1; j++){
      if(pixel2d[j][i].state == 1){

        var rand_stay =Math.round((Math.random() * 70)+1);

        if(i == grid_size-2){

        }
        else if(pixel2d[j][i+1].state == 0){
        //Space down free
          pixel2d[j][i+1].next_state = 1;
          pixel2d[j][i+1].changed = true;
          pixel2d[j][i].next_state = 0;
          pixel2d[j][i].changed = true;
        }
        else if (pixel2d[j+1][i+1].state == 0 && rand_stay > 40 && j != grid_size-2) {
        //Space right down free
            pixel2d[j+1][i+1].next_state = 1;
            pixel2d[j+1][i+1].changed = true;
            pixel2d[j][i].next_state = 0;
            pixel2d[j][i].changed = true;

        }
        else if (pixel2d[j-1][i+1].state == 0 && rand_stay > 40 && j != 1) {
        //Space left down free
            pixel2d[j-1][i+1].next_state = 1;
            pixel2d[j-1][i+1].changed = true;
            pixel2d[j][i].next_state = 0;
            pixel2d[j][i].changed = true;

        }

      }
    }
  }

//Apply
  for(var i = 0 ; i < grid_size-1; i++){
    for(var j = 0; j < grid_size-1; j++){
      if(pixel2d[j][i].changed == true){
        pixel2d[j][i].state = pixel2d[j][i].next_state;
        if(pixel2d[j][i].state == 1){
          //var choice = Math.round((Math.random() * 2)+1);
        //  if(pixel2d[j][i-2].state == 0){
        //    color = "338833";
        //  }
        //  else{
            color = pixel2d[j][i].color;
        //  }

          ctx.fillStyle = color; ctx.fillRect(10+(j*(640/grid_size)),10+(i*(640/grid_size)),(640/grid_size),(640/grid_size));
        }else{
          ctx.fillStyle = "#EEEEEE"; ctx.fillRect(10+(j*(640/grid_size)),10+(i*(640/grid_size)),(640/grid_size),(640/grid_size));
        }
        //No Change now
        pixel2d[j][i].changed=false;
      }
    }
  }
}

function draw_canvas(){
  //ctx.clearRect(0,0,Width,Height);
  //ctx.fillStyle = "#888888"; ctx.fillRect(0,0,Width,Height);
  //ctx.fillStyle = "#EEEEEE"; ctx.fillRect(5,5,Width-10,Height-10);
}

function loop(timestamp){
  var progress = timestamp - lastRender;
  //update(progress);
  draw_canvas();
  draw_grid();
  if(mousedown == true){
    place_pixel();
  }
  lastRender = timestamp;

}
var lastRender = 0

function run(){
  setTimeout(function(){
    loop(lastRender);
    requestAnimationFrame(run);
  }, 1000 / fps);
}
run();
