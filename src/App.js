import React, { Component } from 'react';
import io from 'socket.io-client'
import './App.css';

import {produce} from 'immer'

import PixelGrid from "./PixelGrid"
import ColorSelect from './ColorSelect'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentColor: 'red',
      pixelData: null
    }
    
    this.socket = io('ws://localhost:3005/')
    // this.socket = io('ws://10.0.0.114:3005/')
  }
  //发送网络请求和设置定时器应在componentDidMount阶段完成
  //因为此时Dom已渲染完成，可保证数据的正确加载
  componentDidMount() {
    // this.socket.on('initial-pixel-data', (data) => {
    //   console.log(data)
    //   this.setState({
    //     pixelData: data
    //   })
    // })

    // this.socket.on('updata-dot', info => {
    //   //使用不可变数据结构
    //   this.setState(produce(this.state, state => {
    //     state.pixelData[info.row][info.col] = info.color
    //   }))
    // })

    // this.socket.on('updata-dot', info => {
    //   this.setState({
    //     pixelData: this.state.pixelData.map((row, rowIdx) => {
    //       if (rowIdx === info.row) {
    //         return row.map((color, colIdx) => {
    //           if (colIdx === info.col) {
    //             return info.color
    //           } else {
    //             return color
    //           }
    //         })
    //       } else {
    //         return row
    //       }
    //     })
    //   })
    // })
  }

  
  handlePixelClick = (row, col) => {
    /*将被点击的dot的信息告知服务器*/
    // this.socket.emit('draw-dot', {
    //   row, 
    //   col,
    //   color: this.state.currentColor
    // })
  }

  changeCurrentColor = (color) => {
    console.log(color)
    this.setState({
      currentColor: color
    })
  }

  render() {
    return (
      <div>
        <h1>Pixel Painter</h1> 
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Moi accusamus incidunt modi iste fugiat eligendi assumenda aliquid laborum, recusandae deserunt omnis commodi, aperiam nobis.</p> 
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Moi accusamus incidunt modi iste fugiat eligendi assumenda aliquid laborum, recusandae deserunt omnis commodi, aperiam nobis.</p> 
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Moi accusamus incidunt modi iste fugiat eligendi assumenda aliquid laborum, recusandae deserunt omnis commodi, aperiam nobis.</p> 
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Moi accusamus incidunt modi iste fugiat eligendi assumenda aliquid laborum, recusandae deserunt omnis commodi, aperiam nobis.</p> 
        <PixelGrid onPixelClick={this.handlePixelClick} socket={this.socket} currentColor={this.state.currentColor} />
        <ColorSelect onChange={this.changeCurrentColor} color={ this.state.currentColor } />
      </div>
    )
  }
}


export default App;
