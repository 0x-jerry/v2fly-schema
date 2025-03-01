/**
 * `ReverseObject` 对应配置文件的 `reverse` 项。
 * ```jsonc
 * {
 *   "reverse": {
 *     "bridges": [
 *       {
 *         "tag": "bridge",
 *         "domain": "reverse-proxy.xray.internal"
 *       }
 *     ],
 *     "portals": [
 *       {
 *         "tag": "portal",
 *         "domain": "reverse-proxy.xray.internal"
 *       }
 *     ]
 *   }
 * }
 * ```
 **/
export interface ReverseObject {
  [key: string]: unknown
  /**
   * 数组，每一项表示一个 `bridge`。每个 `bridge` 的配置是一个 [BridgeObject](#bridgeobject)。
   **/
  bridges?: Array<BridgeObject>
  /**
   * 数组，每一项表示一个 `portal`。每个 `portal` 的配置是一个 [PortalObject](#bridgeobject)。
   **/
  portals?: Array<PortalObject>
}
/**
 * ```jsonc
 * {
 *   "tag": "bridge",
 *   "domain": "reverse-proxy.xray.internal"
 * }
 * ```
 **/
export interface BridgeObject {
  [key: string]: unknown
  /**
   * 所有由 `bridge` 发出的连接，都会带有这个标识。可以在 [路由配置](./routing.md) 中使用 `inboundTag` 进行识别。
   **/
  tag?: string
  /**
   * 指定一个域名，`bridge` 向 `portal` 建立的连接，都会借助这个域名进行发送。
   * 这个域名只作为 `bridge` 和 `portal` 的通信用途，不必真实存在。
   **/
  domain?: string
}
/**
 * ```jsonc
 * {
 *   "tag": "portal",
 *   "domain": "reverse-proxy.xray.internal"
 * }
 * ```
 **/
export interface PortalObject {
  [key: string]: unknown
  /**
   * `portal` 的标识。在 [路由配置](./routing.md) 中使用 `outboundTag` 将流量转发到这个 `portal`。
   **/
  tag?: string
  /**
   * 一个域名。当 `portal` 接收到流量时，如果流量的目标域名是此域名，则 `portal` 认为当前连接上是 `bridge` 发来的通信连接。而其它流量则会被当成需要转发的流量。`portal` 所做的工作就是把这两类连接进行识别并做对应的转发。
   * ::: tip
   * 一个 Xray 既可以作为 `bridge`，也可以作为 `portal`，也可以同时两者，以适用于不同的场景需要。
   * :::
   * ::: tip
   * 在运行过程中，建议先启用 `bridge`，再启用 `portal`。
   * :::
   * `bridge` 通常需要两个 outbound，一个用于连接 `portal`，另一个用于发送实际的流量。也就是说，你需要用路由区分两种流量。
   * 反向代理配置:
   * ```jsonc
   * "reverse": {
   *   "bridges": [
   *     {
   *       "tag": "bridge",
   *       "domain": "reverse-proxy.xray.internal"
   *     }
   *   ]
   * }
   * ```
   * outbound:
   * ```jsonc
   * {
   *   // 转发到网页服务器
   *   "tag": "out",
   *   "protocol": "freedom",
   *   "settings": {
   *     "redirect": "127.0.0.1:80"
   *   }
   * }
   * ```
   * ```jsonc
   * {
   *   // 连接到 portal
   *   "protocol": "vmess",
   *   "settings": {
   *     "vnext": [
   *       {
   *         "address": "portal 的 IP 地址",
   *         "port": 1024,
   *         "users": [
   *           {
   *             "id": "5783a3e7-e373-51cd-8642-c83782b807c5"
   *           }
   *         ]
   *       }
   *     ]
   *   },
   *   "tag": "interconn"
   * }
   * ```
   * 路由配置:
   * ```jsonc
   * {
   *   "rules": [
   *     {
   *       // bridge 发出的请求，且域名为配置的域名，那么说明这是尝试向 portal 建立反向隧道的请求，
   *       // 则路由到 interconn，即连接到 portal
   *       "type": "field",
   *       "inboundTag": ["bridge"],
   *       "domain": ["full:reverse-proxy.xray.internal"],
   *       "outboundTag": "interconn"
   *     },
   *     {
   *       // 从 portal 过来的流量，也会从 bridge 出来，但是不带上面的domain
   *       // 则路由到 out，即转发给网页服务器
   *       "type": "field",
   *       "inboundTag": ["bridge"],
   *       "outboundTag": "out"
   *     }
   *   ]
   * }
   * ```
   * `portal` 通常需要两个 inbound，一个用于接收 `bridge` 的连接，另一个用于接收实际的流量。同时你也需要用路由区分两种流量。
   * 反向代理配置:
   * ```jsonc
   * "reverse": {
   *   "portals": [
   *     {
   *       "tag": "portal",
   *       "domain": "reverse-proxy.xray.internal" // 必须和 bridge 的配置一样
   *     }
   *   ]
   * }
   * ```
   * inbound:
   * ```jsonc
   * {
   *   // 直接接收来自公网的请求
   *   "tag": "external",
   *   "port": 80,
   *   "protocol": "dokodemo-door",
   *   "settings": {
   *     "address": "127.0.0.1",
   *     "port": 80,
   *     "network": "tcp"
   *   }
   * }
   * ```
   * ```jsonc
   * {
   *   // 接收来自 bridge 尝试建立反向隧道的请求
   *   "tag": "interconn",
   *   "port": 1024,
   *   "protocol": "vmess",
   *   "settings": {
   *     "clients": [
   *       {
   *         "id": "5783a3e7-e373-51cd-8642-c83782b807c5"
   *       }
   *     ]
   *   }
   * }
   * ```
   * 路由配置:
   * ```jsonc
   * {
   *   "rules": [
   *     {
   *       // 如果入站是 external，说明是来自公网的请求，
   *       // 则路由到 portal, 最终会转发给 bridge
   *       "type": "field",
   *       "inboundTag": ["external"],
   *       "outboundTag": "portal"
   *     },
   *     {
   *       // 如果来自 interconn 入站，说明是来自 bridge 的尝试建立反向隧道请求，
   *       // 则路由到 portal, 最终会转发给对应的公网客户端
   *       // 注意：这里进入的请求会带上了前文配置的domain，所以 portal 能够区分两种被路由到 portal 的请求
   *       "type": "field",
   *       "inboundTag": ["interconn"],
   *       "outboundTag": "portal"
   *     }
   *   ]
   * }
   * ```
   **/
  domain?: string
}
