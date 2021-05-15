import { IV2rayLog } from './log'
import { IV2rayAPI } from './api'
import { IV2rayDNS } from './dns'
import { IV2rayRouting } from './routing'
import { IV2rayPolicy } from './policy'
import { IV2RayInbound } from './inbound'
import { IV2RayOutbound } from './outbound'
import { IV2rayTransport } from './transport'
import { IReverseObject } from './reverse'

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
