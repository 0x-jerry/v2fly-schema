/**
  
 **/
export interface PingConfigObject {
  [key: string]: any
/**
Ping destination URL. It should return 204 on success.
**/
destination?: string
/**
Connectivity check URL.
**/
connectivity?: string
/**
发起健康检查的事件间隔, 时间格式为数字+单位，比如`"10s"`, `"2h45m"`，支持的时间单位有 `ns`, `us`, `ms`, `s`, `m`, `h`， 分别对应纳秒、微秒、毫秒、秒、分、时。
**/
interval?: number
/**
保留的最近 Ping 结果的数量。
**/
samplingCount?: number
/**
Ping 超时时间, 时间格式为数字+单位，比如`"10s"`, `"2h45m"`。
**/
timeout?: number
}