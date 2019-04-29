import React, { Component } from 'react'
// import Dot from './Dot'


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

class PixelGrid extends Component{
  constructor(props) {
    super(props)

    this.canvas = null

    this.socket = this.props.socket
  }

  componentDidMount() {
    this.canvas.style.imageRendering = 'pixelated'
    this.ctx = this.canvas.getContext('2d')

    this.socket.on('initial-pixel-data', async pixelData => {
      var image = await createImageFromArrayBuffer(pixelData)
      // debugger
      this.canvas.width = image.width
      this.canvas.height = image.height
      this.ctx.drawImage(image, 0, 0)
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

  draw = (row, col, color) => {
    this.ctx.fillStyle = color
    this.ctx.fillRect(row, col, 1, 1)
  }

  handleDotClick = (e) => {
    var layerX = e.nativeEvent.layerX
    var layerY = e.nativeEvent.layerY
    var row = Math.floor(layerX / 15)
    var col = Math.floor(layerY / 15)
    // console.log(row, col, this.props.currentColor)
    this.socket.emit('draw-dot', {row, col, color: this.props.currentColor})
  }

  render() {
    console.log('pixel grid render')
    return (
      <div>
        <canvas onClick={this.handleDotClick} style={{zoom: 15}} ref={el => this.canvas = el}></canvas>
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