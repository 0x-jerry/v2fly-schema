import { ICertificateObject } from './common'
import { IV2rayTransport } from './transport'

interface ITlsSetting {
  /**
   * 指定服务器端证书的域名，在连接由 IP 建立时有用。当目标连接由域名指定时，比如在 Socks 入站时接收到了域名，或者由 Sniffing 功能探测出了域名，这个域名会自动用于 serverName，无须手动配置。
   */
  serverName?: string
  /**
   * 是否允许不安全连接（仅用于客户端）。默认值为 false。当值为 true 时，V2Ray 不会检查远端主机所提供的 TLS 证书的有效性。
   */
  allowInsecure?: boolean
  /**
   * 一个字符串数组，指定了 TLS 握手时指定的 ALPN 数值。默认值为 ["h2", "http/1.1"]。
   */
  alpn?: string[]
  /**
   * 证书列表，其中每一项表示一个证书（建议 fullchain）。
   */
  certificates?: ICertificateObject[]
  /**
   * （V2Ray 4.18+）是否禁用操作系统自带的 CA 证书。默认值为 false。当值为 true 时，V2Ray 只会使用 certificates 中指定的证书进行 TLS 握手。当值为 false 时，V2Ray 只会使用操作系统自带的 CA 证书进行 TLS 握手。
   */
  disableSystemRoot?: boolean
}

interface ISockoptObject {
  /**
   * 一个整数。当其值非零时，在出站连接上标记 SO_MARK。
   *
   * 仅适用于 Linux 系统。
   *
   * 需要 CAP_NET_ADMIN 权限。
   */
  mark?: number
  /**
   * 是否启用 TCP Fast Open (opens new window)。当其值为 true 时，强制开启 TFO；当其值为 false 时，强制关闭 TFO；当此项不存在时，使用系统默认设置。可用于入站出站连接。
   *
   * 仅在以下版本（或更新版本）的操作系统中可用:
   * - Windows 10 (1604)
   * - Mac OS 10.11 / iOS 9
   * - Linux 3.16：系统已默认开启，无需配置。
   */
  tcpFastOpen?: boolean
  /**
   * 是否开启透明代理（仅适用于 Linux）。
   *
   * - "redirect"：使用 Redirect 模式的透明代理。仅支持 TCP/IPv4 和 UDP 连接。
   * - "tproxy"：使用 TProxy 模式的透明代理。支持 TCP 和 UDP 连接。
   * - "off"：关闭透明代理。
   *
   * 透明代理需要 Root 或 CAP_NET_ADMIN 权限。
   */
  tproxy?: 'redirect' | 'tproxy' | 'off'
}

export interface IV2rayStreamSetting extends IV2rayTransport {
  /**
   * 数据流所使用的网络类型，默认值为 "tcp"
   */
  network?: 'tcp' | 'kcp' | 'ws' | 'http' | 'domainsocket' | 'quic'
  /**
   * 是否启入传输层加密，支持的选项有 "none" 表示不加密（默认值），"tls" 表示使用 TLS
   */
  security?: 'none' | 'tls'
  /**
   * TLS 配置。TLS 由 Golang 提供，支持 TLS 1.3，不支持 DTLS。
   */
  tlsSettings?: ITlsSetting
  /**
   * 连接选项
   */
  sockopt?: ISockoptObject
}
