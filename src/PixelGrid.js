import React, { Component } from 'react'
import Dot from './Dot'

class PixelGrid extends Component{
  constructor(props) {
    super(props)
  }

  handleDotClick = (row, col) => {
    this.props.onPixelClick(row, col)
  }

  render() {
    if (!this.props.pixels) {
      return null
    } else {
      return (
        <table style={{tableLayout: 'fixed'}}>
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
        </table>
      )
    }
  }
    
}

export default PixelGrid