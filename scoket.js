/* 
scoket.io 可以解决低版本浏览器不兼容webSocket 使用长轮询替代
基于engine.io 
engine.io使用webSocket和  XHR封装的一套scoket协议
*/
const app = require('express')()
// 创建服务器
const http = require('http').createServer(app)
// 把socket.io绑到服务器上去监听连接
const io = require('socket.io')(http)
io.on('connection',(socket)=>{
  console.log("监听到了连成成功")
  // 监听客服端给服务端发送消息
  socket.on('sendEvent',(msg)=>{
    console.log(msg)
    socket.send('我是服务端来的')
  })
})
// 网址访问到的时候发送消息
app.get('/',(req,res)=>{
  // res.send('34545')
  res.sendFile(__dirname + '/index.html')
})
http.listen(3010,()=>{
  console.log('冲啊')
})