import React, { Component } from 'react';
import { Canvas } from "responsive-react-canvas-hoc";

class HelloCanvas extends Component {
  mouse = {
    pos: [0, 0],
    down: false
  }

  points = []

  scaleCursorToCanvas = (canvas, [cursorX, cursorY]) => {
    const rect = canvas.getBoundingClientRect(),
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y
    return [
      Math.round((cursorX - rect.left) * scaleX),
      Math.round((cursorY - rect.top) * scaleY)
    ]
  };

  onPaint = (ctx, canvas) => {
    const { points, mouse } = this;

    // Saving all the points in an array
    points.push({ x: mouse.pos[0], y: mouse.pos[1] });

    if (points.length < 3) {
      var b = points[0];
      ctx.beginPath();
      //ctx.moveTo(b.x, b.y);
      //ctx.lineTo(b.x+50, b.y+50);
      ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
      ctx.fill();
      ctx.closePath();

      return;
    }

    // Tmp canvas is always cleared up before drawing.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (var i = 1; i < points.length - 2; i++) {
      var c = (points[i].x + points[i + 1].x) / 2;
      var d = (points[i].y + points[i + 1].y) / 2;

      ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
    }

    // For the last 2 points
    ctx.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    );
    ctx.stroke();
  };


  init = ({ canvas, ctx, width, height }) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    canvas.addEventListener("mousedown", (e) => {
      this.mouse.down = true;
      ctx.moveTo(this.mouse.pos[0], this.mouse.pos[1])
      this.mouse.pos = this.scaleCursorToCanvas(canvas, [e.pageX, e.pageY]);
      this.points.push({ x: this.mouse.pos[0], y: this.mouse.pos[1] });
      this.onPaint(ctx, canvas)
    })

    canvas.addEventListener("mousemove", (e) => {
      this.mouse.pos = this.scaleCursorToCanvas(canvas, [e.pageX, e.pageY])
      if (this.mouse.down) this.onPaint(ctx, canvas)
    }, false);

    canvas.addEventListener("mouseup", (e) => {
      this.mouse.down = false;
      this.points = [];
    })
  }

  render() {
    const { dimensions } = this.props;
    return (
      <Canvas
        onMount={this.init}
        onResize={this.draw}
        refreshRate={10}
        dimensions={dimensions}
        style={{ margin: "0 auto", border: "1px solid", width: "100%", height: "100%" }}
      />
    )
  }
}

function App() {
  return <HelloCanvas dimensions={{ width: "100vh", height: "100vh" }} />;
}

export default App;