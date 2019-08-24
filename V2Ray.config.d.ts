/**
 * 连接协议名称
 */
export enum V2RayProtocol {
  BLACKHOLE = 'blackhole',
  DNS = 'dns',
  DOKODEMO_DOOR = 'dokodemo-door',
  FREEDOM = 'freedom',
  HTTP = 'http',
  MTPROTO = 'mtproto',
  SHADOWSOCKS = 'shadowsocks',
  SOCKS = 'socks',
  VMESS = 'vmess'
}

export interface IV2rayLog {
  /**
   * 访问日志的文件地址，其值是一个合法的文件地址，如"/tmp/v2ray/_access.log"（Linux）或者"C:\Temp\v2ray\_access.log"（Windows）。当此项不指定或为空值时，表示将日志输出至 stdout
   */
  access?: string
  /**
   * 错误日志的文件地址，其值是一个合法的文件地址，如"/tmp/v2ray/_error.log"（Linux）或者"C:\Temp\v2ray\_error.log"（Windows）。当此项不指定或为空值时，表示将日志输出至 stdout
   */
  error?: string
  /**
   * 错误日志的级别。默认值为"warning"
   */
  loglevel?: 'debug' | 'info' | 'warning' | 'error' | 'none'
}

type APIService = 'HandlerService' | 'LoggerService' | 'StatsService'

export interface IV2rayAPI {
  /**
   * 出站代理标识
   */
  tag?: string
  /**
   * 开启的 API 列表
   */
  services?: APIService[]
}

export interface IDNSServer {
  /**
   * DNS 服务器地址，如"8.8.8.8"。目前只支持 UDP 协议的 DNS 服务器
   */
  address?: string
  /**
   * DNS 服务器端口，如53
   */
  port?: number
  /**
   * 一个域名列表，此列表包含的域名，将优先使用此服务器进行查询。域名格式和路由配置中相同
   */
  domains?: string[]
}

export interface IV2rayDNS {
  /**
   * 静态 IP 列表，其值为一系列的"域名":"地址"。其中地址可以是 IP 或者域名。在解析域名时，如果域名匹配这个列表中的某一项，当该项的地址为 IP 时，则解析结果为该项的 IP，而不会使用下述的 servers 进行解析；当该项的地址为域名时，会使用此域名进行 IP 解析，而不使用原始域名
   */
  hosts?: {
    [k: string]: any
  }
  /**
   * 一个 DNS 服务器列表，支持的类型有三种：IP 地址（字符串形式），ServerObject，或者"localhost"
   */
  servers?: (string | IDNSServer)[]
  /**
   * 当前系统的 IP 地址，用于 DNS 查询时，通知服务器客户端的所在位置。不能是私有地址
   */
  clientIp?: string
  /**
   * (V2Ray 4.13+) 由此 DNS 发出的查询流量，除localhost外，都会带有此标识，可在路由使用inboundTag进行匹配
   */
  tag?: string
}

export interface IRoutingRule {
  /**
   * 目前只支持"field"这一个选项
   */
  type?: 'field'
  /**
   * 一个数组，数组每一项是一个域名的匹配，详情 https://www.v2ray.com/chapter_02/03_routing.html#ruleobject
   */
  domain?: string[]
  /**
   * 一个数组，数组内每一个元素代表一个 IP 范围。当某一元素匹配目标 IP 时，此规则生效
   */
  ip?: string[]
  /**
   * 端口范围
   */
  port?: number | string
  /**
   * 可选的值有"tcp"、"udp"或"tcp,udp"，当连接方式是指定的方式时，此规则生效
   */
  network?: 'tcp' | 'udp' | 'tcp,udp'
  /**
   * 一个数组，数组内每一个元素是一个 IP 或 CIDR。当某一元素匹配来源 IP 时，此规则生效
   */
  source?: string[]
  /**
   * 一个数组，数组内每一个元素是一个邮箱地址。当某一元素匹配来源用户时，此规则生效。当前 Shadowsocks 和 VMess 支持此规则
   */
  user?: string[]
  /**
   * 一个数组，数组内每一个元素是一个标识。当某一元素匹配入站协议的标识时，此规则生效
   */
  inboundTag?: string[]
  /**
   * 一个数组，数组内每一个元素表示一种协议。当某一个协议匹配当前连接的流量时，此规则生效。必须开启入站代理中的sniffing选项
   */
  protocol?: ('http' | 'tls' | 'bittorrent')[]
  /**
   * (V2Ray 4.18+) 一段脚本，用于检测流量的属性值。当此脚本返回真值时，此规则生效
   */
  attrs?: string
  /**
   * 对应一个额外出站连接配置的标识
   */
  outboundTag?: string
  /**
   * 对应一个负载均衡器的标识。balancerTag和outboundTag须二选一。当同时指定时，outboundTag生效
   */
  balancerTag?: string
}

export interface IV2rayRouting {
  /**
   * 域名解析策略，根据不同的设置使用不同的策略
   */
  domainStrategy?: 'AsIs' | 'IPIfNonMatch' | 'IPOnDemand'
  /**
   * 对应一个数组，数组中每个元素是一个规则。对于每一个连接，路由将根据这些规则依次进行判断，当一个规则生效时，即将这个连接转发至它所指定的outboundTag(或balancerTag，V2Ray 4.4+)。当没有匹配到任何规则时，流量默认由主出站协议发出
   */
  rules?: IRoutingRule[]
  /**
   * (V2Ray 4.4+)一个数组，数组中每个元素是一个负载均衡器的配置。当一个规则指向一个负载均衡器时，V2Ray 会通过此负载均衡器选出一个出站协议，然后由它转发流量
   */
  balancers?: {
    /**
     * 此负载均衡器的标识，用于匹配RuleObject中的balancerTag
     */
    tag?: string
    /**
     * 一个字符串数组，其中每一个字符串将用于和出站协议标识的前缀匹配
     */
    selector?: string[]
  }[]
}

export interface IV2rayPolicy {
  /**
   * 一组键值对，每个键是一个字符串形式的数字（JSON 的要求），比如 "0"、"1" 等，双引号不能省略，这个数字对应用户等级
   */
  levels?: {
    [k: string]: any
  }
  /**
   * V2Ray 系统的策略
   */
  system?: {
    [k: string]: any
  }
}

export interface IDokodemoInboundSettings {
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

export interface IDokodemoInbound extends IV2rayInboundCommon {
  protocol: V2RayProtocol.DOKODEMO_DOOR
  settings: IDokodemoInboundSettings
}

export interface IHttpInboundSettings {
  /**
   * 从客户端读取数据的超时设置（秒），0 表示不限时。默认值为 300。 V2Ray 3.1 后等价于对应用户等级的 connIdle 策略
   */
  timeout?: number
  /**
   * 一个数组，数组中每个元素为一个用户帐号。默认值为空
   */
  accounts?: {
    /**
     * 用户名，字符串类型。必填
     */
    user?: string
    /**
     * 密码，字符串类型。必填
     */
    pass?: string
  }[]
  /**
   * 当为true时，会转发所有 HTTP 请求，而非只是代理请求。若配置不当，开启此选项会导致死循环
   */
  allowTransparent?: boolean
  /**
   * 用户等级，所有连接使用这一等级
   */
  userLevel?: number
}

export interface IHttpInbound extends IV2rayInboundCommon {
  protocol: V2RayProtocol.HTTP
  settings: IHttpInboundSettings
}

export interface IMTProtoAccount {
  /**
   * 用户邮箱，用于统计流量等辅助功能
   */
  email?: string
  /**
   * 用户等级
   */
  level?: number
  /**
   * 用户密钥。必须为 32 个字符，仅可包含0到9和a到f之间的字符
   */
  secret?: string
}

export interface IMTProtoInboundSettings {
  /**
   * 一个数组，其中每一个元素表示一个用户。目前只有第一个用户会生效
   */
  users?: IMTProtoAccount[]
}

export interface IMTProtoInbound extends IV2rayInboundCommon {
  protocol: V2RayProtocol.MTPROTO
  settings: IMTProtoInboundSettings
}

export enum ShadowSocksMethod {
  AES_256_CFB = 'aes-256-cfb',
  AES_128_CFB = 'aes-128-cfb',
  CHACHA20 = 'chacha20',
  CHACHA20_IETF = 'chacha20-ietf',
  AES_256_GCM = 'aes-256-gcm',
  AES_128_GCM = 'aes-128-gcm',
  CHACHA20_POLY1305 = 'chacha20-poly1305',
  CHACHA20_IETF_POLY1305 = 'chacha20-ietf-poly1305'
}

export interface IShadowSocksInboundSettings {
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
  /**
   * 是否强制 OTA，如果不指定此项，则自动判断。强制开启 OTA 后，V2Ray 会拒绝未启用 OTA 的连接。反之亦然
   */
  ota?: boolean
  /**
   * 可接收的网络连接类型，默认值为"tcp"
   */
  network?: 'tcp' | 'udp' | 'tcp,udp'
}

export interface IShadowSocksInbound extends IV2rayInboundCommon {
  protocol: V2RayProtocol.SHADOWSOCKS
  settings: IShadowSocksInboundSettings
}

export interface ISocksInboundSettings {
  /**
   * Socks 协议的认证方式，支持"noauth"匿名方式和"password"用户密码方式。默认值为"noauth"
   */
  auth?: 'noauth' | 'password'
  /**
   * 一个数组，数组中每个元素为一个用户帐号。默认值为空。此选项仅当 auth 为 password 时有效
   */
  accounts?: IAccount[]
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

export interface ISocksInbound extends IV2rayInboundCommon {
  protocol: V2RayProtocol.SOCKS
  settings: ISocksInboundSettings
}

export interface IVmessAccount {
  /**
   * VMess 的用户 ID。必须是一个合法的 UUID
   */
  id?: string
  /**
   * 用户等级
   */
  level?: number
  /**
   * 为了进一步防止被探测，一个用户可以在主 ID 的基础上，再额外生成多个 ID。这里只需要指定额外的 ID 的数量，推荐值为 4。不指定的话，默认值是 0。最大值 65535。这个值不能超过服务器端所指定的值
   */
  alterId?: number
  /**
   * 用户邮箱地址，用于区分不同用户的流量
   */
  email?: string
}

export interface IVmessInboundSettings {
  /**
   * 一组服务器认可的用户。clients 可以为空。当此配置用作动态端口时，V2Ray 会自动创建用户
   */
  clients?: IVmessAccount[]
  /**
   * 指示对应的出站协议使用另一个服务器
   */
  default?: {
    /**
     * 用户等级，默认值为0
     */
    level?: number
    /**
     * 为了进一步防止被探测，一个用户可以在主 ID 的基础上，再额外生成多个 ID。这里只需要指定额外的 ID 的数量，推荐值为 4。不指定的话，默认值是 0。最大值 65535。这个值不能超过服务器端所指定的值
     */
    alterId?: number
  }
  /**
   * 可选，clients 的默认配置。仅在配合detour时有效
   */
  detour?: {
    /**
     * 一个入站协议的tag，详见配置文件。指定的入站协议必须是一个 VMess
     */
    to?: string
  }
  /**
   * 是否禁止客户端使用不安全的加密方式，当客户端指定下列加密方式时，服务器会主动断开连接。默认值为false
   */
  disableInsecureEncryption?: boolean
}

export interface IVmessInbound extends IV2rayInboundCommon {
  protocol: V2RayProtocol.VMESS
  settings: IVmessInboundSettings
}

export interface IV2rayStreamSetting {
  /**
   * 数据流所使用的网络类型，默认值为 "tcp"
   */
  network?: 'tcp' | 'kcp' | 'ws' | 'http' | 'domainsocket' | 'quic'
  /**
   * 是否启入传输层加密，支持的选项有 "none" 表示不加密（默认值），"tls" 表示使用 TLS
   */
  security?: 'none' | 'tls'
  /**
   * 连接选项
   */
  sockopt?: {
    /**
     * 一个整数。当其值非零时，在出站连接上标记 SO_MARK (仅适用于 Linux 系统)
     */
    mark?: number
    /**
     * 是否启用 TCP Fast Open。当其值为true时，强制开启TFO；当其它为false时，强制关闭TFO；当此项不存在时，使用系统默认设置。可用于入站出站连接
     */
    tcpFastOpen?: boolean
    /**
     * 是否开启透明代理 (仅适用于 Linux)
     */
    tproxy?: 'redirect' | 'tproxy' | 'off'
  }
}

export interface IV2raySniffing {
  /**
   * 是否开启流量探测
   */
  enabled?: boolean
  /**
   * 当流量为指定类型时，按其中包括的目标地址重置当前连接的目标
   */
  destOverride?: ('http' | 'tls')[]
}

export interface IV2rayAllocate {
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

export type IV2RayInbound =
  | IDokodemoInbound
  | IHttpInbound
  | IMTProtoInbound
  | IShadowSocksInbound
  | ISocksInbound
  | IVmessInbound

export interface IV2rayInboundCommon {
  /**
   * 端口
   */
  port?: number
  /**
   * 监听地址，只允许 IP 地址，默认值为"0.0.0.0"，表示接收所有网卡上的连接。除此之外，必须指定一个现有网卡的地址
   */
  listen?: string
  protocol?: V2RayProtocol
  /**
   * 具体的配置内容，视协议不同而不同
   */
  settings?: any
  /**
   * 底层传输配置
   */
  streamSettings?: IV2rayTransport & IV2rayStreamSetting
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

export interface IBlackholeOutboundSettings {
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

export interface IBlackholeOutbound extends IV2rayOutboundCommon {
  protocol: V2RayProtocol.BLACKHOLE
  settings: IBlackholeOutboundSettings
}

export interface IDNSOutboundSettings {
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

export interface IDNSOutbound extends IV2rayOutboundCommon {
  protocol: V2RayProtocol.DNS
  settings: IDNSOutboundSettings
}

export interface IFreedomOutboundSettings {
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

export interface IFreedomOutbound extends IV2rayOutboundCommon {
  protocol: V2RayProtocol.FREEDOM
  settings: IFreedomOutboundSettings
}

export interface IMTProtoOutboundSettings {}

export interface IMTProtoOutbound extends IV2rayOutboundCommon {
  protocol: V2RayProtocol.MTPROTO
  settings: IMTProtoOutboundSettings
}

export interface IShadowSocksServer {
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

export interface IShadowsocksOutboundSettings {
  /**
   * 一个数组，其中每一项是一个 ServerObject
   */
  servers?: IShadowSocksServer[]
}

export interface IShadowsocksOutbound extends IV2rayOutboundCommon {
  protocol: V2RayProtocol.SHADOWSOCKS
  settings: IShadowsocksOutboundSettings
}

export interface ISocksServer {
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
  users?: (IAccount & {
    /**
     * 用户等级
     */
    level?: number
  })[]
}

export interface ISocksOutboundSettings {
  /**
   * Socks 服务器列表，其中每一项是一个服务器配置
   */
  servers?: ISocksServer[]
  [k: string]: any
}

export interface ISocksOutbound extends IV2rayOutboundCommon {
  protocol: V2RayProtocol.SOCKS
  settings: ISocksOutboundSettings
}

export interface IVmessOutboundSettings {
  /**
   * 一个数组，包含一系列的服务器配置
   */
  vnext?: {
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
    users?: {
      /**
       * VMess 用户的主 ID。必须是一个合法的 UUID
       */
      id?: string
      /**
       * 为了进一步防止被探测，一个用户可以在主 ID 的基础上，再额外生成多个 ID。这里只需要指定额外的 ID 的数量，推荐值为 4。不指定的话，默认值是 0。最大值 65535。这个值不能超过服务器端所指定的值
       */
      alterId?: number
      /**
       * 加密方式，客户端将使用配置的加密方式发送数据，服务器端自动识别，无需配置
       */
      security?: 'aes-128-gcm' | 'chacha20-poly1305' | 'auto' | 'none'
      /**
       * 用户等级
       */
      level?: number
    }[]
  }[]
}

export interface IVmessOutbound extends IV2rayOutboundCommon {
  protocol: V2RayProtocol.VMESS
  settings: IVmessOutboundSettings
}

type IV2RayOutbound =
  | IBlackholeOutbound
  | IDNSOutbound
  | IFreedomOutbound
  | IMTProtoOutbound
  | IShadowsocksOutbound
  | ISocksOutbound
  | IVmessOutbound

export interface IV2rayOutboundCommon {
  /**
   * 用于发送数据的 IP 地址，当主机有多个 IP 地址时有效，默认值为"0.0.0.0"
   */
  sendThrough?: string
  protocol?: V2RayProtocol
  /**
   * 具体的配置内容，视协议不同而不同
   */
  settings?: any
  /**
   * 此出站连接的标识，用于在其它的配置中定位此连接。当其值不为空时，必须在所有 tag 中唯一
   */
  tag?: string
  /**
   * 底层传输配置
   */
  streamSettings?: IV2rayTransport & IV2rayStreamSetting
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

export interface IAccount {
  /**
   * 用户名
   */
  user?: string
  /**
   * 密码
   */
  pass?: string
}

export enum HeaderObjectType {
  /**
   *  默认值，不进行伪装，发送的数据是没有特征的数据包
   */
  NONE = 'none',
  /**
   * 伪装成 SRTP 数据包，会被识别为视频通话数据（如 FaceTime）
   */
  SRTP = 'srtp',
  /**
   * 伪装成 uTP 数据包，会被识别为 BT 下载数据
   */
  UTP = 'utp',
  /**
   * 伪装成微信视频通话的数据包
   */
  WECHAT_VIDEO = 'wechat-video',
  /**
   * 伪装成 DTLS 1.2 数据包
   */
  DTLS = 'dtls',
  /**
   * 伪装成 WireGuard 数据包。(并不是真正的 WireGuard 协议)
   */
  WIREGUARD = 'wireguard'
}

/**
 * TransportObject对应配置文件的transport项
 */
export interface IV2rayTransport {
  /**
   * 针对 TCP 连接的配置
   */
  tcpSettings?: {
    header:
      | {
          type: 'none'
        }
      | {
          type: 'http'
          request: {
            [key: string]: any
          }
          response: {
            [key: string]: any
          }
        }
  }
  /**
   * 针对 mKCP 连接的配置
   */
  mKcpSettings?: {
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
  }
  /**
   * 针对 WebSocket 连接的配置
   */
  wsSettings?: {
    /**
     * WebSocket 所使用的 HTTP 协议路径，默认值为 "/"
     */
    path: string
    /**
     * 自定义 HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是字符串。默认值为空
     */
    headers: {
      [k: string]: any
    }
  }
  /**
   * 针对 HTTP/2 连接的配置
   */
  httpSettings?: {
    /**
     * 一个字符串数组，每一个元素是一个域名。客户端会随机从列表中选出一个域名进行通信，服务器会验证域名是否在列表中
     */
    host: string[]
    /**
     * HTTP 路径，由/开头。客户端和服务器必须一致。可选参数，默认值为"/"
     */
    path: string
  }
  /**
   * 针于Domain Socket 连接的配置
   */
  dsSettings?: {
    /**
     * 一个合法的文件路径。在运行 V2Ray 之前，这个文件必须不存在
     */
    path: string
  }
  /**
   * (V2Ray 4.7+) 针于QUIC 连接的配置
   * QUIC 的配置对应传输配置中的 quicSettings 项。对接的两端的配置必须完全一致，否则连接失败。QUIC 强制要求开启 TLS，在传输配置中没有开启 TLS 时，V2Ray 会自行签发一个证书进行 TLS 通讯。在使用 QUIC 传输时，可以关闭 VMess 的加密
   */
  quicSettings?: {
    /**
     * 加密方式。默认值为不加密
     */
    security: 'none' | 'aes-128-gcm' | 'chacha20-poly1305'
    /**
     * 加密时所用的密钥。可以是任意字符串。当security不为"none"时有效
     */
    key: string
    header: {
      type: HeaderObjectType
    }
  }
}

/**
 * V2Ray config
 */
export interface IV2Ray {
  /**
   * 日志配置，表示 V2Ray 如何输出日志
   */
  log?: IV2rayLog
  /**
   * 内置的远程控置 API
   */
  api?: IV2rayAPI
  /**
   * 内置的 DNS 服务器，若此项不存在，则默认使用本机的 DNS 设置
   */
  dns?: IV2rayDNS
  /**
   * 当此项存在时，开启统计信息，目前无配置
   */
  stats?: {}
  /**
   * 路由配置
   */
  routing?: IV2rayRouting
  /**
   * 本地策略可进行一些权限相关的配置
   */
  policy?: IV2rayPolicy
  /**
   * 反向代理配置
   */
  reverse?: {
    [k: string]: any
  }
  /**
   * 一个数组，每个元素是一个入站连接配置
   */
  inbounds?: IV2RayInbound[]
  /**
   * 一个数组，每个元素是一个出站连接配置。列表中的第一个元素作为主出站协议。当路由匹配不存在或没有匹配成功时，流量由主出站协议发出
   */
  outbounds?: IV2RayOutbound[]
  /**
   * 用于配置 V2Ray 如何与其它服务器建立和使用网络连接
   */
  transport?: IV2rayTransport
}
