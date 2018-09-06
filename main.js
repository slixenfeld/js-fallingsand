
//Variablen
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


var Width = 640;
var Height = 640;
var fps = 80;
var grid_size = 40;

var mouse_x = 0;
var mouse_y = 0;
var mousedown = false;
var eraser = false;
var brush_size = 2;
var pixel2d = [];

var add_red = false;
var add_green = false;
var add_blue = false;

var selected_type = "sand";
var active_color = "red";
var paused = false;

var in_window_only = false;


ctx.clearRect(0,0,Width,Height);
ctx.fillStyle = "#888888"; ctx.fillRect(0,0,Width,Height);
ctx.fillStyle = "#EEEEEE"; ctx.fillRect(5,5,Width-10,Height-10);

function Pixel(changed,state){
  this.changed = changed;
  this.state = 0;
  this.next_state = 0;

  var rand_clr = 11 + Math.round((Math.random() * 20)+1);
  this.color = "#" + rand_clr + ""+ "00" + "" + rand_clr;
  this.type = "sand";

}

function Setting_Button(text,b_x,b_y){
  this.Active = false;
  this.b_x = b_x;
  this.b_y = b_y;
  this.b_width = 90;
  this.b_height = 30;
  this.text = text;
  this.pressed_count = 0;
  this.button_on = false;
}

Setting_Button.prototype.checkClicked=function(click_x,click_y){
  var return_v = false;
  if(click_x > this.b_x && click_x < (this.b_x+this.b_width) &&
     click_y > this.b_y && click_y < (this.b_y+this.b_height) ){this.pressed_count=50;  return_v = true;}
  return return_v;
}

Setting_Button.prototype.draw = function(){
//Draw Rectangles

  if(this.pressed_count>0){
    ctx.fillStyle = "#555555"; ctx.fillRect(this.b_x+0.5,this.b_y+0.5,this.b_width,this.b_height);
    ctx.fillStyle = "#BBBBBB"; ctx.fillRect(this.b_x,this.b_y,this.b_width,this.b_height);
  }else{

    if(this.text=="Water"){
      ctx.fillStyle = "#555599"; ctx.fillRect(this.b_x+0.5,this.b_y+0.5,this.b_width,this.b_height);
    }else{
      ctx.fillStyle = "#555555"; ctx.fillRect(this.b_x+0.5,this.b_y+0.5,this.b_width,this.b_height);
    }
    ctx.fillStyle = "#BBBBBB"; ctx.fillRect(this.b_x-2,this.b_y-2,this.b_width,this.b_height);
  }

//Draw Text
  ctx.fillStyle = "#000000"; ctx.font = "22px Arial";
  ctx.fillText(this.text,this.b_x+2,this.b_y+24);

  if(this.button_on == true){
    ctx.fillStyle = "#005500"; ctx.fillRect(70+this.b_x,7+this.b_y,14,14);
    ctx.fillStyle = "#00FF00"; ctx.fillRect(70+this.b_x-1.5,7+this.b_y-1.5,14,14);

  }

  if(this.pressed_count>0){this.pressed_count--;}


}

var Red_Button = new Setting_Button("Rot",640,50);
var Green_Button = new Setting_Button("Green",640,100);
var Blue_Button = new Setting_Button("Blue",640,150);

var Water_Button = new Setting_Button("Water",640,220);

var Eraser_Button = new Setting_Button("Eraser",640,400);
var Pause_Button = new Setting_Button("Pause",640,450);





//Initialize Pixel Grid
for(var i = 0; i < grid_size; i++){pixel2d[i] = [];}
for(var i = 0; i < grid_size; i++){
  for(var j = 0; j < grid_size; j++){
    pixel2d[j][i] = new Pixel(false,0);
  }
}



ctx.fillStyle = "#999999";
ctx.fillRect(0,0,800,640);
ctx.fillStyle = "#EEEEEE";
ctx.fillRect(5,5,Width-10,Height-10);

//      Mouse Functions       //

function getMousePos(canvas,evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top};
}

canvas.addEventListener('mousemove',function(evt){
  if(in_window_only){
    if(!(mouse_x<Width&&mouse_y<Height&&mouse_x>10&&mouse_y>10)){mousedown=false;}
  }
  var mousePos = getMousePos(canvas, evt);
  var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
  mouse_x = mousePos.x;
  mouse_y = mousePos.y;
},false);

canvas.addEventListener('mousedown',function(evt){mousedown = true;
    if(Red_Button.checkClicked(mouse_x,mouse_y)){
      var BREAK = false;
      if(add_red==false){ add_red = true; BREAK = true; Red_Button.button_on = true; }
      if(add_red==true&&BREAK==false){ add_red = false; Red_Button.button_on = false; }
      active_color = "red";
      selected_type = "sand";
      eraser = false;
    }
    if(Green_Button.checkClicked(mouse_x,mouse_y)){
      var BREAK = false;
      if(add_green==false){ add_green = true; BREAK = true; Green_Button.button_on = true;}
      if(add_green==true&&BREAK==false){ add_green = false; Green_Button.button_on = false; }
      active_color = "green";
      selected_type = "sand";
      eraser = false;
    }
    if(Blue_Button.checkClicked(mouse_x,mouse_y)){
      var BREAK = false;
      if(add_blue==false){ add_blue = true; BREAK = true; Blue_Button.button_on = true;}
      if(add_blue==true&&BREAK==false){ add_blue = false; Blue_Button.button_on = false; }
      active_color = "blue";
      selected_type = "sand";
      eraser = false;
    }
    if(Water_Button.checkClicked(mouse_x,mouse_y)){

      Red_Button.button_on = false;
      Green_Button.button_on = false;
      Blue_Button.button_on = false;
      selected_type = "water";
      eraser = false;
    }


    if(Eraser_Button.checkClicked(mouse_x,mouse_y)){
      eraser = true;
    }
    if(Pause_Button.checkClicked(mouse_x,mouse_y)){
      var BREAK = false;
      if(paused==false){ paused = true; BREAK = true; }
      if(paused==true&&BREAK==false){ paused = false;  }

    }

},false);

canvas.addEventListener('mouseup',function(evt){
  mousedown=false;
},false);

function update(){
}

function delete_pixel(){
  if(mouse_x<Width&&mouse_y<Height&&mouse_x>1&&mouse_y>1){
    var grid_x = Math.round(mouse_x/(640/grid_size)-1);
    var grid_y = Math.round(mouse_y/(640/grid_size)-1);
    for(var i = 0; i < brush_size; i++){
      for(var j = 0; j < brush_size; j++){
        if((grid_x+brush_size)<=grid_size&&(grid_y+brush_size)<=grid_size
          &&grid_x>0&&grid_y>0){
          pixel2d[grid_x+j][grid_y+i].state = 0;
          pixel2d[grid_x+j][grid_y+i].next_state = 0;
          pixel2d[grid_x+j][grid_y+i].changed = 1;
          pixel2d[grid_x+j][grid_y+i].color = "#EEEEEE";
        }
      }
    }
  }
}

function place_pixel(){
  if(mouse_x<Width&&mouse_y<Height&&mouse_x>1&&mouse_y>1){
    var grid_x = Math.round(mouse_x/(640/grid_size)-1);
    var grid_y = Math.round(mouse_y/(640/grid_size)-1);
    for(var i = 0; i < brush_size; i++){
      for(var j = 0; j < brush_size; j++){
        if((grid_x+brush_size)<=grid_size&&(grid_y+brush_size)<=grid_size
          &&grid_x>0&&grid_y>0){
          pixel2d[grid_x+j][grid_y+i].type = selected_type;
          pixel2d[grid_x+j][grid_y+i].next_state = 1;
          pixel2d[grid_x+j][grid_y+i].changed = 1;

          var rand_clr = 55 + Math.round((Math.random() * 20)+1);
          var clr = "#";

          if(add_red){clr += rand_clr;}else{clr += "00";}
          if(add_green){clr += rand_clr;}else{clr += "00";}
          if(add_blue){clr += rand_clr;}else{clr += "00";}
          if(add_red==false&&add_green==false&&add_blue==false){clr="#"+rand_clr+""+rand_clr+""+rand_clr; }

          if(selected_type == "water"){
            clr="#"+(rand_clr+20).toString(16)+""+(rand_clr+20).toString(16)+""+(rand_clr+70).toString(16);
          }

          pixel2d[grid_x+j][grid_y+i].color = clr;

        }
      }
    }
  }
}


function draw_value_at_cursor() {
  //Draw Text
  if(mouse_x<Width&&mouse_y<Height&&mouse_x>10&&mouse_y>10){
    var displaytext = "["+Math.round(mouse_x/(640/grid_size)-1)+ "]["+Math.round(mouse_y/(640/grid_size)-1)+"]: " +
            pixel2d[Math.round(mouse_x/(640/grid_size)-1)][Math.round(mouse_y/(640/grid_size)-1)].state;
    ctx.clearRect(640,590,100,60);
    ctx.fillStyle = "#000000"; ctx.font = "22px Arial";
    ctx.fillText(displaytext,640,620);
  }
}


function draw_grid(){

  Red_Button.draw();
  Green_Button.draw();
  Blue_Button.draw();
  Eraser_Button.draw();
  Pause_Button.draw();
  Water_Button.draw();


function exchange_pixel(base_j,base_i,add_j,add_i){
  pixel2d[base_j+add_j][base_i+add_i].next_state = 1;
  pixel2d[base_j+add_j][base_i+add_i].changed = true;
  pixel2d[base_j+add_j][base_i+add_i].color = pixel2d[j][i].color;

  var temp_type = pixel2d[j+add_j][i+add_i].type;
  pixel2d[base_j+add_j][base_i+add_i].type = pixel2d[base_j][base_i].type;
  pixel2d[base_j][base_i].type = temp_type;

  pixel2d[base_j][base_i].next_state = 0;
  pixel2d[base_j][base_i].changed = true;
  pixel2d[base_j][base_i].color = "#EEEEEE";
}

//Check Pixel State Conditions
  for(var i = 0 ; i < grid_size-1; i++){
    for(var j = 0; j < grid_size-1; j++){
      if(!paused){
        if(pixel2d[j][i].state == 1){

          if(pixel2d[j][i].type == "sand"){
            var rand_stay =Math.round((Math.random() * 70)+1);
            if(i == grid_size-2){
            }
            else if(pixel2d[j][i+1].state == 0 && pixel2d[j][i+1].next_state == 0){

            //Space down free
            exchange_pixel(j,i,0,1);

            }
            else if (pixel2d[j+1][i+1].state == 0 && rand_stay > 40 && pixel2d[j+1][i+1].next_state == 0  && j != grid_size-2) {

            //Space right down free
            exchange_pixel(j,i,1,1);

            }
            else if (pixel2d[j-1][i+1].state == 0 && pixel2d[j-1][i+1].next_state == 0  && rand_stay > 40 && j != 1) {

            //Space left down free
            exchange_pixel(j,i,-1,1);

            }//Else if free space
          }//Type


          else if (pixel2d[j][i].type == "water"){
            
            if(i == grid_size-2){
            }
            else if(pixel2d[j][i+1].state == 0 && pixel2d[j][i+1].next_state == 0){

            //Space down free
            exchange_pixel(j,i,0,1);

            }
            else if (pixel2d[j+1][i+1].state == 0 && pixel2d[j+1][i+1].next_state == 0  && j != grid_size-2) {

            //Space right down free
            exchange_pixel(j,i,1,1);

            }
            else if (pixel2d[j-1][i+1].state == 0 && pixel2d[j-1][i+1].next_state == 0 && j != 1) {

            //Space left down free
            exchange_pixel(j,i,-1,1);

            }//Else if free space
            else{

            var rand_water = Math.round((Math.random() * 100)+1);

            if (pixel2d[j-1][i].state == 0 && pixel2d[j-1][i].next_state == 0 && rand_water >= 50 && j != 1) {

            //Space left free
            exchange_pixel(j,i,-1,0);

            }//Else if free space
            else if (pixel2d[j+1][i].state == 0 && pixel2d[j+1][i].next_state == 0 && rand_water < 50 && j != 1) {

            //Space right free
            exchange_pixel(j,i,1,0);

            }//Else if free space

          }
          }//Type

        }//State==1
      }//paused
    }//Loop X
  }//LoopY

//Apply And Draw
  for(var i = 1 ; i < grid_size-1; i++){
    for(var j = 1; j < grid_size-1; j++){
     // if(pixel2d[j][i].changed == true){
        pixel2d[j][i].state = pixel2d[j][i].next_state;
        if(pixel2d[j][i].state == 1){

            color = pixel2d[j][i].color;

          ctx.fillStyle = color; ctx.fillRect(0+(j*(640/grid_size)),0+(i*(640/grid_size)),(640/grid_size),(640/grid_size));
        }else{
          ctx.fillStyle = "#EEEEEE"; ctx.fillRect(0+(j*(640/grid_size)),0+(i*(640/grid_size)),(640/grid_size),(640/grid_size));
        }
        //No Change now
        pixel2d[j][i].changed=false;
      //}
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
  draw_value_at_cursor();
  if(mousedown == true){
    if(eraser == false){
      place_pixel();
    }
    else{
      delete_pixel();
    }
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
