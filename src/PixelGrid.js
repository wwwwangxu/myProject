import React, { Component } from 'react'
// import Dot from './Dot'
import ReactDom from 'react-dom'

function createImageFromArrayBuffer(buf) {
  return new Promise(resolve => {
    var blob = new Blob([buf], {type: 'image/png'})
    var image = new Image()
    var url = URL.createObjectURL(blob)
    image.onload = function() {
      resolve(image)
    }
    image.src = url
  })
}

function getMousePos(e) {
  var layerX = e.layerX
  var layerY = e.layerY
  var zoom = e.target.style.transform.match(/scale\((.*?)\)/)[1]
  return [
    Math.floor(layerX / zoom),
    Math.floor(layerY / zoom),
  ]
}

var boxStyle = {
  border: "1px solid", 
  display: "inline-block", 
  margin: "60px",
  width: "200px",
  height: '200px',
  position: 'relative',
  // overflow: 'hidden'
}
var canvasStyle = {
  display: "block",
}

class PixelGrid extends Component{
  constructor(props) {
    super(props)

    this.canvas = null

    this.socket = this.props.socket

    this.state = {
      zoomLevel: 10,
      dotHoverX: 0,
      dotHoverY: 0,
      isPickingColor: false,
    }
  }

  draw = (row, col, color) => {
    this.ctx.fillStyle = color
    this.ctx.fillRect(row, col, 1, 1)
  }

  setPickColor = () => {
    console.log('正在取色')
    this.setState({
      isPickingColor: true
    })
  }

  setUpZoomHandler = () => {
    this.canvasWrapper.addEventListener('mousewheel', e => {
      var newZoomLevel
      var oldZoomLevel = this.state.zoomLevel
      console.log(e)
      if (e.deltaY < 0) {
        newZoomLevel = this.state.zoomLevel + 1
      } else {
        newZoomLevel = this.state.zoomLevel - 1
      }

      var a = oldZoomLevel
      var b = newZoomLevel

      var mouseX = e.layerX
      var mouseY = e.layerY

      var l1 = parseFloat(this.canvasWrapper.style.left)
      var t1 = parseFloat(this.canvasWrapper.style.top)

      var l2 = l1 - (b / a - 1) * mouseX   //使用transform: scale()
      var t2 = t1 - (b / a - 1) * mouseY
      
      //var l2 = (l1 * a - (b / a - 1) * mouseX) / b  //使用zoom
      //var t2 = (t1 * a - (b / a - 1) * mouseY) / b
      this.canvasWrapper.style.left = l2 + 'px'
      this.canvasWrapper.style.top = t2 + 'px'

      this.setState({
        zoomLevel: newZoomLevel
      })

      e.preventDefault()
    })
  }

  setUpDragHandler = () => {
    var startX, startY
    var startLeft, startTop
    var moveX
    var moveY
    var draging = false
    this.canvasWrapper.addEventListener('mousedown', e => {
      startX = e.clientX
      startY = e.clientY
      startLeft = parseFloat(this.canvasWrapper.style.left)
      startTop = parseFloat(this.canvasWrapper.style.top)
      draging = true
    })

    //定位span小方块的位置
    this.canvas.addEventListener('mousemove', e => {
      var x = Math.floor(e.layerX  / this.state.zoomLevel)
      var y = Math.floor(e.layerY  / this.state.zoomLevel)
      this.setState({
        dotHoverX: x,
        dotHoverY: y
      })
    })

    window.addEventListener('mousemove', e => {
      if (draging) {
        var currentX = e.clientX
        var currentY = e.clientY
        moveX = (currentX - startX)
        moveY = (currentY - startY) 
        this.canvasWrapper.style.left = startLeft + moveX + 'px'
        this.canvasWrapper.style.top = startTop + moveY + 'px'
      }
    })

    window.addEventListener('mouseup', e => {
      draging = false
    })

    this.canvasWrapper.addEventListener('mouseup', e => {
      draging = false
      var moveDistance = Math.sqrt(moveX * moveX + moveY * moveY)
      if (moveDistance < 3 & !this.isPickingColor) {
        this.handleDotClick(e);
      }
      moveX = 0
      moveY = 0;
    })
  }

  //点击一个点实现画点
  handleDotClick = (e) => {
    var layerX = e.layerX
    var layerY = e.layerY
    var row = Math.floor(layerX / this.state.zoomLevel)
    var col = Math.floor(layerY / this.state.zoomLevel)
    console.log(row, col, this.props.currentColor)
    this.socket.emit('draw-dot', {row, col, color: this.props.currentColor})
  }

  //取色功能
  setUpPickColorHandler = () => {
    //取色光标手势实现
    function makeCursor(color) {
      var cursor = document.createElement('canvas')
      var ctx = cursor.getContext('2d');
      cursor.width = 41;
      cursor.height = 41;
  
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.moveTo(0, 6);
      ctx.lineTo(12, 6);
      ctx.moveTo(6, 0);
      ctx.lineTo(6, 12);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.arc(25, 25, 14, 0, 2 * Math.PI, false);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(25, 25, 13.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      
      return cursor.toDataURL()
    }

    //光标在canvas上点击实现取色
    this.canvas.addEventListener('mousemove', e => {
      if (this.state.isPickingColor) {
        var [x, y] = getMousePos(e)
        var pixelColor = Array.from(this.ctx.getImageData(x, y, 1, 1).data).slice(0, 3)
        var pixelColorCSS = 'rgba(' + pixelColor + ')'
        var cursorUrl = makeCursor(pixelColorCSS)
        this.canvas.style.cursor = `url(${cursorUrl}) 6 6, crosshair`

        this.canvas.addEventListener('click', e => {
          var [x, y] = getMousePos(e)
          var pixelColor = Array.from(this.ctx.getImageData(x, y, 1, 1).data).slice(0, 3)
          var hexColor = '#' + pixelColor.map(it => {
            return it.toString(16).padStart(2, '0')
          }).join('')
          this.props.onPickColor(hexColor)
        })
      }
    })
  }

  componentDidMount() {
    this.setUpZoomHandler()
    this.setUpDragHandler()
    this.setUpPickColorHandler()

    this.canvas.style.imageRendering = 'pixelated'
    this.ctx = this.canvas.getContext('2d')

    this.socket.on('initial-pixel-data', async pixelData => {
      var image = await createImageFromArrayBuffer(pixelData)
      this.canvas.width = image.width
      this.canvas.height = image.height
      this.ctx.drawImage(image, 0, 0)
      this.forceUpdate()
      // this.canvas.height = pixelData.length
      // this.canvas.width = pixelData[0].length
      // pixelData.forEach((row, rowIdx) => {
      //   row.forEach((color, colIdx) => {
      //     this.draw(rowIdx, colIdx, color)
      //   })
      // })
    })

    this.socket.on('update-dot', ({row, col, color}) => {
      // console.log(col, row, color)
      this.draw(row, col, color)
    })
  }

  renderPickColorBtn() {
    var el = document.getElementById('color-pick-placeholder')
    if (!el) {
      return null
    } else {
      return ReactDom.createPortal((
        <button onClick = {this.setPickColor}>{this.state.isPickingColor ? "正在取色..." : "取色"}</button>
      ), el)
    }
  }

  render() {
    console.log('pixel grid render')
    return (
      <div style={boxStyle}>
        {this.renderPickColorBtn()}
        <div className="canvas-wrapper" ref={el => this.canvasWrapper = el} style={{
          position: 'absolute',
          top: 0,
          left: 0,  
        }}>
          <span className="dot-hover-box" style={{
            boxShadow: '0 0 1px black',
            width: this.state.zoomLevel + 'px',
            height: this.state.zoomLevel + 'px',
            position: 'absolute',
            left: this.state.dotHoverX * this.state.zoomLevel + 'px',
            top: this.state.dotHoverY * this.state.zoomLevel + 'px',
            pointerEvents: "none",
            zIndex: 5
          }}></span>
          <canvas style={{
            ...canvasStyle, 
            //zoom: this.state.zoomLevel,
            transformOrigin: 'left top',
            transform: 'scale(' + this.state.zoomLevel + ')' 
            }} ref={el => this.canvas = el}>
          </canvas>
        </div>
        
      </div>
      /* <table style={{tableLayout: 'fixed'}}>
        <tbody>
          {
            this.props.pixels.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((color, colIdx) => (
                  //事件处理接收一个箭头函数和接收一个函数名的区别：接收箭头函数可以传参
                  <Dot onClick={this.handleDotClick} row={rowIdx} col={colIdx} key={colIdx} color={color} />
                ))}
              </tr>
            ))
          }
        </tbody>
      </table> */
    )
    
  }
    
}

export default PixelGrid