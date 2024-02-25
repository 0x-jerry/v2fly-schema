/**
 * inbound.http
 * :::tip
 * 虽然 HTTP 入站可以用于提供公共服务，但 HTTP 协议没有对传输加密，不适宜在公网中传输。HTTP 入站更有意义的用法是在局域网或本机环境下监听，为其他程序提供本地服务。
 * :::
 * outbound.http
 **/
export interface HTTP {
	[key: string]: any;
	/**
	 * 服务器地址。
	 **/
	address?: string;
	/**
	 * 服务器端口。
	 **/
	port?: number;
	/**
	 * 在服务器回复前发送连接数据。 (v5.6.0+)
	 **/
	h1SkipWaitForReply?: boolean;
}
