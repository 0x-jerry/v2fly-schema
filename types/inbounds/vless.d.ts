import type { FallbackObject } from '../features/fallback'
/**
 * ```json
 * {
 *   "clients": [
 *     {
 *       "id": "5783a3e7-e373-51cd-8642-c83782b807c5",
 *       "level": 0,
 *       "email": "love@xray.com",
 *       "flow": "xtls-rprx-vision"
 *     }
 *   ],
 *   "decryption": "none",
 *   "fallbacks": [
 *     {
 *       "dest": 80
 *     }
 *   ]
 * }
 * ```
 **/
export interface InboundConfigurationObject {
  [key: string]: unknown
  /**
   * 一个数组，代表一组服务端认可的用户.
   * 其中每一项是一个用户 [ClientObject](#clientobject)。
   **/
  clients?: Array<ClientObject>
  /**
   * 现阶段需要填 `"none"`，不能留空。
   * 若未正确设置 decryption 的值，使用 Xray 或 -test 时会收到错误信息。
   * 注意这里是 decryption，和 clients 同级。
   * decryption 和 vmess 协议的 encryption 的位置不同，是因为若套一层约定加密，服务端需要先解密才能知道是哪个用户。
   **/
  decryption?: 'none'
  /**
   * 一个数组，包含一系列强大的回落分流配置（可选）。
   * fallbacks 的具体配置请点击 [FallbackObject](../features/fallback.md#fallbacks-配置)
   **/
  fallbacks?: Array<FallbackObject>
}
/**
 * ```json
 * {
 *   "id": "5783a3e7-e373-51cd-8642-c83782b807c5",
 *   "level": 0,
 *   "email": "love@xray.com",
 *   "flow": "xtls-rprx-vision"
 * }
 * ```
 **/
export interface ClientObject {
  [key: string]: unknown
  /**
   * VLESS 的用户 ID，可以是任意小于 30 字节的字符串, 也可以是一个合法的 UUID.
   * 自定义字符串和其映射的 UUID 是等价的, 这意味着你将可以这样在配置文件中写 id 来标识同一用户,即
   * - 写 `"id": "我爱🍉老师1314"`,
   * - 或写 `"id": "5783a3e7-e373-51cd-8642-c83782b807c5"` (此 UUID 是 `我爱🍉老师1314` 的 UUID 映射)
   * 其映射标准在 [VLESS UUID 映射标准：将自定义字符串映射为一个 UUIDv5](https://github.com/XTLS/Xray-core/issues/158)
   * 你可以使用命令 `xray uuid -i "自定义字符串"` 生成自定义字符串所映射的的 UUID。
   **/
  id?: string
  /**
   * 用户等级，连接会使用这个用户等级对应的 [本地策略](../policy.md#levelpolicyobject)。
   * level 的值, 对应 [policy](../policy.md#policyobject) 中 `level` 的值。 如不指定, 默认为 0。
   **/
  level?: number
  /**
   * 用户邮箱，用于区分不同用户的流量（会体现在日志、统计中）。
   **/
  email?: string
  /**
   * 流控模式，用于选择 XTLS 的算法。
   * 目前入站协议中有以下流控模式可选：
   * - 无 `flow` 或者 空字符： 使用普通 TLS 代理
   * - `xtls-rprx-vision`：使用新 XTLS 模式 包含内层握手随机填充
   * 此外，目前 XTLS 仅支持 TCP+TLS/Reality
   **/
  flow?: string
}
