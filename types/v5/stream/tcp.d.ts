/**
  tcp.stream
 **/
export interface TCP {
  [key: string]: any
/**
仅用于入站，是否接收 Proxy Protocol，默认值为 `false`。该值为 `true` 时，底层 TCP 连接建立后，请求方必须先发送 Proxy Protocol，否则连接将被关闭。
**/
acceptProxyProtocol?: true | false
}