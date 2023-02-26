/**
  * 名称：`loopback`
* 类型：出站协议
* 最低版本：v4.36.0+
Loopback 是一个出站协议，可使出站连接被重新路由。
 **/
export interface Loopback {

}
/**
  ```json
{
    "inboundTag": "reentry"
}
```
 **/
export interface OutboundConfigurationObject {
/**
匹配入站来源的标识。
**/
inboundTag: string
}