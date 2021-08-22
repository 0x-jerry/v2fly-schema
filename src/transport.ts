import { HeaderObjectType } from './common'

interface ITcpHttpRequestObject {
  /**
   * HTTP 版本，默认值为 "1.1"。
   */
  version?: string
  /**
   * HTTP 方法，默认值为 "GET"。
   */
  method?: string
  /**
   * 路径，一个字符串数组。默认值为 ["/"]。当有多个值时，每次请求随机选择一个值。
   */
  path?: string[]
  /**
   * HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是一个数组。每次请求会附上所有的键，并随机选择一个对应的值。默认值见上方示例。
   */
  headers?: Record<string, string[]>
}

interface ITcpHttpResponseObject {
  /**
   * HTTP 版本，默认值为 "1.1"。
   */
  version?: string
  /**
   * HTTP 状态，默认值为 "200"。
   */
  status?: string
  /**
   * HTTP 状态说明，默认值为 "OK"。
   */
  reason?: string
  /**
   * HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是一个数组。每次请求会附上所有的键，并随机选择一个对应的值。默认值见上方示例。
   */
  headers?: Record<string, string[]>
}

interface ITcpSettings {
  /**
   * v4.27.1+，仅用于 inbound，是否接收 PROXY protocol，默认值为 false。填写 true 时，最底层 TCP 连接建立后，请求方必须先发送 PROXY protocol v1 或 v2，否则连接会被关闭。
   *
   * PROXY protocol (opens new window)专用于传递请求的真实来源 IP 和端口，若你不了解它，请先忽略该项。常见的反代软件（如 HAProxy、Nginx）都可以配置发送它，VLESS fallbacks xver 也可以发送它。
   */
  acceptProxyProtocol: boolean
  /**
   * 数据包头部伪装设置，默认值为 NoneHeaderObject。HTTP 伪装无法被其它 HTTP 服务器（如 Nginx）分流，但可以被 VLESS fallbacks path 分流。
   */
  header:
    | {
        /**
         * 指定不进行伪装
         */
        type: 'none'
      }
    | ITcpHttpRequestObject
    | ITcpHttpResponseObject
}

interface IKcpSettings {
  /**
   * 最大传输单元（maximum transmission unit），请选择一个介于 576 - 1460 之间的值。默认值为 1350。
   */
  mtu: number
  /**
   * 传输时间间隔（transmission time interval），单位毫秒（ms），mKCP 将以这个时间频率发送数据。请选译一个介于 10 - 100 之间的值。默认值为 50
   */
  tti: number
  /**
   * 上行链路容量，即主机发出数据所用的最大带宽，单位 MB/s，默认值 5。注意是 Byte 而非 bit。可以设置为 0，表示一个非常小的带宽
   */
  uplinkCapacity: number
  /**
   * 下行链路容量，即主机接收数据所用的最大带宽，单位 MB/s，默认值 20。注意是 Byte 而非 bit。可以设置为 0，表示一个非常小的带宽
   */
  downlinkCapacity: number
  /**
   * 是否启用拥塞控制，默认值为 false。开启拥塞控制之后，V2Ray 会自动监测网络质量，当丢包严重时，会自动降低吞吐量；当网络畅通时，也会适当增加吞吐量
   */
  congestion: boolean
  /**
   * 单个连接的读取缓冲区大小，单位是 MB。默认值为 2
   */
  readBufferSize: number
  /**
   * 单个连接的写入缓冲区大小，单位是 MB。默认值为 2
   */
  writeBufferSize: number
  /**
   * 数据包头部伪装设置
   */
  header: {
    /**
     * 伪装类型
     */
    type: HeaderObjectType
  }
  /**
   * v4.24.2+，可选的混淆密码，使用 AES-128-GCM 算法混淆流量数据，客户端和服务端需要保持一致，启用后会输出"NewAEADAESGCMBasedOnSeed Used"到命令行。本混淆机制不能用于保证通信内容的安全，但可能可以对抗部分封锁，在开发者测试环境下开启此设置后没有出现原版未混淆版本的封端口现象。
   */
  seed: string
}

interface IWsSettings {
  /**
   * v4.27.1+，仅用于 inbound，是否接收 PROXY protocol，默认值为 false。填写 true 时，最底层 TCP 连接建立后，请求方必须先发送 PROXY protocol v1 或 v2，否则连接会被关闭。
   *
   * PROXY protocol (opens new window)专用于传递请求的真实来源 IP 和端口，若你不了解它，请先忽略该项。常见的反代软件（如 HAProxy、Nginx）都可以配置发送它，VLESS fallbacks xver 也可以发送它。
   */
  acceptProxyProtocol?: boolean
  /**
   * WebSocket 所使用的 HTTP 协议路径，默认值为 "/"
   */
  path?: string
  /**
   * 自定义 HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是字符串。默认值为空
   */
  headers?: Record<string, string>
}

interface IHttp2Settings {
  /**
   * 一个字符串数组，每一个元素是一个域名。客户端会随机从列表中选出一个域名进行通信，服务器会验证域名是否在列表中
   */
  host: string[]
  /**
   * HTTP 路径，由/开头。客户端和服务器必须一致。可选参数，默认值为"/"
   */
  path: string
}

interface IDsSettings {
  /**
   * 一个合法的文件路径。在运行 V2Ray 之前，这个文件必须不存在
   */
  path: string
  /**
   * 是否为 abstract domain socket，默认 false。
   */
  abstract: boolean
  /**
   * v4.28.1+，abstract domain socket 是否带 padding，默认 false。
   */
  padding: boolean
}

interface IQuicSettings {
  /**
   * 加密方式。默认值为不加密
   */
  security: 'none' | 'aes-128-gcm' | 'chacha20-poly1305'
  /**
   * 加密时所用的密钥。可以是任意字符串。当security不为"none"时有效
   */
  key: string
  /**
   * 数据包头部伪装设置
   */
  header: {
    type: HeaderObjectType
  }
}

/**
 * TransportObject对应配置文件的transport项
 */
export interface IV2rayTransport {
  /**
   * 针对 TCP 连接的配置
   */
  tcpSettings?: ITcpSettings
  /**
   * 针对 KCP 连接的配置
   */
  kcpSettings?: IKcpSettings
  /**
   * 针对 WebSocket 连接的配置
   */
  wsSettings?: IWsSettings
  /**
   * 针对 HTTP/2 连接的配置
   */
  httpSettings?: IHttp2Settings
  /**
   * (V2Ray 4.7+) 针于QUIC 连接的配置
   * QUIC 的配置对应传输配置中的 quicSettings 项。对接的两端的配置必须完全一致，否则连接失败。QUIC 强制要求开启 TLS，在传输配置中没有开启 TLS 时，V2Ray 会自行签发一个证书进行 TLS 通讯。在使用 QUIC 传输时，可以关闭 VMess 的加密
   */
  quicSettings?: IQuicSettings
  /**
   * 针于Domain Socket 连接的配置
   */
  dsSettings?: IDsSettings
}
