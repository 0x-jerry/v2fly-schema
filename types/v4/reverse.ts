/**
  `ReverseObject` 对应配置文件的 `reverse` 项。
```json
{
    "bridges": [
        {
            "tag": "bridge",
            "domain": "test.v2fly.org"
        }
    ],
    "portals": [
        {
            "tag": "portal",
            "domain": "test.v2fly.org"
        }
    ]
}
```
 **/
export interface ReverseObject {
/**
一个数组，每一项表示一个 `bridge`。每个 `bridge` 的配置是一个 [BridgeObject](#bridgeobject)。
**/
bridges: BridgeObject[]
/**
一个数组，每一项表示一个 `portal`。每个 `portal` 的配置是一个 [PortalObject](#bridgeobject)。
**/
portals: PortalObject[]
}
/**
  ```json
{
    "tag": "bridge",
    "domain": "test.v2fly.org"
}
```
 **/
export interface BridgeObject {
/**
一个标识，所有由 `bridge` 发出的连接，都会带有这个标识。可以在 [路由](routing.md) 中使用 `inboundTag` 进行识别。
**/
tag: string
/**
一个域名。`bridge` 向 `portal` 建立的连接，都会使用这个域名进行发送。这个域名只作为 `bridge` 和 `portal` 的通信用途，不必真实存在。
**/
domain: string
}
/**
  ```json
{
    "tag": "portal",
    "domain": "test.v2fly.org"
}
```
 **/
export interface PortalObject {
/**
`portal` 的标识。在 [路由](routing.md) 中使用 `outboundTag` 将流量转发到这个 `portal`。
**/
tag: string
/**
一个域名。当 `portal` 接收到流量时，如果流量的目标域名是此域名，则 `portal` 认为当前连接上 `bridge` 发来的通信连接。而其它流量则会被当成需要转发的流量。`portal` 所做的工作就是把这两类连接进行识别并拼接。
:::tip
和其它配置一样，一个 V2Ray 既可以作为 `bridge`，也可以作为 `portal`，也可以同时两者，以适用于不同的场景需要。
:::
`bridge` 通常需要两个出站代理，一个用于连接 `portal`，另一个用于发送实际的流量。也就是说，你需要用路由区分两种流量。
反向代理配置:
```json
{
    "bridges": [
        {
            "tag": "bridge",
            "domain": "test.v2fly.org"
        }
    ]
}
```
出站代理:
```json
{
    "tag": "out",
    "protocol": "freedom",
    "settings": {
        "redirect": "127.0.0.1:80" // 将所有流量转发到网页服务器
    }
},
{
    "protocol": "vmess",
    "settings": {
        "vnext": [
            {
                "address": "portal 的 IP 地址",
                "port": 1024,
                "users": [
                    {
                        "id": "27848739-7e62-4138-9fd3-098a63964b6b"
                    }
                ]
            }
        ]
    },
    "tag": "interconn"
}
```
路由配置:
```json
"routing": {
    "rules": [
        {
            "type": "field",
            "inboundTag": [
                "bridge"
            ],
            "domain": [
                "full:test.v2fly.org"
            ],
            "outboundTag": "interconn"
        },
        {
            "type": "field",
            "inboundTag": [
                "bridge"
            ],
            "outboundTag": "out"
        }
    ]
}
```
`portal` 通常需要两个入站代理，一个用于接收 `bridge` 的连接，另一个用于接收实际的流量。同时你也需要用路由区分两种流量。
反向代理配置:
```json
{
    "portals": [
        {
            "tag": "portal",
            "domain": "test.v2fly.org" // 必须和 bridge 的配置一样
        }
    ]
}
```
入站代理:
```json
{
    "tag": "external",
    "port": 80, // 开放 80 端口，用于接收外部的 HTTP 访问
    "protocol": "dokodemo-door",
    "settings": {
        "address": "127.0.0.1",
        "port": 80,
        "network": "tcp"
    }
},
{
    "port": 1024, // 用于接收 bridge 的连接
    "tag": "interconn",
    "protocol": "vmess",
    "settings": {
        "clients": [
            {
                "id": "27848739-7e62-4138-9fd3-098a63964b6b"
            }
        ]
    }
}
```
路由配置:
```json
"routing": {
    "rules": [
        {
            "type": "field",
            "inboundTag": [
                "external"
            ],
            "outboundTag": "portal"
        },
        {
            "type": "field",
            "inboundTag": [
                "interconn"
            ],
            "outboundTag": "portal"
        }
    ]
}
```
:::tip
在运行过程中，建议先启用 `bridge`，再启用 `portal`。
:::
**/
domain: string
}