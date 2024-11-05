/**
 * [VMess](../../development/protocols/vmess.md) 是一个加密传输协议，通常作为 Xray 客户端和服务器之间的桥梁。
 * ::: danger
 * VMess 依赖于系统时间，请确保使用 Xray 的系统 UTC 时间误差在 120 秒之内，时区无关。在 Linux 系统中可以安装`ntp`服务来自动同步系统时间。
 * :::
 **/
export interface VMess {
	[key: string]: unkown;
}
/**
 * ```json
 * {
 *   "clients": [
 *     {
 *       "id": "5783a3e7-e373-51cd-8642-c83782b807c5",
 *       "level": 0,
 *       "email": "love@xray.com"
 *     }
 *   ],
 *   "default": {
 *     "level": 0
 *   },
 *   "detour": {
 *     "to": "tag_to_detour"
 *   }
 * }
 * ```
 **/
export interface InboundConfigurationObject {
	[key: string]: unkown;
	/**
	 * 一个数组，代表一组服务端认可的用户.
	 * 其中每一项是一个用户[ClientObject](#clientobject)。
	 * 当此配置用作动态端口时，Xray 会自动创建用户。
	 **/
	clients?: Array<ClientObject>;
	/**
	 * 指示对应的出站协议使用另一个服务器。
	 **/
	detour?: DetourObject;
	/**
	 * 可选，clients 的默认配置。仅在配合`detour`时有效。
	 **/
	default?: DefaultObject;
}
/**
 * ```json
 * {
 *   "id": "5783a3e7-e373-51cd-8642-c83782b807c5",
 *   "level": 0,
 *   "email": "love@xray.com"
 * }
 * ```
 **/
export interface ClientObject {
	[key: string]: unkown;
	/**
	 * Vmess 的用户 ID，可以是任意小于 30 字节的字符串, 也可以是一个合法的 UUID.
	 * ::: tip
	 * 自定义字符串和其映射的 UUID 是等价的, 这意味着你将可以这样在配置文件中写 id 来标识同一用户,即
	 * - 写 `"id": "我爱🍉老师1314"`,
	 * - 或写 `"id": "5783a3e7-e373-51cd-8642-c83782b807c5"` (此 UUID 是 `我爱🍉老师1314` 的 UUID 映射)
	 *   :::
	 * 其映射标准在 [VLESS UUID 映射标准：将自定义字符串映射为一个 UUIDv5](https://github.com/XTLS/Xray-core/issues/158)
	 * 你可以使用命令 `xray uuid -i "自定义字符串"` 生成自定义字符串所映射的的 UUID。
	 **/
	id?: string;
	/**
	 * 用户等级，连接会使用这个用户等级对应的 [本地策略](../policy.md#levelpolicyobject)。
	 * level 的值, 对应 [policy](../policy.md#policyobject) 中 `level` 的值。 如不指定, 默认为 0。
	 **/
	level?: number;
	/**
	 * 用户邮箱地址，用于区分不同用户的流量。
	 **/
	email?: string;
}
/**
 * ```json
 * {
 *   "to": "tag_to_detour"
 * }
 * ```
 **/
export interface DetourObject {
	[key: string]: unkown;
	/**
	 * 一个 inbound 的`tag`, 指定的 inbound 的必须是使用 VMess 协议的 inbound.
	 **/
	to?: string;
}
/**
 * ```json
 * {
 *   "level": 0
 * }
 * ```
 **/
export interface DefaultObject {
	[key: string]: unkown;
	/**
	 * 用户等级，连接会使用这个用户等级对应的 [本地策略](../policy.md#levelpolicyobject)。
	 * level 的值, 对应 [policy](../policy.md#policyobject) 中 `level` 的值。 如不指定, 默认为 0。
	 **/
	level?: number;
}
