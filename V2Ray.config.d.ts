/**
 * 连接协议名称
 */
export enum V2RayProtocol {
  BLACKHOLE = 'blackhole',
  VLESS = 'vless',
  DNS = 'dns',
  DOKODEMO_DOOR = 'dokodemo-door',
  FREEDOM = 'freedom',
  HTTP = 'http',
  MTPROTO = 'mtproto',
  SHADOWSOCKS = 'shadowsocks',
  SOCKS = 'socks',
  VMESS = 'vmess',
  TROJAN = 'trojan',
}

export enum LogLevel {
  /**
   * 只有开发人员能看懂的信息。同时包含所有 "info" 内容。
   */
  debug = 'debug',
  /**
   * V2Ray 在运行时的状态，不影响正常使用。同时包含所有 "warning" 内容。
   */
  info = 'info',
  /**
   * V2Ray 遇到了一些问题，通常是外部问题，不影响 V2Ray 的正常运行，但有可能影响用户的体验。同时包含所有 "error" 内容。
   */
  warning = 'warning',
  /**
   * V2Ray 遇到了无法正常运行的问题，需要立即解决。
   */
  error = 'error',
  /**
   * 不记录任何内容。
   */
  none = 'none',
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
  loglevel?: LogLevel
}

export enum APIService {
  /**
   * 一些对于入站出站代理进行修改的 API，可用的功能如下：
   * - 添加一个新的入站代理；
   * - 添加一个新的出站代理；
   * - 删除一个现有的入站代理；
   * - 删除一个现有的出站代理；
   * - 在一个入站代理中添加一个用户（仅支持 VMess、VLESS、Trojan）；
   * - 在一个入站代理中删除一个用户（仅支持 VMess、VLESS、Trojan）；
   */
  HandlerService = 'HandlerService',
  /**
   * 支持对内置 Logger 的重启，可配合 logrotate 进行一些对日志文件的操作。
   */
  LoggerService = 'LoggerService',
  /**
   * 内置的数据统计服务，详见 统计信息。
   */
  StatsService = 'StatsService',
}

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

export interface IServerObject {
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
  /**
   * （V2Ray 4.22.0+）一个 IP 范围列表，格式和 路由配置 中相同。
   *
   * 当配置此项时，V2Ray DNS 会对返回的 IP 的进行校验，只返回包含 expectIPs 列表中的地址。
   *
   * 如果未配置此项，会原样返回 IP 地址。
   */
  expectIps?: string[]
}

export interface IV2rayDNS {
  /**
   * 静态 IP 列表，其值为一系列的"域名":"地址"。其中地址可以是 IP 或者域名。在解析域名时，如果域名匹配这个列表中的某一项，当该项的地址为 IP 时，则解析结果为该项的 IP，而不会使用下述的 servers 进行解析；当该项的地址为域名时，会使用此域名进行 IP 解析，而不使用原始域名
   */
  hosts?: {
    [k: string]: string
  }
  /**
   * 一个 DNS 服务器列表，支持的类型有三种：IP 地址（字符串形式），ServerObject，或者"localhost"
   */
  servers?: (string | IServerObject)[]
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
   * `a-b`：a 和 b 均为正整数，且小于 65536。这个范围是一个前后闭合区间，当目标端口落在此范围内时，此规则生效。
   *
   * `a`：a 为正整数，且小于 65536。当目标端口为 a 时，此规则生效。
   *
   * （V2Ray 4.18+）以上两种形式的混合，以逗号 "," 分隔。形如："53,443,1000-2000"。
   */
  sourcePort?: number | string
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

export enum IStrategy {
  /**
   * 只使用域名进行路由选择。默认值。
   */
  AsIs = 'AsIs',
  /**
   * 当域名没有匹配任何规则时，将域名解析成 IP（A 记录或 AAAA 记录）再次进行匹配；
   *
   * 当一个域名有多个 A 记录时，会尝试匹配所有的 A 记录，直到其中一个与某个规则匹配为止；
   *
   * 解析后的 IP 仅在路由选择时起作用，转发的数据包中依然使用原始域名；
   */
  IPIfNonMatch = 'IPIfNonMatch',
  /**
   * 当匹配时碰到任何基于 IP 的规则，将域名立即解析为 IP 进行匹配；
   */
  IPOnDemand = 'IPOnDemand',
}

export interface IBalancerObject {
  /**
   * 此负载均衡器的标识，用于匹配RuleObject中的balancerTag
   */
  tag?: string
  /**
   * 一个字符串数组，其中每一个字符串将用于和出站协议标识的前缀匹配
   */
  selector?: string[]
}

export interface IV2rayRouting {
  /**
   * 域名解析策略，根据不同的设置使用不同的策略
   */
  domainStrategy?: IStrategy
  /**
   * 对应一个数组，数组中每个元素是一个规则。对于每一个连接，路由将根据这些规则依次进行判断，当一个规则生效时，即将这个连接转发至它所指定的outboundTag(或balancerTag，V2Ray 4.4+)。当没有匹配到任何规则时，流量默认由主出站协议发出
   */
  rules?: IRoutingRule[]
  /**
   * (V2Ray 4.4+)一个数组，数组中每个元素是一个负载均衡器的配置。当一个规则指向一个负载均衡器时，V2Ray 会通过此负载均衡器选出一个出站协议，然后由它转发流量
   */
  balancers?: IBalancerObject[]
}

export interface ILevelPolicyObject {
  /**
   * 连接建立时的握手时间限制。单位为秒。默认值为 4。在入站代理处理一个新连接时，在握手阶段（比如 VMess 读取头部数据，判断目标服务器地址），如果使用的时间超过这个时间，则中断该连接。
   */
  handshake?: number
  /**
   * 连接空闲的时间限制。单位为秒。默认值为 300。在入站出站代理处理一个连接时，如果在 connIdle 时间内，没有任何数据被传输（包括上行和下行数据），则中断该连接。
   */
  connIdle?: number
  /**
   * 当连接下行线路关闭后的时间限制。单位为秒。默认值为 2。当服务器（如远端网站）关闭下行连接时，出站代理会在等待 uplinkOnly 时间后中断连接。
   */
  uplinkOnly?: number
  /**
   * 当连接上行线路关闭后的时间限制。单位为秒。默认值为 5。当客户端（如浏览器）关闭上行连接时，入站代理会在等待 downlinkOnly 时间后中断连接。
   */
  downlinkOnly?: number
  /**
   * 当值为 true 时，开启当前等级的所有用户的上行流量统计。
   */
  statsUserUplink?: boolean
  /**
   * 当值为 true 时，开启当前等级的所有用户的下行流量统计。
   */
  statsUserDownlink?: boolean
  /**
   * 每个连接的内部缓存大小。单位为 kB。当值为 0 时，内部缓存被禁用。
   *
   * 默认值 (V2Ray 4.4+):
   *
   * 在 ARM、MIPS、MIPSLE 平台上，默认值为 0。
   *
   * 在 ARM64、MIPS64、MIPS64LE 平台上，默认值为 4。
   *
   * 在其它平台上，默认值为 512。
   *
   * 默认值 (V2Ray 4.3-):
   *
   * 在 ARM、MIPS、MIPSLE、ARM64、MIPS64、MIPS64LE 平台上，默认值为 16。
   *
   * 在其它平台上，默认值为 2048。
   */
  bufferSize?: number
}

export interface ISystemObject {
  /**
   * 当值为 true 时，开启所有入站代理的上行流量统计。
   */
  statsInboundUplink?: boolean
  /**
   * 当值为 true 时，开启所有入站代理的下行流量统计。
   */
  statsInboundDownlink?: boolean
  /**
   * （ V2Ray 4.26.0+ ）当值为 true 时，开启所有出站代理的上行流量统计。
   */
  statsOutboundUplink?: boolean
  /**
   * （ V2Ray 4.26.0+ ） 当值为 true 时，开启所有出站代理的下行流量统计。
   */
  statsOutboundDownlink?: boolean
}

export interface IV2rayPolicy {
  /**
   * 一组键值对，每个键是一个字符串形式的数字（JSON 的要求），比如 "0"、"1" 等，双引号不能省略，这个数字对应用户等级
   */
  levels?: {
    [k: string]: ILevelPolicyObject
  }
  /**
   * V2Ray 系统的策略
   */
  system?: {
    [k: string]: ISystemObject
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

export interface IDokodemoInbound extends IV2rayInboundCommon {
  protocol: V2RayProtocol.DOKODEMO_DOOR
  settings: IDokodemoInboundSettings
}

export interface IHttpAccountObject {
  /**
   * 用户名，字符串类型。必填
   */
  user?: string
  /**
   * 密码，字符串类型。必填
   */
  pass?: string
}

export interface IHttpInboundSettings {
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
  AES_256_GCM = 'aes-256-gcm',
  AES_128_GCM = 'aes-128-gcm',
  CHACHA20_POLY1305 = 'chacha20-poly1305',
  CHACHA20_IETF_POLY1305 = 'chacha20-ietf-poly1305',
  NODE = 'none',
  PLAIN = 'plain',
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
  // /**
  //  * 是否强制 OTA，如果不指定此项，则自动判断。强制开启 OTA 后，V2Ray 会拒绝未启用 OTA 的连接。反之亦然
  //  */
  // ota?: boolean
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

export interface IDetourObject {
  /**
   * 一个入站协议的tag，详见配置文件。指定的入站协议必须是一个 VMess
   */
  to?: string
}

export interface IDefaultObject {
  /**
   * 用户等级，默认值为0
   */
  level?: number
  /**
   * 为了进一步防止被探测，一个用户可以在主 ID 的基础上，再额外生成多个 ID。这里只需要指定额外的 ID 的数量，推荐值为 4。不指定的话，默认值是 0。最大值 65535。这个值不能超过服务器端所指定的值
   */
  alterId?: number
}

export interface IVmessInboundSettings {
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

export interface IVmessInbound extends IV2rayInboundCommon {
  protocol: V2RayProtocol.VMESS
  settings: IVmessInboundSettings
}

export interface ICertificateObject {
  /**
   * - "encipherment"：证书用于 TLS 认证和加密。
   * - "verify"：证书用于验证远端 TLS 的证书。当使用此项时，当前证书必须为 CA 证书。
   * - "issue"：证书用于签发其它证书。当使用此项时，当前证书必须为 CA 证书。
   */
  usage?: 'encipherment' | 'verify' | 'issue'
  /**
   * 证书文件路径，如使用 OpenSSL 生成，后缀名为 .crt。
   */
  certificateFile?: string
  /**
   * 密钥文件路径，如使用 OpenSSL 生成，后缀名为 .key。目前暂不支持需要密码的 key 文件。
   */
  keyFile?: string
  /**
   * 一个字符串数组，表示证书内容，格式如样例所示。certificate 和 certificateFile 二者选一。
   */
  certificate?: string[]
  /**
   * 一个字符串数组，表示密钥内容，格式如样例如示。key 和 keyFile 二者选一。
   *
   * 当 certificateFile 和 certificate 同时指定时，V2Ray 优先使用 certificateFile。keyFile 和 key 也一样。
   */
  key?: string[]
}

export interface ITlsSetting {
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

export interface ISockoptObject {
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
  tlsSettings: ITlsSetting
  /**
   * 连接选项
   */
  sockopt?: ISockoptObject
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
  | IVLESSInbound
  | IVmessInbound
  | ITrojanInbound

export interface ITrojanAccountObject {
  /**
   * 必填，任意字符串。
   */
  password: string
  /**
   * 邮件地址，可选，用于标识用户
   */
  email?: string
  /**
   * 用户等级，默认值为 0。详见 本地策略。
   */
  level?: number
}

export interface ITrojanInboundSettings {
  clients: ITrojanAccountObject[]
  fallbacks: IFallbacksObject[]
}

export interface ITrojanInbound extends IV2rayInboundCommon {
  protocol: V2RayProtocol.TROJAN
  settings: ITrojanInboundSettings
}

export interface IV2rayInboundCommon {
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
   * 连接协议名称，可选的值见协议列表。
   */
  protocol?: V2RayProtocol
  /**
   * 具体的配置内容，视协议不同而不同
   */
  settings?: any
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

export interface IVLESSAccountObject {
  /**
   * VLESS 的用户 ID，必须是一个合法的 UUID，你也可以用 V2Ctl 生成它。
   */
  id: string
  /**
   * 用户等级，详见 本地策略。
   */
  level: number
  /**
   * 用户邮箱，用于区分不同用户的流量（日志、统计）。
   */
  email: string
}

export interface IFallbacksObject {
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

export interface IVLESSInboundSettings {
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

export interface IVLESSInbound extends IV2rayInboundCommon {
  protocol: V2RayProtocol.VLESS
  settings: IVLESSInboundSettings
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

export interface ISocksAccountObject {
  /**
   * 用户名
   */
  user: string
  /**
   * 密码
   */
  pass: string
  /**
   * 用户等级
   */
  level?: number
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
  users?: ISocksAccountObject[]
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

export enum IVmessSecurity {
  /**
   * 推荐在 PC 上使用
   */
  AES_128_GCM = 'aes-128-gcm',
  /**
   * 推荐在手机端使用
   */
  CHACHA20_POLY1305 = 'chacha20-poly1305',
  /**
   * 默认值，自动选择（运行框架为 AMD64、ARM64 或 s390x 时为 aes-128-gcm 加密方式，其他情况则为 Chacha20-Poly1305 加密方式）
   */
  AUTO = 'auto',
  /**
   * 不加密
   */
  NONE = 'none',
}

export interface IVmessServerAccountObject {
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
  security?: IVmessSecurity
  /**
   * 用户等级
   */
  level?: number
}

export interface IVmessServer {
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

export interface IVmessOutboundSettings {
  /**
   * 一个数组，包含一系列的服务器配置
   */
  vnext?: IVmessServer[]
}

export interface IVmessOutbound extends IV2rayOutboundCommon {
  protocol: V2RayProtocol.VMESS
  settings: IVmessOutboundSettings
}

type IV2RayOutbound =
  | IBlackholeOutbound
  | IDNSOutbound
  | IFreedomOutbound
  | IHttpOutbound
  | IMTProtoOutbound
  | IShadowsocksOutbound
  | ISocksOutbound
  | IVmessOutbound
  | IVLESSOutbound
  | ITrojanOutbound

export interface ITrojanServer {
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

export interface ITrojanOutboundSettings {
  /**
   * 一个数组，其中每一项是一个 ServerObject。
   */
  servers: ITrojanServer[]
}
export interface ITrojanOutbound extends IV2rayOutboundCommon {
  protocol: V2RayProtocol.TROJAN
  settings: ITrojanOutboundSettings
}

export interface IVLESSServerAccountObject {
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
export interface IVLESSServerObject {
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

export interface IVLESSOutboundSettings {
  /**
   * 一个数组，包含一系列指向服务端的配置。

#
   */
  vnext: IVLESSServerObject[]
}

export interface IVLESSOutbound {
  protocol: V2RayProtocol.VLESS
  settings: IVLESSOutboundSettings
}

export interface IHttpServer {
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
export interface IHttpOutboundSettings {
  /**
   * HTTP 代理服务器配置，若配置多个，循环使用 (RoundRobin)。
   */
  servers: IHttpServer[]
}
export interface IHttpOutbound extends IV2rayOutboundCommon {
  protocol: V2RayProtocol.HTTP
  settings: IHttpOutboundSettings
}

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
  WIREGUARD = 'wireguard',
}

export interface ITcpHttpRequestObject {
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
export interface ITcpHttpResponseObject {
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

export interface ITcpSettings {
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

export interface IKcpSettings {
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

export interface IWsSettings {
  /**
   * v4.27.1+，仅用于 inbound，是否接收 PROXY protocol，默认值为 false。填写 true 时，最底层 TCP 连接建立后，请求方必须先发送 PROXY protocol v1 或 v2，否则连接会被关闭。
   *
   * PROXY protocol (opens new window)专用于传递请求的真实来源 IP 和端口，若你不了解它，请先忽略该项。常见的反代软件（如 HAProxy、Nginx）都可以配置发送它，VLESS fallbacks xver 也可以发送它。
   */
  acceptProxyProtocol: boolean
  /**
   * WebSocket 所使用的 HTTP 协议路径，默认值为 "/"
   */
  path: string
  /**
   * 自定义 HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是字符串。默认值为空
   */
  headers: Record<string, string>
}

export interface IHttp2Settings {
  /**
   * 一个字符串数组，每一个元素是一个域名。客户端会随机从列表中选出一个域名进行通信，服务器会验证域名是否在列表中
   */
  host: string[]
  /**
   * HTTP 路径，由/开头。客户端和服务器必须一致。可选参数，默认值为"/"
   */
  path: string
}

export interface IDsSettings {
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

export interface IQuicSettings {
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

export interface IBridgeObject {
  /**
   * 一个标识，所有由 bridge 发出的连接，都会带有这个标识。可以在 路由 中使用 inboundTag 进行识别。
   */
  tag: string
  /**
   * 一个域名。bridge 向 portal 建立的连接，都会使用这个域名进行发送。这个域名只作为 bridge 和 portal 的通信用途，不必真实存在。
   */
  domain: string
}

export interface IPortalObject {
  /**
   * portal 的标识。在 路由 中使用 outboundTag 将流量转发到这个 portal。
   */
  tag: string
  /**
   * 一个域名。当 portal 接收到流量时，如果流量的目标域名是此域名，则 portal 认为当前连接上 bridge 发来的通信连接。而其它流量则会被当成需要转发的流量。portal 所做的工作就是把这两类连接进行识别并拼接。
   */
  domain: string
}

export interface IReverseObject {
  /**
   * 一个数组，每一项表示一个 bridge。每个 bridge 的配置是一个 BridgeObject。
   */
  bridges: IBridgeObject[]
  /**
   * 一个数组，每一项表示一个 portal。每个 portal 的配置是一个 PortalObject。
   */
  portals: IPortalObject[]
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
   * 路由配置
   */
  routing?: IV2rayRouting
  /**
   * 本地策略可进行一些权限相关的配置
   */
  policy?: IV2rayPolicy
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
  /**
   * 当此项存在时，开启统计信息，目前无配置
   */
  stats?: {}
  /**
   * 反向代理配置
   */
  reverse?: IReverseObject
}
