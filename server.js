// WebSocket服务端
const WebSocket = require('ws')
const app = require('express')()
const http = require('http').createServer(app)
const os = require("os");
const jwt = require('jsonwebtoken');
// 创建一个服务器
const wss = new WebSocket.Server({server:http,clientTracking:true})
// http.on('request', function (request, response) {
//   //    注册 request 请求事件
// //    当客户端请求过来，就会自动触发服务器的 request 请求事件，然后执行第二个参数：回调处理函数
// // request 请求事件处理函数，需要接收两个参数：
// //    Request 请求对象
// //        请求对象可以用来获取客户端的一些请求信息，例如请求路径
// //    Response 响应对象
// //        响应对象可以用来给客户端发送响应消息
//   // http://127.0.0.1:3000/ /
//   // http://127.0.0.1:3000/a /a
//   // http://127.0.0.1:3000/foo/b /foo/b
//   console.log('收到客户端的请求了，请求路径是：' + request.url)
// /*   ------------------------------------------------------------------------------------------- */
//    // text/plain 就是普通文本和资讯文件
//   //  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
//     // 如果你发送的是 html 格式的字符串，则也要告诉浏览器我给你发送是 text/html 格式的内容
//     // res.setHeader('Content-Type', 'text/html; charset=utf-8')
//     //  // 图片就不需要指定编码了，因为我们常说的编码一般指的是：字符编码
//     // res.setHeader('Content-Type', 'image/jpeg')
//     /* ----------------------------------------------------------------------- */
//   // response 对象有一个方法：write 可以用来给客户端发送响应数据
//   // write 可以使用多次，但是最后一定要使用 end 来结束响应，否则客户端会一直等待
//   response.setHeader('Content-Type', 'text/html; charset=utf-8')
//   // response.write('hello')
//   response.write(__dirname +'/client.html')
//   // 告诉客户端，我的话说完了，你可以呈递给用户了
//   response.end()
// })
// 网址访问到的时候发送消息
app.get('/',(req,res)=>{
  // res.send('34545')
  res.sendFile(__dirname + '/client.html')
})
//const wss = new WebSocket.Server({port:8090})
http.listen('6060')
// 存放每个房间人数
let group = {}
// 监听到客户端来的ping信息 更改状态
// function heartbeat() {
//   this.isAlive = true;
// }
// function noop() {}
// 服务器监听connection建立的事件
var buf5 =''
wss.on('connection',(ws,req)=>{
  const token = req.headers['sec-websocket-protocol']
  // buf5.toString()
  console.log(token,buf5.toString(),"江苏省")
  jwt.verify(token , buf5.toString(), (err, authData) => {
    if(err) {
      console.log(err,"失败了")
     return 
      } else{
        console.log("验证成功了")
      }
});
  ws.isAlive=true
  timeSetInterval()
  // 挂载是否激活属性
  // ws.isAlive=true
  // ws.on('pong',heartbeat)
  // ws代表客户端
  //wss.clients代表跟服务端建立连接的客户端数组
  // 建立一次连接后  进行监听发送的消息
  ws.on('message',(msg)=>{
    const msgs = JSON.parse(msg)
    if(msgs.event==="pong"&&msgs.message==="heartbeat"){
      ws.isAlive=true
      console.log("收到了客户端的心跳")
      return
    }
    const  {name,msg:m,room} =msgs
  ws.name=name
  if(room!==undefined){
ws.room=room
if(group[room]===undefined){
  group[room]=1
}else{
  group[room]++
}
  }
    // console.log(msg)
    // console.log(wss.clients,"看看")
    // ws.send(JSON.stringify(wss.clients))
    // 监听到了客服端发送消息到服务端
    // 进行广播给其他的客户端 客户端连接了服务端 ws这条线不一样
    // wss.clients是和服务端有联系的多个客户端
    wss.clients.forEach((client)=> {
      // ws和clinet是同步的 当在ws挂载新的属性 那么client也是同步挂载
      // 判断是否连接以及除了自己的客户端进行广播
      // ws!==client 这是连接的客服端
      // client.readyState === WebSocket.OPEN
      // WebSocket.OPEN 默认值为1 标识客户端和服务端建立连接 
      //  client.readyState建立连接了为1
      // if (ws!==client&&client.readyState === WebSocket.OPEN)
      if (ws!==client&&client.readyState === WebSocket.OPEN&&ws.room===client.room) {
        const o = {
          name,
          msg:m,
          color:'',
          // num:wss.clients.size
          num:group[client.room]
        }
        if(name!==''&&m===''){
        o.msg = '欢迎'+name+'进入聊天室'
      
        }else{
          // 绑定到当前客户端名字
          o.color=name+'：'
        }
        client.send(JSON.stringify(o));
      }else if(ws===client&&client.readyState === WebSocket.OPEN){
        console.log(ws,'---',client)
        if(name!==''&&m===''){
          // 客户端进入房间后就给客户一个token 签名计算而成的
          const user = {
            "jti": 1,
                "iss": name,
                "user":client.room,
          }
          // 进行签名  验证第二个参数
          jwt.sign(user,name,{ expiresIn: '1day' },(err,token) => {
            // 签名成功后发送给客户
          
            // const buf = Buffer.alloc(256);
            buf5 = Buffer.from(name);
            // const len = buf.write();
            
            console.log(token,"签名成功了",buf5,buf5.toString())
            client.send(JSON.stringify({token}));
        })
          const o = {
            // num:wss.clients.size,
            num:group[client.room],
            flag:1
          }
          client.send(JSON.stringify(o));
        }
      }
    });
    });
  // 监听客服端退出聊天室时候
  ws.on('close',(msg)=>{
    // 关闭定时器
    clearInterval(interval);
    group[ws.room]--
    // 就去通知其他客户端
    wss.clients.forEach((client)=> {
      // 判断是否连接以及除了自己的客户端进行广播
      // ws!==client 这是连接的客服端
      // client.readyState === WebSocket.OPEN
      // WebSocket.OPEN 默认值为1 标识客户端和服务端建立连接 
      //  client.readyState建立连接了为1
      if (ws!==client&&client.readyState === WebSocket.OPEN&&ws.room===client.room) {
        const o = {
          name:ws.name,
          msg:ws.name+'退出了聊天室',
          color:'',
          // num:wss.clients.size  wss.clients.size当前连接的客户端总数
          num:group[ws.room]

        }
        console.log(ws.name,"退出",msg)
        client.send(JSON.stringify(o));
        
      }
  })
  
})
})
var interval
function timeSetInterval(){
  interval = setInterval(function (){
    wss.clients.forEach(function each(ws){
    
      // 如果3秒内客户端还没有发消息给我就关闭 一般客户端网络延迟会出现这个问题
    if(ws.isAlive===false){
      group[ws.room]--
      ws.terminate()
      return 
    } 
    ws.isAlive=false
    ws.send(JSON.stringify({
      event:"ping",
      message:"heartbeat"
    }))
    })
    },3000)
}
 
// 定时器就是解决
// ws.terminate()强行关闭
// const interval = setInterval(function ping() {
//   wss.clients.forEach(function each(ws) {
//     // 如果一直没连接到就强制关闭连接 可能是客户退出了聊天室
//     if (ws.isAlive === false) return ws.terminate();
// console.log('服务端发送ping消息')
//     ws.isAlive = false;
//     ws.ping(noop);
//   });
// }, 300);
// /获取本机ip///
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  // console.log(interfaces)
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    if (devName === "WLAN") {
      for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (
          alias.family === "IPv4" &&
          alias.address !== "127.0.0.1" &&
          !alias.internal
        ) {
          return alias.address;
        }
      }
    }
  }
}
// 获取随机颜色
function color16(){//十六进制颜色随机
  var r = Math.floor(Math.random()*256);
  var g = Math.floor(Math.random()*256);
  var b = Math.floor(Math.random()*256);
  var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
  return color;
}
