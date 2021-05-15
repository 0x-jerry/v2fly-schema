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

interface IRoutingRule {
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

interface IBalancerObject {
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
