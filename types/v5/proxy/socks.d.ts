/**
 * 标准 Socks 协议实现。
 * :::warning
 * 如果你将 Socks5 代理在不安全的网络环境中分享给其他人使用，建议搭配防火墙使用。
 * Rfc: [SOCKS 5 的认证在使用 UDP 时可被绕过](https://github.com/v2fly/v2fly-github-io/issues/104)
 * :::
 * inbound.socks
 **/
export interface Socks {
	[key: string]: any;
	/**
	 * SOCKS5 通过 UDP ASSOCIATE 命令建立 UDP 会话。服务端在对客户端发来的该命令的回复中，指定客户端发包的目标地址。默认值为空。
	 * 若此项为空，对于通过本地回环 IPv4/IPv6 连接的客户端，回复对应的回环 IPv4/IPv6 地址；对于非本机的客户端，回复当前入站的监听地址。
	 * 你可以通过配置此项使 V2Ray 固定回复你配置的地址。如果你不知道此项的作用，留空即可。
	 **/
	address?: string;
	/**
	 * 是否开启 UDP 协议的支持。默认值为 `false`。
	 **/
	udpEnabled?: true | false;
	/**
	 * UDP 包编码方式，默认值为 `None`。
	 * 当该值为 `None` 时，UDP 将根据目标地址被映射 (Address and Port-Dependent Mapping)。
	 * 当该值为 `Packet` 时，UDP 将被端点独立映射 (Endpoint Independent Mapping)，此 UDP 行为也被称为 FullCone 或 NAT1。
	 * outbound.socks
	 **/
	packetEncoding?: Array<"None" | "Packet">;
	/**
	 * 服务器地址。
	 * :::tip
	 * 仅支持连接到 Socks 5 服务器。
	 * :::
	 **/
	address?: string;
	/**
	 * 服务器端口。
	 **/
	port?: number;
}
