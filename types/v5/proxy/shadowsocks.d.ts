/**
  [Shadowsocks](https://shadowsocks.org) 协议，兼容大部分其它版本的实现。
inbound.shadowsocks
 **/
export interface Shadowsocks {
  [key: string]: any
/**
加密方式，可选值见[加密方式列表](#加密方式列表)。
**/
method?: string
/**
服务器认可的密码。Shadowsocks 协议不限制密码长度，但短密码会更可能被破解，建议使用 16 字符或更长的密码。
**/
password?: string
/**
可接收的网络连接类型，比如当指定为 `"tcp"` 时，Shadowsocks 入站仅会接收 TCP 流量。默认值为 `"tcp"`。
**/
networks?: "tcp" | "udp" | "tcp,udp"
/**
UDP 包编码方式，默认值为 `None`。
当该值为 `None` 时，UDP 将根据目标地址被映射 (Address and Port-Dependent Mapping)。
当该值为 `Packet` 时，UDP 将被端点独立映射 (Endpoint Independent Mapping)，此 UDP 行为也被称为 FullCone 或 NAT1。
outbound.shadowsocks
**/
packetEncoding?: Array<"None" | "Packet">
/**
服务器地址，支持 IP 地址或者域名。
**/
address?: string
/**
服务器端口号。
**/
port?: number
/**
加密方式，可选值见[加密方式列表](#加密方式列表)。
**/
method?: string
/**
服务器认可的密码。Shadowsocks 协议不限制密码长度，但短密码会更可能被破解，建议使用 16 字符或更长的密码。
* `"aes-256-gcm"`
* `"aes-128-gcm"`
* `"chacha20-poly1305"` 或 `"chacha20-ietf-poly1305"`
* `"none"` 或 `"plain"`
::: warning
"none" 不加密方式下，服务器端不会验证 "password" 中的密码。一般需要加上 TLS 并在传输层使用安全配置，例如 WebSocket 配置较长的 path
:::
**/
password?: string
}