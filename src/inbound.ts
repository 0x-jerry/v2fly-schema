import {
  V2RayProtocol,
  IHttpAccountObject,
  IMTProtoAccount,
  ShadowSocksMethod,
  IVLESSAccountObject,
  IVmessAccount,
  ITrojanAccountObject,
} from './common'
import { IV2rayStreamSetting } from './stream'

interface IFallbacksObject {
  /**
   * 尝试匹配 TLS ALPN 协商结果，空为任意，默认为 ""
   *
   * 有需要时，VLESS 才会尝试读取 TLS ALPN 协商结果，若成功，输出 info realAlpn = 到日志。
   *
   * 用途：解决了 Nginx 的 h2c 服务不能同时兼容 http/1.1 的问题，Nginx 需要写两行 listen，分别用于 1.1 和 h2c。
   *
   * 注意：fallbacks alpn 存在 "h2" 时，Inbound TLS 需设置 "alpn":["h2","http/1.1"]，以支持 h2 访问。
   */
  alpn: string
  /**
   * 尝试匹配首包 HTTP PATH，空为任意，默认为空，非空则必须以 "/" 开头，不支持 h2c。
   *
   * 智能：有需要时，VLESS 才会尝试看一眼 PATH（不超过 55 个字节；最快算法，并不完整解析 HTTP），若成功，输出 info realPath = 到日志。
   *
   * 用途：分流其它 inbound 的 WebSocket 流量或 HTTP 伪装流量，没有多余处理、纯粹转发流量，实测比 Nginx 反代更强 (opens new window)。
   *
   * 注意：fallbacks 所在入站本身必须是 TCP+TLS，这是分流至其它 WS 入站用的，被分流的入站则无需配置 TLS。
   */
  path: string
  /**
   * 决定 TLS 解密后 TCP 流量的去向，目前支持两类地址：（该项必填，否则无法启动）
   *
   * 1. TCP，格式为 "addr:port"，其中 addr 支持 IPv4、域名、IPv6，若填写域名，也将直接发起 TCP 连接（而不走内置的 DNS）。
   * 2. Unix domain socket，格式为绝对路径，形如 "/dev/shm/domain.socket"，可在开头加 "@" 代表 abstract (opens new window)，"@@" 则代表带 padding 的 abstract。
   *
   * 若只填 port，数字或字符串均可，形如 80、"80"，通常指向一个明文 http 服务（addr 会被补为 "127.0.0.1"）。
   */
  dest: string | number
  /**
   * 发送 PROXY protocol (opens new window)，专用于传递请求的真实来源 IP 和端口，填版本 1 或 2，默认为 0，即不发送。若有需要建议填 1。
   *
   * 目前填 1 或 2，功能完全相同，只是结构不同，且前者可打印，后者为二进制。V2Ray 的 TCP 和 WS 入站均已支持接收 PROXY protocol。
   *
   * 补充说明
   *
   * 将匹配到最精确的子元素，与子元素的排列顺序无关。若配置了几个 alpn 和 path 均相同的子元素，则会以最后的为准。
   *
   * 回落分流均是解密后 TCP 层的转发，而不是 HTTP 层，只在必要时检查首包 PATH。
   *
   * 不支持按域名分流。若有此需求，建议前置 Nginx 等并配置 stream SNI 分流。
   */
  xver: number
}

interface IV2raySniffing {
  /**
   * 是否开启流量探测
   */
  enabled?: boolean
  /**
   * 当流量为指定类型时，按其中包括的目标地址重置当前连接的目标
   */
  destOverride?: ('http' | 'tls')[]
}

interface IV2rayAllocate {
  /**
   * 端口分配策略。"always"表示总是分配所有已指定的端口，port中指定了多少个端口，V2Ray 就会监听这些端口。"random"表示随机开放端口，每隔refresh分钟在port范围中随机选取concurrency个端口来监听
   */
  strategy?: 'always' | 'random'
  /**
   * 随机端口刷新间隔，单位为分钟。最小值为2，建议值为5。这个属性仅当strategy = random时有效
   */
  refresh?: number
  /**
   * 随机端口数量。最小值为1，最大值为port范围的三分之一。建议值为3
   */
  concurrency?: number
}

interface IV2rayInboundSetting<Protocol extends V2RayProtocol, Setting> {
  /**
   * 连接协议名称，可选的值见协议列表。
   */
  protocol?: Protocol

  /**
   * 具体的配置内容，视协议不同而不同
   */
  settings?: Setting

  /**
   * 监听地址，只允许 IP 地址，默认值为 "0.0.0.0"，表示接收所有网卡上的连接。除此之外，必须指定一个现有网卡的地址。
   *
   * v4.32.0+，支持填写 Unix domain socket，格式为绝对路径，形如 "/dev/shm/domain.socket"，可在开头加 "@" 代表 abstract (opens new window)，"@@" 则代表带 padding 的 abstract。
   *
   * 填写 Unix domain socket 时，port 和 allocate 将被忽略，协议暂时可选 VLESS、VMess、Trojan，传输方式可选 TCP、WebSocket、HTTP/2。
   */
  listen?: string
  /**
   * 端口
   *
   * 整型数值: 实际的端口号
   *
   * 环境变量: 以"env:"开头，后面是一个环境变量的名称，如"env:PORT"。V2Ray 会以字符串形式解析这个环境变量。
   *
   * 字符串: 可以是一个数值类型的字符串，如"1234"；或者一个数值范围，如"5-10"表示端口 5 到端口 10 这 6 个端口。
   */
  port?: number | 'env:variable' | string
  /**
   * 底层传输配置
   */
  streamSettings?: IV2rayStreamSetting
  /**
   * 此入站连接的标识，用于在其它的配置中定位此连接。当其不为空时，其值必须在所有tag中唯一
   */
  tag?: string
  /**
   * 尝试探测流量的类型
   */
  sniffing?: IV2raySniffing
  /**
   * 端口分配设置
   */
  allocate?: IV2rayAllocate
}

interface IDokodemoInboundSettings {
  /**
   * 将流量转发到此地址。可以是一个 IP 地址，形如"1.2.3.4"，或者一个域名，形如"v2ray.com"。字符串类型
   */
  address?: string
  /**
   * 将流量转发到目标地址的指定端口，范围[1, 65535]，数值类型。必填参数
   */
  port?: number
  /**
   * 可接收的网络协议类型。比如当指定为"tcp"时，任意门仅会接收 TCP 流量。默认值为"tcp"
   */
  network?: 'tcp' | 'udp' | 'tcp,udp'
  /**
   * 入站数据的时间限制（秒），默认值为 300
   *
   * V2Ray 3.1 后等价于对应用户等级的 connIdle 策略
   */
  timeout?: number
  /**
   * 当值为true时，dokodemo-door 会识别出由 iptables 转发而来的数据，并转发到相应的目标地址。详见传输配置中的tproxy设置
   */
  followRedirect?: boolean
  /**
   * 用户等级，所有连接都会使用这个用户等级
   */
  userLevel?: number
}

interface IHttpInboundSettings {
  /**
   * 从客户端读取数据的超时设置（秒），0 表示不限时。默认值为 300。 V2Ray 3.1 后等价于对应用户等级的 connIdle 策略
   */
  timeout?: number
  /**
   * 一个数组，数组中每个元素为一个用户帐号。默认值为空
   */
  accounts?: IHttpAccountObject[]
  /**
   * 当为true时，会转发所有 HTTP 请求，而非只是代理请求。若配置不当，开启此选项会导致死循环
   */
  allowTransparent?: boolean
  /**
   * 用户等级，所有连接使用这一等级
   */
  userLevel?: number
}

interface IMTProtoInboundSettings {
  /**
   * 一个数组，其中每一个元素表示一个用户。目前只有第一个用户会生效
   */
  users?: IMTProtoAccount[]
}

interface IShadowSocksInboundSettings {
  /**
   * 邮件地址，可选，用于标识用户
   */
  email?: string
  /**
   * 必填。可选的值见加密方式列表
   */
  method?: ShadowSocksMethod
  /**
   * 必填，任意字符串。Shadowsocks 协议不限制密码长度，但短密码会更可能被破解，建议使用 16 字符或更长的密码
   */
  password?: string
  /**
   * 用户等级，默认值为 0
   */
  level?: number
  // /**
  //  * 是否强制 OTA，如果不指定此项，则自动判断。强制开启 OTA 后，V2Ray 会拒绝未启用 OTA 的连接。反之亦然
  //  */
  // ota?: boolean
  /**
   * 可接收的网络连接类型，默认值为"tcp"
   */
  network?: 'tcp' | 'udp' | 'tcp,udp'
}

interface ISocksInboundSettings {
  /**
   * Socks 协议的认证方式，支持"noauth"匿名方式和"password"用户密码方式。默认值为"noauth"
   */
  auth?: 'noauth' | 'password'
  /**
   * 一个数组，数组中每个元素为一个用户帐号。默认值为空。此选项仅当 auth 为 password 时有效
   */
  accounts?: IVLESSAccountObject[]
  /**
   * 是否开启 UDP 协议的支持。默认值为 false
   */
  udp?: boolean
  /**
   * 当开启 UDP 时，V2Ray 需要知道本机的 IP 地址。默认值为"127.0.0.1"
   */
  ip?: string
  /**
   * 用户等级，所有连接使用这一等级
   */
  userLevel?: number
}

interface IDetourObject {
  /**
   * 一个入站协议的tag，详见配置文件。指定的入站协议必须是一个 VMess
   */
  to?: string
}

interface IDefaultObject {
  /**
   * 用户等级，默认值为0
   */
  level?: number
  /**
   * 为了进一步防止被探测，一个用户可以在主 ID 的基础上，再额外生成多个 ID。这里只需要指定额外的 ID 的数量，推荐值为 4。不指定的话，默认值是 0。最大值 65535。这个值不能超过服务器端所指定的值
   */
  alterId?: number
}

interface IVmessInboundSettings {
  /**
   * 一组服务器认可的用户。clients 可以为空。当此配置用作动态端口时，V2Ray 会自动创建用户
   */
  clients?: IVmessAccount[]
  /**
   * 指示对应的出站协议使用另一个服务器。
   */
  detour?: IDetourObject
  /**
   * 可选，clients 的默认配置。仅在配合detour时有效。
   */
  default?: IDefaultObject
  /**
   * 是否禁止客户端使用不安全的加密方式，当客户端指定下列加密方式时，服务器会主动断开连接。默认值为false
   * - "none"
   * - "aes-128-cfb"
   */
  disableInsecureEncryption?: boolean
}

interface IVLESSInboundSettings {
  /**
   * 一组服务端认可的用户。
   */
  clients?: IVLESSAccountObject[]
  /**
   * 注意这里是 decryption，和 clients 同级。现阶段同样需要填 "none"，不能留空。decryption 和 encryption 的位置不同，是因为若套一层约定加密，服务端需要先解密才能知道是哪个用户。
   *
   * 若未正确设置 decryption 的值，使用 v2ray 或 -test 时会收到错误信息。
   */
  decryption?: 'none'
  /**
   * 一个数组，包含一系列强大的回落分流配置（可选）。
   */
  fallbacks?: IFallbacksObject[]
}

interface ITrojanInboundSettings {
  clients: ITrojanAccountObject[]
  fallbacks: IFallbacksObject[]
}

type InboundMap = {
  [V2RayProtocol.DOKODEMO_DOOR]: IDokodemoInboundSettings
  [V2RayProtocol.HTTP]: IHttpInboundSettings
  [V2RayProtocol.MTPROTO]: IMTProtoInboundSettings
  [V2RayProtocol.SHADOWSOCKS]: IShadowSocksInboundSettings
  [V2RayProtocol.SOCKS]: ISocksInboundSettings
  [V2RayProtocol.VLESS]: IVLESSInboundSettings
  [V2RayProtocol.VMESS]: IVmessInboundSettings
  [V2RayProtocol.TROJAN]: ITrojanInboundSettings
}

export type IV2RayInbound =
  | IV2rayInboundSetting<V2RayProtocol.DOKODEMO_DOOR, IDokodemoInboundSettings>
  | IV2rayInboundSetting<V2RayProtocol.HTTP, IHttpInboundSettings>
  | IV2rayInboundSetting<V2RayProtocol.MTPROTO, IMTProtoInboundSettings>
  | IV2rayInboundSetting<V2RayProtocol.SHADOWSOCKS, IShadowSocksInboundSettings>
  | IV2rayInboundSetting<V2RayProtocol.SOCKS, ISocksInboundSettings>
  | IV2rayInboundSetting<V2RayProtocol.VLESS, IVLESSInboundSettings>
  | IV2rayInboundSetting<V2RayProtocol.VMESS, IVmessInboundSettings>
  | IV2rayInboundSetting<V2RayProtocol.TROJAN, ITrojanInboundSettings>
