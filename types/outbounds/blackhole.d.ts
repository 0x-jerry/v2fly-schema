/**
 * Blackhole（黑洞）是一个出站数据协议，它会阻碍所有数据的出站，配合 [路由配置](../routing.md) 一起使用，可以达到禁止访问某些网站的效果。
 **/
export interface Blackhole {
  [key: string]: unknown
}
/**
 * ```json
 * {
 *   "response": {
 *     "type": "none"
 *   }
 * }
 * ```
 **/
export interface OutboundConfigurationObject {
  [key: string]: unknown
  /**
   * 配置黑洞的响应数据。
   * Blackhole 会在收到待转发数据之后，发送指定的响应数据，然后关闭连接，待转发的数据将被丢弃。
   * 如不指定此项，Blackhole 将直接关闭连接。
   **/
  response?: ResponseObject
}
/**
 * ```json
 * {
 *   "type": "none"
 * }
 * ```
 **/
export interface ResponseObject {
  [key: string]: unknown
  /**
   * 当 `type` 为 `"none"`（默认值）时，Blackhole 将直接关闭连接。
   * 当 `type` 为 `"http"` 时，Blackhole 会发回一个简单的 HTTP 403 数据包，然后关闭连接。
   **/
  type?: 'http' | 'none'
}
