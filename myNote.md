1 心跳检测
服务端会定时去检测下客户端和服务端是否健康连接
服务端pong 监听客服端发送的 ping消息
ws.terminate();  强制关闭连接

2 鉴权 通信的形式
客户端进行发送鉴权 
发送鉴权的token 记录token的过期时间
 客户端连接成功发送后主动发送出去 主动鉴权

服务端鉴权token的时效性和有效性
 jsonwebtoken
 jwt.io

重连
npm i reconnectingwebsocket
ReconnectingWebSocket('ws://...')