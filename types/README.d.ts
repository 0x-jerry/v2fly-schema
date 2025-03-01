import type { LogObject } from './log'
import type { ApiObject } from './api'
import type { DnsObject } from './dns'
import type { RoutingObject } from './routing'
import type { PolicyObject } from './policy'
import type { InboundObject } from './inbound'
import type { OutboundObject } from './outbound'
import type { TransportObject } from './transport'
import type { StatsObject } from './stats'
import type { ReverseObject } from './reverse'
import type { FakeDnsObject } from './fakedns'
import type { metricsObject } from './metrics'
import type { ObservatoryObject } from './observatory'
import type { BurstObservatoryObject } from './observatory'
/**
 *
 **/
export interface V2FlyConfig {
  [key: string]: unknown
  /**
   * 日志配置，控制 Xray 输出日志的方式.
   **/
  log?: LogObject
  /**
   * 提供了一些 API 接口供远程调用。
   **/
  api?: ApiObject
  /**
   * 内置的 DNS 服务器. 如果没有配置此项，则使用系统的 DNS 设置。
   **/
  dns?: DnsObject
  /**
   * 路由功能。可以设置规则分流数据从不同的 outbound 发出.
   **/
  routing?: RoutingObject
  /**
   * 本地策略，可以设置不同的用户等级和对应的策略设置。
   **/
  policy?: PolicyObject
  /**
   * 一个数组，每个元素是一个入站连接配置。
   **/
  inbounds?: Array<InboundObject>
  /**
   * 一个数组，每个元素是一个出站连接配置。
   **/
  outbounds?: Array<OutboundObject>
  /**
   * 用于配置 Xray 其它服务器建立和使用网络连接的方式。
   **/
  transport?: TransportObject
  /**
   * 用于配置流量数据的统计。
   **/
  stats?: StatsObject
  /**
   * 反向代理。可以把服务器端的流量向客户端转发，即逆向流量转发。
   **/
  reverse?: ReverseObject
  /**
   * FakeDNS 配置。可配合透明代理使用，以获取实际域名。
   **/
  fakedns?: FakeDnsObject
  /**
   * metrics 配置。更直接（希望更好）的统计导出方式。
   **/
  metrics?: metricsObject
  /**
   * 后台连接观测。探测出站代理的连接状态。
   **/
  observatory?: ObservatoryObject
  /**
   * 并发连接观测。探测出站代理的连接状态。
   **/
  burstObservatory?: BurstObservatoryObject
}
