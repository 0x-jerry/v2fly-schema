/**
 * `DnsObject` 对应配置文件的 `dns` 项。
 * ```json
 * {
 *   "dns": {
 *     "hosts": {
 *       "baidu.com": "127.0.0.1",
 *       "dns.google": ["8.8.8.8", "8.8.4.4"]
 *     },
 *     "servers": [
 *       "8.8.8.8",
 *       "8.8.4.4",
 *       {
 *         "address": "1.2.3.4",
 *         "port": 5353,
 *         "domains": ["domain:xray.com"],
 *         "expectIPs": ["geoip:cn"],
 *         "skipFallback": false,
 *         "clientIP": "1.2.3.4"
 *       },
 *       {
 *         "address": "https://8.8.8.8/dns-query",
 *         "domains": [
 *           "geosite:netflix"
 *         ],
 *         "skipFallback": true,
 *         "queryStrategy": "UseIPv4"
 *       },
 *       {
 *         "address": "https://1.1.1.1/dns-query",
 *         "domains": [
 *           "geosite:openai"
 *         ],
 *         "skipFallback": true,
 *         "queryStrategy": "UseIPv6"
 *       },
 *       "localhost"
 *     ],
 *     "clientIp": "1.2.3.4",
 *     "queryStrategy": "UseIP",
 *     "disableCache": false,
 *     "disableFallback": false,
 *     "disableFallbackIfMatch": false,
 *     "tag": "dns_inbound"
 *   }
 * }
 * ```
 **/
export interface DnsObject {
  [key: string]: unknown
  /**
   * 静态 IP 列表，其值为一系列的 "域名": "地址" 或 "域名": ["地址 1","地址 2"]。其中地址可以是 IP 或者域名。在解析域名时，如果域名匹配这个列表中的某一项:
   * - 当该项的地址为 IP 时，则解析结果为该项的 IP
   * - 当该项的地址为域名时，会使用此域名进行 IP 解析，而不使用原始域名。
   * - 当地址中同时设置了多个 IP 和域名，则只会返回第一个域名，其余 IP 和域名均被忽略。
   * 域名的格式有以下几种形式：
   * - 纯字符串：当此字符串完整匹配目标域名时，该规则生效。例如 "xray.com" 匹配 "xray.com"，但不匹配 "www.xray.com"。
   * - 正则表达式：由 `"regexp:"` 开始，余下部分是一个正则表达式。当此正则表达式匹配目标域名时，该规则生效。例如 "regexp:\\\\.goo.\*\\\\.com\$" 匹配 "www.google.com"、"fonts.googleapis.com"，但不匹配 "google.com"。
   * - 子域名 (推荐)：由 `"domain:"` 开始，余下部分是一个域名。当此域名是目标域名或其子域名时，该规则生效。例如 "domain:xray.com" 匹配 "www.xray.com" 与 "xray.com"，但不匹配 "wxray.com"。
   * - 子串：由 `"keyword:"` 开始，余下部分是一个字符串。当此字符串匹配目标域名中任意部分，该规则生效。比如 "keyword:sina.com" 可以匹配 "sina.com"、"sina.com.cn" 和 "www.sina.com"，但不匹配 "sina.cn"。
   * - 预定义域名列表：由 `"geosite:"` 开头，余下部分是一个名称，如 `geosite:google` 或者 `geosite:cn`。名称及域名列表参考 [预定义域名列表](./routing.md#预定义域名列表)。
   **/
  hosts?: Record<string, string> | Record<string, Array<string>>
  /**
   * 一个 DNS 服务器列表，支持的类型有两种：DNS 地址（字符串形式）和 [DnsServerObject](#dnsserverobject) 。
   * 当值为 `"localhost"` 时，表示使用本机预设的 DNS 配置。
   * 当它的值是一个 DNS `"IP:Port"` 地址时，如 `"8.8.8.8:53"`，Xray 会使用此地址的指定 UDP 端口进行 DNS 查询。该查询遵循路由规则。不指定端口时，默认使用 53 端口。
   * 当值是 `"tcp://host:port"` 的形式，如 `"tcp://8.8.8.8:53"`，Xray 会使用 `DNS over TCP` 进行查询。该查询遵循路由规则。不指定端口时，默认使用 53 端口。
   * 当值是 `"tcp+local://host:port"` 的形式，如 `"tcp+local://8.8.8.8:53"`，Xray 会使用 `TCP 本地模式 (TCPL)` 进行查询。即 DNS 请求不会经过路由组件，直接通过 Freedom outbound 对外请求，以降低耗时。不指定端口时，默认使用 53 端口。
   * 当值是 `"https://host:port/dns-query"` 的形式，如 `"https://dns.google/dns-query"`，Xray 会使用 `DNS over HTTPS` (RFC8484, 简称 DOH) 进行查询。有些服务商拥有 IP 别名的证书，可以直接写 IP 形式，比如 `https://1.1.1.1/dns-query`。也可使用非标准端口和路径，如 `"https://a.b.c.d:8443/my-dns-query"`
   * 当值是 `"h2c://host:port/dns-query"` 的形式，如 `"h2c://dns.google/dns-query"`，Xray 会使用  `DNS over HTTPS` 的请求格式但是将会以明文 h2c 发出请求，不能直接使用，在这种情况下需要自行配置 Freedom 出站 + streamSettings 设置 TLS 为其配置 TLS 以包装成正常的 DOH 请求。用于特殊目的，比如想要自定义 DOH 请求的 SNI 或者使用 utls 的指纹时使用
   * 当值是 `"https+local://host:port/dns-query"` 的形式，如 `"https+local://dns.google/dns-query"`，Xray 会使用 `DOH 本地模式 (DOHL)` 进行查询，即 DOH 请求不会经过路由组件，直接通过 Freedom outbound 对外请求，以降低耗时。一般适合在服务端使用。也可使用非标端口和路径。
   * 当值是 `"quic+local://host"` 的形式，如 `"quic+local://dns.adguard.com"`，Xray 会使用 `DNS over QUIC 本地模式 (DOQL)` 进行查询，即 DNS 请求不会经过路由组件，直接通过 Freedom outbound 对外请求。该方式需要 DNS 服务器支持 DNS over QUIC。默认使用 853 端口进行查询，可以使用非标端口。
   * 当值是 `fakedns` 时，将使用 FakeDNS 功能进行查询。
   * ::: tip TIP 1
   * 当使用 `localhost` 时，本机的 DNS 请求不受 Xray 控制，需要额外的配置才可以使 DNS 请求由 Xray 转发。
   * :::
   * ::: tip TIP 2
   * 不同规则初始化得到的 DNS 客户端会在 Xray 启动日志中以 `info` 级别体现，比如 `local DOH`、`remote DOH` 和 `udp` 等模式。
   * :::
   * ::: tip TIP 3
   * (v1.4.0+) 可以在 [日志](./log.md) 中打开 DNS 查询日志。
   * :::
   **/
  servers?: Array<string | DnsServerObject>
  /**
   * 用于 DNS 查询时通知服务器以指定 IP 位置。不能是私有地址。
   * ::: tip TIP 1
   * 需要 DNS 服务器支持 EDNS Client Subnet。
   * :::
   * ::: tip TIP 2
   * 可以在 [DnsObject](#dnsobject) 为所有 DNS 服务器指定 clientIp, 也可在每个 DNS 服务器配置的 [DnsServerObject](#dnsserverobject) 为此 DNS 服务器指定 clientIp （优先级高于 [DnsObject](#dnsobject) 的配置）。
   * :::
   **/
  clientIp?: string
  /**
   * 默认值 `UseIP` 同时查询 A 和 AAAA 记录。`UseIPv4` 只查询 A 记录；`UseIPv6` 只查询 AAAA 记录。
   * Xray-core v1.8.6 新增功能：`queryStrategy` 可以在每一项 `DNS` 服务器中分别设置。
   * ```json
   *     "dns": {
   *         "servers": [
   *             "https://1.1.1.1/dns-query",
   *             {
   *                 "address": "https://8.8.8.8/dns-query",
   *                 "domains": [
   *                     "geosite:netflix"
   *                 ],
   *                 "skipFallback": true,
   *                 "queryStrategy": "UseIPv4" // netflix 的域名查询 A 记录
   *             },
   *             {
   *                 "address": "https://1.1.1.1/dns-query",
   *                 "domains": [
   *                     "geosite:openai"
   *                 ],
   *                 "skipFallback": true,
   *                 "queryStrategy": "UseIPv6" // openai 的域名查询 AAAA 记录
   *             }
   *         ],
   *         "queryStrategy": "UseIP" // 全局同时查询 A 和 AAAA 记录
   *     }
   * ```
   * ::: tip TIP 1
   * 全局 `"queryStrategy"` 值优先，当子项中的 `"queryStrategy"` 值与全局 `"queryStrategy"` 值冲突时，子项的查询将空响应。
   * :::
   * ::: tip TIP 2
   * 当子项中不写 `"queryStrategy"` 参数时，使用全局 `"queryStrategy"` 参数值。与 Xray-core v1.8.6 以前版本行为相同。
   * :::
   * 例如：<br>
   * 全局 `"queryStrategy": "UseIPv6"` 与 子项 `"queryStrategy": "UseIPv4"` 冲突。<br>
   * 全局 `"queryStrategy": "UseIPv4"` 与 子项 `"queryStrategy": "UseIPv6"` 冲突。<br>
   * 全局 `"queryStrategy": "UseIP"` 与 子项 `"queryStrategy": "UseIPv6"` 不冲突。<br>
   * 全局 `"queryStrategy": "UseIP"` 与 子项 `"queryStrategy": "UseIPv4"` 不冲突。
   * ```json
   *     "dns": {
   *         "servers": [
   *             "https://1.1.1.1/dns-query",
   *             {
   *                 "address": "https://8.8.8.8/dns-query",
   *                 "domains": [
   *                     "geosite:netflix"
   *                 ],
   *                 "skipFallback": true,
   *                 "queryStrategy": "UseIPv6" // 全局 "UseIPv4" 与 子项 "UseIPv6" 冲突
   *             }
   *         ],
   *         "queryStrategy": "UseIPv4"
   *     }
   * ```
   * 子项 netflix 的域名查询由于 `"queryStrategy"` 值冲突，得到空响应。netflix 的域名由 `https://1.1.1.1/dns-query` 查询，得到 A 记录。
   **/
  queryStrategy?: 'UseIP' | 'UseIPv4' | 'UseIPv6'
  /**
   * `true` 禁用 DNS 缓存，默认为 `false`，即不禁用。
   **/
  disableCache?: true | false
  /**
   * `true` 禁用 DNS 的 fallback 查询，默认为 `false`，即不禁用。
   **/
  disableFallback?: true | false
  /**
   * `true` 当 DNS 服务器的优先匹配域名列表命中时，禁用 fallback 查询，默认为 `false`，即不禁用。
   **/
  disableFallbackIfMatch?: true | false
  /**
   * 由内置 DNS 发出的查询流量，除 `localhost`、`fakedns`、`TCPL`、`DOHL` 和 `DOQL` 模式外，都可以用此标识在路由使用 `inboundTag` 进行匹配。
   **/
  tag?: string
}
/**
 * ```json
 * {
 *   "address": "1.2.3.4",
 *   "port": 5353,
 *   "domains": ["domain:xray.com"],
 *   "expectIPs": ["geoip:cn"],
 *   "skipFallback": false,
 *   "clientIP": "1.2.3.4"
 * }
 * ```
 **/
export interface DnsServerObject {
  [key: string]: unknown
  /**
   * 一个 DNS 服务器列表，支持的类型有两种：DNS 地址（字符串形式）和 DnsServerObject 。
   * 当值为 `"localhost"` 时，表示使用本机预设的 DNS 配置。
   * 当它的值是一个 DNS `"IP"` 地址时，如 `"8.8.8.8"`，Xray 会使用此地址的指定 UDP 端口进行 DNS 查询。该查询遵循路由规则。默认使用 53 端口。
   * 当值是 `"tcp://host"` 的形式，如 `"tcp://8.8.8.8"`，Xray 会使用 `DNS over TCP` 进行查询。该查询遵循路由规则。默认使用 53 端口。
   * 当值是 `"tcp+local://host"` 的形式，如 `"tcp+local://8.8.8.8"`，Xray 会使用 `TCP 本地模式 (TCPL)` 进行查询。即 DNS 请求不会经过路由组件，直接通过 Freedom outbound 对外请求，以降低耗时。不指定端口时，默认使用 53 端口。
   * 当值是 `"https://host:port/dns-query"` 的形式，如 `"https://dns.google/dns-query"`，Xray 会使用 `DNS over HTTPS` (RFC8484, 简称 DOH) 进行查询。有些服务商拥有 IP 别名的证书，可以直接写 IP 形式，比如 `https://1.1.1.1/dns-query`。也可使用非标准端口和路径，如 `"https://a.b.c.d:8443/my-dns-query"`
   * 当值是 `"https+local://host:port/dns-query"` 的形式，如 `"https+local://dns.google/dns-query"`，Xray 会使用 `DOH 本地模式 (DOHL)` 进行查询，即 DOH 请求不会经过路由组件，直接通过 Freedom outbound 对外请求，以降低耗时。一般适合在服务端使用。也可使用非标端口和路径。
   * 当值是 `"quic+local://host:port"` 的形式，如 `"quic+local://dns.adguard.com"`，Xray 会使用 `DOQ 本地模式 (DOQL)` 进行查询，即 DNS 请求不会经过路由组件，直接通过 Freedom outbound 对外请求。该方式需要 DNS 服务器支持 DNS over QUIC。默认使用 853 端口进行查询，可以使用非标端口。
   * 当值是 `fakedns` 时，将使用 FakeDNS 功能进行查询。
   * ::: tip 关于 local 模式和 DNS 服务器本身的域名
   * 由 DNS 模块发出的 DNS 请求有两种情况
   * local 模式将直接由核心向外连接，这种情况下如果地址是一个域名将交由系统本身进行解析，逻辑较为简单
   * 非 local 默认将视为一个从 tag 为 dns.tag(不知道在哪？ 浏览器 ctrl+f 搜索 `inboundTag`) 的入站进来的请求，将经过正常的核心处理流程，可能会被路由模块分配去本地 freedom 或者其他远端出站，它将被 freedom 的 domainStrategy解析(注意可能的回环) 或者直接以域名的形式被传送到远端根据服务端本身的解析方式解析。
   * 由于普通人可能难以理清其中的逻辑，建议(特别是在透明代理的环境下)，直接在 DNS 模块的 host 选项中直接为带域名的服务器设置它们对应的 IP 防止出现回环。
   * 顺便 DNS 模块非 local 模式发出的 DNS 请求将会自动在路由模块中跳过 IPIfNonMatch 和 IPOnDemand 的解析过程，防止它们的解析会被送回 DNS 模块导致回环。
   * :::
   **/
  address?: string
  /**
   * DNS 服务器端口，如 `53`。此项缺省时默认为 `53`。当使用 DOH、DOHL、DOQL 模式时该项无效，非标端口应在 URL 中指定。
   **/
  port?: number
  /**
   * 一个域名列表，此列表包含的域名，将优先使用此服务器进行查询。域名格式和 [路由配置](./routing.md#ruleobject) 中相同。
   **/
  domains?: Array<string>
  /**
   * 一个 IP 范围列表，格式和 [路由配置](./routing.md#ruleobject) 中相同。
   * 当配置此项时，Xray DNS 会对返回的 IP 的进行校验，只返回包含 expectIPs 列表中的地址。
   * 如果未配置此项，会原样返回 IP 地址。
   **/
  expectIPs?: Array<string>
  /**
   * `true`，在进行 DNS fallback 查询时将跳过此服务器, 默认为 `false`，即不跳过。
   **/
  skipFallback?: true | false
}
