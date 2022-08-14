import React from "react"

export default class FallingSand extends React.Component {

  render() {

    return (
      <div>
        <table border="1px"
          style={{
            borderWidth: "10px",
            backgroundColor: "#FFFFFF",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "5%",
            width: "640px",
            height: "640px",
            minWidth: "700px",
            boxShadow: "5px 5px 125px 5px #777777"
          }}
        >
          <tbody>
            <tr>
              <td colSpan="3" height="15%">
                <canvas ref={this.myCanvas} width="740" height="640"></canvas>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    )
  }

  constructor(props) {
    super(props)
    this.myCanvas = React.createRef()
  }

  componentDidMount() {
    this.game();
  }

  game = () => {

    var canvas = this.myCanvas.current;
    var ctx = canvas.getContext('2d');


    var Width = 640;
    var Height = 640;
    var fps = 60;
    var grid_size = 60;

    var mouse_x = 0;
    var mouse_y = 0;
    var mousedown = false;
    var eraser = false;
    var brush_size = 2;
    var pixel2d = [];

    var add_red = false;
    var add_green = false;
    var add_blue = false;

    class PixelType {
      static Sand = new PixelType('Sand');
      static Wall = new PixelType('Wall');
      static Water = new PixelType('Water');
      static Fire = new PixelType('Fire');
      static Air = new PixelType('Air');
    }

    var selected_type = PixelType.Sand;

    var color = "";
    var paused = false;

    var in_window_only = false;


    class Pixel {
      constructor(changed, state) {
        this.changed = changed;
        this.exists = 0;
        this.next_state = 0;
        
        var rand_clr = 11 + Math.round((Math.random() * 20) + 1);
        this.color = "#" + rand_clr + "" + "00" + "" + rand_clr;
        this.type = PixelType.Air;
      }

      draw() {

      }

    }

    class Setting_Button {
      constructor(text, x, y) {
        this.Active = false;
        this.b_x = x;
        this.b_y = y;
        this.b_width = 90;
        this.b_height = 30;
        this.text = text;
        this.pressed_count = 0;
        this.button_on = false;
      }

      checkClicked = (click_x, click_y) => {
        var return_v = false;
        if (click_x > this.b_x && click_x < (this.b_x + this.b_width) &&
          click_y > this.b_y && click_y < (this.b_y + this.b_height)) {
          this.pressed_count = 50;
          return_v = true;
        }
        return return_v;
      }

      draw = () => {
        //Draw Rectangles

        if (this.pressed_count > 0) {
          drawRect("#555555", this.b_x + 0.5, this.b_y + 0.5, this.b_width, this.b_height);

          drawRect("#BBBBBB", this.b_x, this.b_y, this.b_width, this.b_height)
        } else {
          if (this.text === PixelType.Water) {
            drawRect("#555599", this.b_x + 0.5, this.b_y + 0.5, this.b_width, this.b_height)
          } else if (this.text === "Eraser") {
            drawRect("#995555", this.b_x + 0.5, this.b_y + 0.5, this.b_width, this.b_height)
          } else {
            drawRect("#555555", this.b_x + 0.5, this.b_y + 0.5, this.b_width, this.b_height)
          }
          drawRect("#BBBBBB", this.b_x - 2, this.b_y - 2, this.b_width, this.b_height)
        }

        //Draw Text
        ctx.fillStyle = "#000000";
        ctx.font = "22px Arial";
        ctx.fillText(this.text, this.b_x + 2, this.b_y + 24);

        if (this.button_on === true) {

          drawRect("#005500", 70 + this.b_x, 7 + this.b_y, 14, 14)

          drawRect("#00FF00", 70 + this.b_x - 1.5, 7 + this.b_y - 1.5, 14, 14)
        }

        if (this.pressed_count > 0) {
          this.pressed_count--;
        }
      }
    }

    var Red_Button = new Setting_Button("Red", 640, 50);
    var Green_Button = new Setting_Button("Green", 640, 100);
    var Blue_Button = new Setting_Button("Blue", 640, 150);

    var Water_Button = new Setting_Button("Water", 640, 220);
    var Fire_Button = new Setting_Button("Fire", 640, 220);
    var Wall_Button = new Setting_Button("Wall", 640, 260);

    var Eraser_Button = new Setting_Button("Eraser", 640, 400);
    var Pause_Button = new Setting_Button("Pause", 640, 450);
    var Clear_Button = new Setting_Button("Clear", 640, 500);


    function drawRect(colorCode, x, y, w, h) {
      ctx.fillStyle = colorCode;
      ctx.fillRect(x, y, w, h);
    }

    //Initialize Pixel Grid
    function initGrid() {
      pixel2d = [];

      var i = 0;
      var j = 0;

      for (i = 0; i < grid_size; i++) {
        pixel2d[i] = [];
      }

      for (i = 0; i < grid_size; i++) {
        for (j = 0; j < grid_size; j++) {
          pixel2d[j][i] = new Pixel(false, 0);
        }
      }
    }

    initGrid()

    drawRect("#999999", 0, 0, 800, 640);
    drawRect("#EEEEEE", 5, 5, Width - 10, Height - 10);

    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

    if (canvas === null) {
      console.log("was null")
    }

    canvas.addEventListener('mousemove', function (evt) {
      if (in_window_only) {
        if (!(mouse_x < Width && mouse_y < Height && mouse_x > 10 && mouse_y > 10)) {
          mousedown = false;
        }
      }
      var mousePos = getMousePos(canvas, evt);
      var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
      mouse_x = mousePos.x;
      mouse_y = mousePos.y;
    }, false);

    canvas.addEventListener('mousedown', function (evt) {
      mousedown = true;

      if (Red_Button.checkClicked(mouse_x, mouse_y)) {
        add_red = !add_red
        Red_Button.button_on = add_red
        selected_type = PixelType.Sand;
        eraser = false;
        return
      }

      else if (Green_Button.checkClicked(mouse_x, mouse_y)) {
        add_green = !add_green
        Green_Button.button_on = add_green
        selected_type = PixelType.Sand;
        eraser = false;
        return
      }

      else if (Blue_Button.checkClicked(mouse_x, mouse_y)) {
        add_blue = !add_blue
        Blue_Button.button_on = add_blue
        selected_type = PixelType.Sand;
        eraser = false;
        return
      }

      else if (Water_Button.checkClicked(mouse_x, mouse_y)) {
        resetColorButtons()
        selected_type = PixelType.Water;
        eraser = false;
        return
      }

      else if (Wall_Button.checkClicked(mouse_x, mouse_y)) {
        resetColorButtons()
        selected_type = PixelType.Wall;
        eraser = false;
        return
      }


      else if (Eraser_Button.checkClicked(mouse_x, mouse_y)) {
        eraser = true;
        return
      }

      else if (Clear_Button.checkClicked(mouse_x, mouse_y)) {
        initGrid()
        return
      }

      else if (Pause_Button.checkClicked(mouse_x, mouse_y)) {
        var BREAK = false;
        if (paused === false) {
          paused = true;
          BREAK = true;
        }
        if (paused === true && BREAK === false) {
          paused = false;
        }

      }

    }, false);

    canvas.addEventListener('mouseup', function (evt) {
      mousedown = false;
    }, false);

    function resetColorButtons() {
      Red_Button.button_on = false;
      Green_Button.button_on = false;
      Blue_Button.button_on = false;
      add_blue = false;
      add_red = false;
      add_green = false;
    }

    function update() { }

    function delete_pixel() {
      if (mouse_x < Width && mouse_y < Height && mouse_x > 1 && mouse_y > 1) {
        var grid_x = Math.round(mouse_x / (640 / grid_size) - 1);
        var grid_y = Math.round(mouse_y / (640 / grid_size) - 1);
        for (var i = 0; i < brush_size; i++) {
          for (var j = 0; j < brush_size; j++) {
            if ((grid_x + brush_size) <= grid_size && (grid_y + brush_size) <= grid_size &&
              grid_x > 0 && grid_y > 0) {
              pixel2d[grid_x + j][grid_y + i].exists = 0;
              pixel2d[grid_x + j][grid_y + i].next_state = 0;
              pixel2d[grid_x + j][grid_y + i].changed = 1;
              pixel2d[grid_x + j][grid_y + i].color = "#EEEEEE";
              pixel2d[grid_x + j][grid_y + i].type = PixelType.Air;
              
            }
          }
        }
      }
    }

    function place_pixel() {
      if (mouse_x < Width && mouse_y < Height && mouse_x > 1 && mouse_y > 1) {
        var grid_x = Math.round(mouse_x / (640 / grid_size) - 1);
        var grid_y = Math.round(mouse_y / (640 / grid_size) - 1);
        for (var i = 0; i < brush_size; i++) {
          for (var j = 0; j < brush_size; j++) {
            if ((grid_x + brush_size) <= grid_size && (grid_y + brush_size) <= grid_size &&
              grid_x > 0 && grid_y > 0) {
              pixel2d[grid_x + j][grid_y + i].type = selected_type;
              pixel2d[grid_x + j][grid_y + i].next_state = 1;
              pixel2d[grid_x + j][grid_y + i].changed = 1;

              var rand_clr = 55 + Math.round((Math.random() * 20) + 1);
              var clr = "#";

              clr = clr + ((add_red) ? rand_clr : "00");
              clr = clr + ((add_green) ? rand_clr : "00");
              clr = clr + ((add_blue) ? rand_clr : "00");

              if (add_red === false && add_green === false && add_blue === false) {
                clr = "#" + rand_clr + "" + rand_clr + "" + rand_clr;
              }

              if (selected_type === PixelType.Water) {
                clr = "#" + (rand_clr + 20).toString(16) + "" + (rand_clr + 20).toString(16) + "" + (rand_clr + 70).toString(16);
              }
              if (selected_type === PixelType.Wall) {
                clr = "#" + (rand_clr - 20).toString(16) + "" + (rand_clr - 20).toString(16) + "" + (rand_clr - 20).toString(16);
              }


              pixel2d[grid_x + j][grid_y + i].color = clr;

            }
          }
        }
      }
    }


    function draw_value_at_cursor() {
      //Draw Text
      if (mouse_x < Width && mouse_y < Height && mouse_x > 10 && mouse_y > 10) {
        var displaytext = "[" + Math.round(mouse_x / (640 / grid_size) - 1) + "][" + Math.round(mouse_y / (640 / grid_size) - 1) + "]: " +
          pixel2d[Math.round(mouse_x / (640 / grid_size) - 1)][Math.round(mouse_y / (640 / grid_size) - 1)].exists;
        ctx.clearRect(640, 590, 100, 60);
        ctx.fillStyle = "#000000";
        ctx.font = "22px Arial";
        ctx.fillText(displaytext, 640, 620);
      }
    }

    function exchange_pixel(base_j, base_i, add_j, add_i) {

      pixel2d[base_j + add_j][base_i + add_i].next_state = 1;
      pixel2d[base_j + add_j][base_i + add_i].changed = true;

      var temp_color = pixel2d[base_j +add_j][base_i +add_i].color
      pixel2d[base_j + add_j][base_i + add_i].color = pixel2d[base_j][base_i].color;
      pixel2d[base_j][base_i].color = temp_color

      var temp_type = pixel2d[base_j + add_j][base_i + add_i].type;
      pixel2d[base_j + add_j][base_i + add_i].type = pixel2d[base_j][base_i].type;
      pixel2d[base_j][base_i].type = temp_type;

      pixel2d[base_j][base_i].changed = true;

      if (pixel2d[base_j][base_i].type === PixelType.Air) {
        pixel2d[base_j][base_i].next_state = 0;
      } else {
        pixel2d[base_j][base_i].next_state = 1;
      }


    }

    function updateGrid() {

      //Check Pixel State Conditions
      for (var i = 0; i < grid_size - 1; i++) {
        for (var j = 0; j < grid_size - 1; j++) {
          if (!paused) {
            if (pixel2d[j][i].exists === 1) {

              if (pixel2d[j][i].type === PixelType.Sand) {
                var rand_stay = Math.round((Math.random() * 70) + 1);
                if (i === grid_size - 2) { } else if ((pixel2d[j][i + 1].exists === 0 && pixel2d[j][i + 1].next_state === 0)  
                || (pixel2d[j][i + 1].type === PixelType.Water && pixel2d[j][i].changed === false) ) {

                  exchange_pixel(j, i, 0, 1);

                } else if ((pixel2d[j + 1][i + 1].exists === 0 && rand_stay > 40 && pixel2d[j + 1][i + 1].next_state === 0) 
                ||  (pixel2d[j + 1][i + 1].type === PixelType.Water && pixel2d[j][i].changed === false) && j !== grid_size - 2) {
  
                  exchange_pixel(j, i, 1, 1);

                } else if (((pixel2d[j - 1][i + 1].exists === 0 && pixel2d[j - 1][i + 1].next_state === 0 && rand_stay > 40) 
                ||  (pixel2d[j -1 ][i + 1].type === PixelType.Water) && pixel2d[j][i].changed === false) && j !== 1) {
   
                  exchange_pixel(j, i, -1, 1);
                }
              }
              else if (pixel2d[j][i].type === PixelType.Water) {
                if (i === grid_size - 2) { } else if (pixel2d[j][i + 1].exists === 0 && pixel2d[j][i + 1].next_state == 0) {

                  exchange_pixel(j, i, 0, 1);
                }

                else {
                  var rand_water = Math.round((Math.random() * 100) + 1);

                  if (pixel2d[j - 1][i].exists === 0 && pixel2d[j - 1][i].next_state === 0 && rand_water >= 50 && j !== 1) {

                    exchange_pixel(j, i, -1, 0);
                  }
                  else if (pixel2d[j + 1][i].exists === 0 && pixel2d[j + 1][i].next_state === 0 && rand_water < 50 && j !== 1) {

                    exchange_pixel(j, i, 1, 0);
                  }
                }
              }
              else if (pixel2d[j][i].type === PixelType.Wall) {

              }
            }
          }
          pixel2d[j][i].exists = pixel2d[j][i].next_state;
        }
      }
    }

    function drawUI() {
      Red_Button.draw();
      Green_Button.draw();
      Blue_Button.draw();
      Eraser_Button.draw();
      Clear_Button.draw();
      Pause_Button.draw();
      Water_Button.draw();
      Wall_Button.draw();
    }

    function drawGrid() {

      for (var i = 1; i < grid_size - 1; i++) {
        for (var j = 1; j < grid_size - 1; j++) {
          if (pixel2d[j][i].exists === 1) {
            drawRect(pixel2d[j][i].color, 0 + (j * (640 / grid_size)), 0 + (i * (640 / grid_size)), (640 / grid_size), (640 / grid_size))
          } else if (pixel2d[j][i].type == PixelType.Air) {
            drawRect("#EEEEEE", 0 + (j * (640 / grid_size)), 0 + (i * (640 / grid_size)), (640 / grid_size), (640 / grid_size))
          }
          pixel2d[j][i].changed = false;
        }
      }
    }

    function loop(timestamp) {

      drawUI()
      updateGrid()
      drawGrid()
      draw_value_at_cursor();

      if (mousedown === true) {
        if (eraser === false) {
          place_pixel();
        } else {
          delete_pixel();
        }
      }
      lastRender = timestamp;

    }
    var lastRender = 0

    function run() {
      setTimeout(function () {
        loop(lastRender);
        requestAnimationFrame(run);
      }, 11);
    }
    run();
  }
}