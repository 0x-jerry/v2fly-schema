/**
  `BrowserForwarderObject` 对应配置文件的 `browserForwarder` 项。 (4.37.0+)
```json
{
    "listenAddr": "127.0.0.1",
    "listenPort": 8080
}
```
 **/
export interface BrowserForwarderObject {
/**
浏览器转发页面的本地监听地址。
**/
listenAddr: string
/**
浏览器转发页面的本地监听端口。
浏览器转发程序利用浏览器的内构功能转发连接到对应的服务器，避免 V2Ray 直接建立到远程的 TLS 连接，减少了可供识别的特征。
在使用时，需要打开浏览器访问相应的网页服务器以便使用转发功能。
应该在资源文件夹放置转发页面和脚本的文件夹，这个内容必须随 V2Ray 本体同时更新，且和发布的内容一致。V2Ray 不会向浏览器发送无法识别的转发页面和脚本。
此资源数据在二进制分发版本中位于可选的 extra 包 (v2ray-extra.zip) 中。
**/
listenPort: number
}