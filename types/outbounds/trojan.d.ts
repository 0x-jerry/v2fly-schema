/**
 * [Trojan](https://trojan-gfw.github.io/trojan/protocol) 协议
 * ::: danger
 * Trojan 被设计工作在正确配置的加密 TLS 隧道
 * :::
 **/
export interface Trojan {
	[key: string]: unkown;
}
/**
 * ```json
 * {
 *   "servers": [
 *     {
 *       "address": "127.0.0.1",
 *       "port": 1234,
 *       "password": "password",
 *       "email": "love@xray.com",
 *       "level": 0
 *     }
 *   ]
 * }
 * ```
 **/
export interface OutboundConfigurationObject {
	[key: string]: unkown;
	/**
	 * 一个数组，其中每一项是一个 [ServerObject](#serverobject)。
	 **/
	servers?: Array<ServerObject>;
}
/**
 * ```json
 * {
 *   "address": "127.0.0.1",
 *   "port": 1234,
 *   "password": "password",
 *   "email": "love@xray.com",
 *   "level": 0
 * }
 * ```
 **/
export interface ServerObject {
	[key: string]: unkown;
	/**
	 * 服务端地址，支持 IPv4、IPv6 和域名。必填。
	 **/
	address?: string;
	/**
	 * 服务端端口，通常与服务端监听的端口相同。
	 **/
	port?: number;
	/**
	 * 密码. 必填，任意字符串。
	 **/
	password?: string;
	/**
	 * 邮件地址，可选，用于标识用户
	 **/
	email?: string;
	/**
	 * 用户等级，连接会使用这个用户等级对应的 [本地策略](../policy.md#levelpolicyobject)。
	 * level 的值, 对应 [policy](../policy.md#policyobject) 中 `level` 的值。 如不指定, 默认为 0。
	 **/
	level?: number;
}
