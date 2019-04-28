import React, { Component } from 'react'
import Dot from './Dot'

function PixelGrid(props) {
  if (!props.pixels) {
    return null
  } else {
    return (
      <table style={{tableLayout: 'fixed'}}>
        <tbody>
          {
            props.pixels.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((color, colIdx) => (
                  //事件处理接收一个箭头函数和接收一个函数名的区别：接收箭头函数可以传参
                  <Dot onClick={() => props.onPixelClick(rowIdx, colIdx)} key={colIdx} color={color} />
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    )
  }
}

export default PixelGrid