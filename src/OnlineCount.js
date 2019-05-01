import React, {useState} from 'react'

function useOnlineCount(socket) {
  let [count, setCount] = useState(0)
  console.log(count)
  socket.on('online-count', setCount)
  console.log(count)
  return count
}

function OnlineCount({socket}) {
  // console.log(socket)
  let count = useOnlineCount(socket)

  return <div style={{
    marginTop: '-50px'
  }}>在线人数：{count}</div>
}

export default OnlineCount