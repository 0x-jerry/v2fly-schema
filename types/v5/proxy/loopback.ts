/**
  Loopback 是一个出站协议，可使出站连接被重新路由。
outbound.loopback
 **/
export interface Loopback {
/**
匹配入站来源的标识。
**/
inboundTag: string
}