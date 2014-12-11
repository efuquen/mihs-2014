var canvas = null;
var ctx = null;
var moves = [];
var moreMoves = [];
var sprite = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  speed: 1,
  color: '#c00',
  rotate: 0,
  //src: 'http://i.imgur.com/JRtNr5p.png'
  src: 'http://dv00f9dtk4nbg.cloudfront.net/mihs/2014/public/img/space-invader.png'
};
var img;
var stage = 0;
var TO_RADIANS = Math.PI/180;
var running = false;

function drawBoard() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  verticalLines([100, 200, 300, 400, 500, 600, 700], 2);
  horizontalLines([100, 200, 300, 400, 500], 2);
  colorSquare(400, 400, '#c00'); //red
  colorSquare(100, 200, '#0c0'); //blue
  colorSquare(700, 0, '#00c'); //green
 
}

function colorSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 100, 100);
}

function render() {
  drawBoard();
  ctx.save();
  ctx.translate(sprite.x + img.width/2, sprite.y + img.height/2);
  ctx.rotate(sprite.rotate * TO_RADIANS);
  ctx.drawImage(img, -(img.width/2), -(img.height/2));
  ctx.restore();
}

function verticalLines(xs, width) {
  for (i = 0; i < xs.length; i++) { 
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = width;
    ctx.moveTo(xs[i], 0);
    ctx.lineTo(xs[i], 600);
    ctx.stroke();
  }
}

function horizontalLines(ys, width) {
  for (i = 0; i < ys.length; i++) { 
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = width;
    ctx.moveTo(0, ys[i]);
    ctx.lineTo(800, ys[i]);
    ctx.stroke();
  }
}

function doMove(move){
  if(move.pixels && sprite.rotate === 90) {
    sprite.x -= sprite.speed * move.pixels;
    console.log('move left ' + move.pixels);
  } else if(move.pixels && sprite.rotate === 270) {
    sprite.x += sprite.speed * move.pixels;
    console.log('move right ' + move.pixels);
  } else if(move.pixels && sprite.rotate === 180) {
    sprite.y -= sprite.speed * move.pixels;
    console.log('move up ' + move.pixels);
  } else if(move.pixels && sprite.rotate === 0) {
    sprite.y += sprite.speed * move.pixels;
    console.log('move down ' + move.pixels);
  } else if(move.rotate) {
    if(move.rotate > 0 && move.rotate < 360 && move.rotate % 90 === 0) {
        sprite.rotate += move.rotate;
        if(sprite.rotate >= 360) {
            sprite.rotate = sprite.rotate - 360;
        }
        console.log('rotate ' + move.rotate + ' degrees');
    }
  }
}

function win() {
  var wonImg = new Image();
  wonImg.onload = function() {
    ctx.drawImage(wonImg, 0, 0, 800, 600);
  }
  //wonImg.src = 'http://i.imgur.com/6aCWntB.jpg';
  wonImg.src = 'http://dv00f9dtk4nbg.cloudfront.net/mihs/2014/public/img/boss.jpg'
}

function doMoves(moves) {
  if(stage === 3) {
    win();
  } else if(moves.length > 0) {
    var move = moves.shift();
    if(move.wait) {
      console.log('wait ' + move.wait + ' seconds');
      if(sprite.x === 400 && sprite.y === 400 && stage === 0) {
          console.log('Stage 1');
          stage = 1;
      }
      if(sprite.x === 700 && sprite.y === 0 && stage === 1) {
          console.log('Stage 2');
          stage = 2;
      }
      if(sprite.x === 100 && sprite.y === 200 && stage === 2) {
          console.log('Stage 3');
          stage = 3;
      }
      setTimeout(doMoves, move.wait * 1000, moves);
    } else if(move.color) {
      if(move.color === 'blue'){
        colorSquare(sprite.x, sprite.y, '#0c0');
      } else if(move.color === 'green') {
        colorSquare(sprite.x, sprite.y, '#00c');
      } else if(move.color === 'red') {
        colorSquare(sprite.x, sprite.y, '#c00');
      } else if(move.color === 'black') {
        colorSquare(sprite.x, sprite.y, '#000');
      } else {
        colorSquare(sprite.x, sprite.y, move.color);
      }
    } else {
      doMove(move);
      render();
      doMoves(moves);
    }
  } else {
    if(moreMoves.length > 0) {
      doMoves(moreMoves.shift());
    } else {
      running = false;
    }
  }
}

function move(steps) {
    moves.push({pixels: steps * 100});
}

function wait(secs) {
    moves.push({wait: secs});
}

function rotate(degrees) {
    moves.push({rotate: degrees});
}

function turn(degrees) {
    rotate(degrees);
}

function color(cname) {
    moves.push({color: cname});
}

function done() {
  draw();
}

function draw() {
  if(running) {
    moreMoves.push(moves);
  } else {
    running = true;
    doMoves(moves);
  }
  moves = [];
}

function start(greeting) {
  canvas = document.getElementById('canvas');
  canvas.width = 800;
  canvas.height = 600;
  ctx = canvas.getContext('2d');
  img = new Image();
  img.onload = function() {
    render();
    console.log('start');
  }
  img.src = sprite.src;
  if(greeting) {
    setGreeting(greeting);
  } else {
    setGreeting("Have fun playing!");
  }
  wait(2);
}

function setGreeting(greeting) {
  var h3Element = document.getElementById('greeting');
  h3Element.innerHTML = greeting;
}