import { SniffingObject } from "../inbound/";
/**
 * * 名称 : `tun`
 * * 类型 : 服务
 * * ID: `service.tun`
 * Tun 是一个接受网络层数据包的服务，输入进入操作系统 tun 接口的数据包会被转换为一般数据流被传出代理处理。 (v5.9.0+)
 * 您可以参考 [pull request](https://github.com/v2fly/v2ray-core/pull/2541) 中的示例。
 * 目前仅支持 amd64 以及 arm64 架构下的 Linux 操作系统.
 **/
export interface Tun {
	[key: string]: any;
}
/**
 *
 **/
export interface Tun {
	[key: string]: any;
	/**
	 * tun 网络适配器的名字。
	 **/
	name?: string;
	/**
	 * tun 网络适配器的最大传输单元。建议设置为 1500.
	 **/
	mtu?: number;
	/**
	 * 生成的流量的入站流量标签。
	 **/
	tag?: string;
	/**
	 * tun 网络适配器的 IP 地址段。建议设置为私有地址段。
	 **/
	ips?: Array<IPObject>;
	/**
	 * tun 网络适配器的路由表。建议设置为 `0.0.0.0/0` 和 `::/0` 以路由所有进入 tun 网络适配器的数据包。
	 **/
	routes?: Array<RouteObject>;
	/**
	 * 是否开启混杂模式。建议设置为 `true`。
	 **/
	enablePromiscuousMode?: boolean;
	/**
	 * 是否开启 IP 欺骗。建议设置为 `true`。
	 **/
	enableSpoofing?: boolean;
	/**
	 * UDP 包的编码方式，默认为 `None`。
	 **/
	packetEncoding?: Array<"None" | "Packet">;
	/**
	 * tun 入站连接的流量探测设置。流量探测允许路由根据连接的内容和元数据转发连接。（v5.11.0+）
	 **/
	sniffingSettings?: SniffingObject;
}
/**
 *
 **/
export interface IPObject {
	[key: string]: any;
	/**
	 *
	 **/
	ip?: Array<number>;
	/**
	 *
	 **/
	prefix?: number;
}
/**
 *
 **/
export interface RouteObject {
	[key: string]: any;
	/**
	 *
	 **/
	ip?: Array<number>;
	/**
	 *
	 **/
	prefix?: number;
}
