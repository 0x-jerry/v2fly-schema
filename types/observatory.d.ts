/**
 * ```json
 * {
 *   "subjectSelector":[
 *     "outbound"
 *   ],
 *   "probeUrl": "https://www.google.com/generate_204",
 *   "probeInterval": "10s",
 *   "enableConcurrency": false
 * }
 * ```
 **/
export interface ObservatoryObject {
  [key: string]: unknown
  /**
   * 一个字符串数组，其中每一个字符串将用于和出站代理标识的前缀匹配。在以下几个出站代理标识中：`[ "a", "ab", "c", "ba" ]`，`"subjectSelector": ["a"]` 将匹配到 `[ "a", "ab" ]`。
   **/
  subjectSelector?: Array<string>
  /**
   * 用于探测出站代理连接状态的网址。
   **/
  probeUrl?: string
  /**
   * 发起探测的间隔。时间格式为数字 + 单位，比如 `"10s"`, `"2h45m"`，支持的时间单位有 `ns`, `us`, `ms`, `s`, `m`, `h`， 分别对应纳秒、微秒、毫秒、秒、分、时。
   **/
  probeInterval?: string
  /**
   * - `true` 并发探测全部匹配的出站代理，全部完成后暂停 `probeInterval` 设定的时间。
   * - `false` 逐个探测匹配的出站代理，每探测一个出站代理后暂停 `probeInterval` 设定的时间。
   **/
  enableConcurrency?: true | false
}
/**
 * ```json
 * {
 *   "subjectSelector":[
 *     "outbound"
 *   ],
 *   "pingConfig": {}
 * }
 * ```
 **/
export interface BurstObservatoryObject {
  [key: string]: unknown
  /**
   * 一个字符串数组，其中每一个字符串将用于和出站代理标识的前缀匹配。在以下几个出站代理标识中：`[ "a", "ab", "c", "ba" ]`，`"subjectSelector": ["a"]` 将匹配到 `[ "a", "ab" ]`。
   **/
  subjectSelector?: Array<string>
  /**
   *
   **/
  pingConfig?: PingConfigObject
}
/**
 * ```json
 * {
 *   "destination": "https://connectivitycheck.gstatic.com/generate_204",
 *   "connectivity": "",
 *   "interval": "1h",
 *   "sampling": 3,
 *   "timeout": "30s"
 * }
 * ```
 **/
export interface PingConfigObject {
  [key: string]: unknown
  /**
   * 用于探测出站代理连接状态的网址。这个网址应该返回 HTTP 204 成功状态码。
   **/
  destination?: string
  /**
   * 用于检测本地网络连通性的网址。空字符串表示不检测本地网络连通性。
   **/
  connectivity?: string
  /**
   * 在指定时间内探测全部匹配的出站代理，每个出站代理探测 sampling + 1 次。时间格式为数字 + 单位，比如 `"10s"`, `"2h45m"`，支持的时间单位有 `ns`, `us`, `ms`, `s`, `m`, `h`， 分别对应纳秒、微秒、毫秒、秒、分、时。
   **/
  interval?: string
  /**
   * 保留最近探测结果的数量。
   **/
  sampling?: number
  /**
   * 探测超时时间。格式和上面的 `interval` 相同。
   **/
  timeout?: string
}
