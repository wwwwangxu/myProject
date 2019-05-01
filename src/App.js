import React, { Component } from 'react';
import io from 'socket.io-client'
import './App.css';

import {produce} from 'immer'

import PixelGrid from "./PixelGrid"
import ColorSelect from './ColorSelect'
import OnlineCount from './OnlineCount'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentColor: '#ffffff',
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h1 style={{textAlign: 'center'}}>Pixel Painter</h1> 
        <PixelGrid onPickColor={this.changeCurrentColor} socket={this.socket} currentColor={this.state.currentColor} />
        <span style={{display: 'block', marginLeft: '200px'}} id='color-pick-placeholder'></span>
        <ColorSelect onChange={this.changeCurrentColor} color={ this.state.currentColor } />
        <OnlineCount socket={this.socket} />
      </div>
    )
  }
}


export default App;
