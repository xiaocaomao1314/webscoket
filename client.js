// WebSocket客户端
const WebSocket = require('ws')
// 连接ws地址
const wss = new WebSocket('ws://127.0.0.1:8090')
// 监听客服端和服务端的连接
wss.on('open',()=>{
  wss.send('发送消息给服务端')
  
})
wss.on('message',(msg)=>{
  console.log(msg)
})