/**
 * 标准 Socks 协议实现，兼容 [Socks 4](http://ftp.icm.edu.pl/packages/socks/socks4/SOCKS4.protocol)、[Socks 4a](https://ftp.icm.edu.pl/packages/socks/socks4/SOCKS4A.protocol) Socks 5, 以及 **HTTP**。
 * ::: danger
 * **Socks 协议没有对传输加密，不适宜经公网中传输**
 * :::
 * `Socks` 入站更有意义的用法是在局域网或本机环境下监听，为其他程序提供本地服务。
 **/
export interface Socks {
	[key: string]: unkown;
}
/**
 * ```json
 * {
 *   "auth": "noauth",
 *   "accounts": [
 *     {
 *       "user": "my-username",
 *       "pass": "my-password"
 *     }
 *   ],
 *   "udp": false,
 *   "ip": "127.0.0.1",
 *   "userLevel": 0
 * }
 * ```
 **/
export interface InboundConfigurationObject {
	[key: string]: unkown;
	/**
	 * Socks 协议的认证方式，支持 `"noauth"` 匿名方式和 `"password"` 用户密码方式。
	 * 当使用 password 时，发往入站的HTTP请求也会要求同样的账号密码。
	 * 默认值为 `"noauth"`。
	 **/
	auth?: "noauth" | "password";
	/**
	 * 一个数组，数组中每个元素为一个用户帐号。
	 * 此选项仅当 `auth` 为 `password` 时有效。
	 * 默认值为空。
	 **/
	accounts?: Array<AccountObject>;
	/**
	 * 是否开启 UDP 协议的支持。
	 * 默认值为 `false`。
	 **/
	udp?: true | false;
	/**
	 * 当开启 UDP 时，Xray 需要知道本机的 IP 地址。
	 * 默认值为 `"127.0.0.1"`。
	 **/
	ip?: string;
	/**
	 * 用户等级，连接会使用这个用户等级对应的 [本地策略](../policy.md#levelpolicyobject)。
	 * userLevel 的值, 对应 [policy](../policy.md#policyobject) 中 `level` 的值。 如不指定, 默认为 0。
	 **/
	userLevel?: number;
}
/**
 * ```json
 * {
 *   "user": "my-username",
 *   "pass": "my-password"
 * }
 * ```
 **/
export interface AccountObject {
	[key: string]: unkown;
	/**
	 * 用户名，字符串类型。必填。
	 **/
	user?: string;
	/**
	 * 密码，字符串类型。必填。
	 **/
	pass?: string;
}
