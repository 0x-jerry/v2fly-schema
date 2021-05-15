import {
  IHttpAccountObject,
  ISocksAccountObject,
  IVmessServerAccountObject,
  ShadowSocksMethod,
  V2RayProtocol,
} from './common'
import { IV2rayStreamSetting } from './stream'

interface IV2rayOutboundSetting<Protocol extends V2RayProtocol, Setting> {
  protocol?: Protocol
  /**
   * 具体的配置内容，视协议不同而不同
   */
  settings?: Setting

  /**
   * 用于发送数据的 IP 地址，当主机有多个 IP 地址时有效，默认值为"0.0.0.0"
   */
  sendThrough?: string
  /**
   * 此出站连接的标识，用于在其它的配置中定位此连接。当其值不为空时，必须在所有 tag 中唯一
   */
  tag?: string
  /**
   * 底层传输配置
   */
  streamSettings?: IV2rayStreamSetting
  /**
   * 出站代理配置。当出站代理生效时，此出站协议的streamSettings将不起作用
   */
  proxySettings?: {
    /**
     * 当指定另一个出站协议的标识时，此出站协议发出的数据，将被转发至所指定的出站协议发出
     */
    tag?: string
    [k: string]: any
  }
  /**
   * Mux 配置，Mux 功能是在一条 TCP 连接上分发多个 TCP 连接的数据
   */
  mux?: {
    /**
     * 是否启用 Mux
     */
    enabled?: boolean
    /**
     * 最大并发连接数。最小值1，最大值1024，默认值8。这个数值表示了一个 TCP 连接上最多承载的 Mux 连接数量。当客户端发出了 8 个 TCP 请求，而concurrency=8时，V2Ray 只会发出一条实际的 TCP 连接，客户端的 8 个请求全部由这个 TCP 连接传输
     */
    concurrency?: number
  }
}

interface IBlackholeOutboundSettings {
  /**
   * 配置黑洞的响应数据。Blackhole 会在收到待转发数据之后，发送指定的响应数据，然后关闭连接。待转发的数据将被丢弃。如不指定此项，Blackhole 将直接关闭连接
   */
  response?: {
    /**
     * type为"none"（默认值）时，Blackhole将直接关闭连接。当type为"http"时，Blackhole会发回一个简单的 HTTP 403 数据包，然后关闭连接
     */
    type?: 'http' | 'none'
  }
}

interface IDNSOutboundSettings {
  /**
   * (V2Ray 4.16+) 修改 DNS 流量的传输层协议，可选的值有"tcp"和"udp"。当不指定时，保持来源的传输方式不变
   */
  network?: 'tcp' | 'udp'
  /**
   * (V2Ray 4.16+) 修改 DNS 服务器地址。当不指定时，保持来源中指定的地址不变
   */
  address?: string
  /**
   * (V2Ray 4.16+) 修改 DNS 服务器端口。当不指定时，保持来源中指定的端口不变
   */
  port?: number
}

interface IFreedomOutboundSettings {
  /**
   * 在目标地址为域名时，Freedom 可以直接向此域名发出连接（"AsIs"），或者将域名解析为 IP 之后再建立连接（"UseIP"、"UseIPv4"、"UseIPv6"）。解析 IP 的步骤会使用 V2Ray 内建的 DNS。默认值为"AsIs"
   * (V2Ray 4.6+) 当使用"UseIP"模式，并且出站连接配置中指定了sendThrough时，Freedom 会根据sendThrough的值自动判断所需的IP类型，IPv4 或 IPv6
   * (V2Ray 4.7+) 当使用"UseIPv4"或"UseIPv6"模式时，Freedom 会只使用对应的 IPv4 或 IPv6 地址。当sendThrough指定了不匹配的本地地址时，将导致连接失败
   */
  domainStrategy?: 'AsIs' | 'UseIP' | 'UseIPv4' | 'UseIPv6'
  /**
   * Freedom 会强制将所有数据发送到指定地址（而不是入站协议指定的地址）。其值为一个字符串，样例："127.0.0.1:80", ":1234"。当地址不指定时，如":443"，Freedom 不会修改原先的目标地址。当端口为0时，如"v2ray.com:0"，Freedom 不会修改原先的端口
   */
  redirect?: string
  /**
   * 用户等级，所有连接都使用这一等级
   */
  userLevel?: string
}

interface IMTProtoOutboundSettings {}

interface IShadowSocksServer {
  /**
   * 邮件地址，可选，用于标识用户
   */
  email?: string
  /**
   * Shadowsocks 服务器地址，支持 IPv4、IPv6 和域名。必填
   */
  address: string
  /**
   * Shadowsocks 服务器端口。必填
   */
  port: number | string
  /**
   * 必填。可选的值见加密方式列表
   */
  method: ShadowSocksMethod
  /**
   * 必填。任意字符串。Shadowsocks 协议不限制密码长度，但短密码会更可能被破解，建议使用 16 字符或更长的密码
   */
  password: string
  /**
   * 是否开启 Shadowsocks 的一次验证（One time auth），默认值为false
   */
  ota?: boolean
  /**
   * 用户等级
   */
  level?: number
}

interface IShadowsocksOutboundSettings {
  /**
   * 一个数组，其中每一项是一个 ServerObject
   */
  servers?: IShadowSocksServer[]
}

interface ISocksServer {
  /**
   * 服务器地址，仅支持连接到 Socks 5 服务器
   */
  address?: string
  /**
   * 服务器端口
   */
  port?: number
  /**
   * 用户列表，其中每一项一个用户配置。当列表不为空时，Socks 客户端会使用此用户信息进行认证；如未指定，则不进行认证
   */
  users?: ISocksAccountObject[]
}

interface ISocksOutboundSettings {
  /**
   * Socks 服务器列表，其中每一项是一个服务器配置
   */
  servers?: ISocksServer[]
  [k: string]: any
}

interface IVmessServer {
  /**
   * 服务器地址，支持 IP 地址或者域名
   */
  address?: string
  /**
   * 服务器端口号
   */
  port?: number
  /**
   * 一组服务器认可的用户
   */
  users?: IVmessServerAccountObject[]
}

interface IVmessOutboundSettings {
  /**
   * 一个数组，包含一系列的服务器配置
   */
  vnext?: IVmessServer[]
}

interface ITrojanServer {
  /**
   * 服务器地址，支持 IPv4、IPv6 和域名。必填。
   */
  address: string
  /**
   * 服务器端口，必填。
   */
  port: number
  /**
   * 必填，任意字符串。
   */
  password: string
  /**
   * 邮件地址，可选，用于标识用户
   */
  email: string
  /**
   * 用户等级
   */
  level: number
}

interface ITrojanOutboundSettings {
  /**
   * 一个数组，其中每一项是一个 ServerObject。
   */
  servers: ITrojanServer[]
}

interface IVLESSServerAccountObject {
  /**
   * VLESS 的用户 ID，必须是一个合法的 UUID，你可以用 在线工具 生成它。
   */
  id: string
  /**
   * 现阶段需要填 "none"，不能留空。该要求是为了提醒使用者没有加密，也为了以后出加密方式时，防止使用者填错属性名或填错位置导致裸奔。
   *
   * 若未正确设置 encryption 的值，使用 v2ray 或 -test 时会收到错误信息。
   */
  encryption: 'none'
  /**
   * 用户等级，详见 本地策略。
   */
  level: number
}

interface IVLESSServerObject {
  /**
   * 地址，指向服务端，支持域名、IPv4、IPv6。
   */
  address: string
  /**
   * 端口，通常与服务端监听的端口相同。
   */
  port: number
  /**
   * 一组服务端认可的用户。
   */
  users: IVLESSServerAccountObject[]
}

interface IVLESSOutboundSettings {
  /**
   * 一个数组，包含一系列指向服务端的配置。
   */
  vnext: IVLESSServerObject[]
}

interface IHttpServer {
  /**
   * HTTP 代理服务器地址，必填。
   */
  address?: string
  /**
   * HTTP 代理服务器端口，必填。
   */
  port?: number
  /**
   * 一个数组，数组中每个元素为一个用户帐号。默认值为空。
   */
  users?: IHttpAccountObject[]
}

interface IHttpOutboundSettings {
  /**
   * HTTP 代理服务器配置，若配置多个，循环使用 (RoundRobin)。
   */
  servers: IHttpServer[]
}

export type IV2RayOutbound =
  | IV2rayOutboundSetting<V2RayProtocol.BLACKHOLE, IBlackholeOutboundSettings>
  | IV2rayOutboundSetting<V2RayProtocol.DNS, IDNSOutboundSettings>
  | IV2rayOutboundSetting<V2RayProtocol.FREEDOM, IFreedomOutboundSettings>
  | IV2rayOutboundSetting<V2RayProtocol.HTTP, IHttpOutboundSettings>
  | IV2rayOutboundSetting<V2RayProtocol.MTPROTO, IMTProtoOutboundSettings>
  | IV2rayOutboundSetting<V2RayProtocol.SHADOWSOCKS, IShadowsocksOutboundSettings>
  | IV2rayOutboundSetting<V2RayProtocol.SOCKS, ISocksOutboundSettings>
  | IV2rayOutboundSetting<V2RayProtocol.VMESS, IVmessOutboundSettings>
  | IV2rayOutboundSetting<V2RayProtocol.VLESS, IVLESSOutboundSettings>
  | IV2rayOutboundSetting<V2RayProtocol.TROJAN, ITrojanOutboundSettings>
