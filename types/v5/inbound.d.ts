import { StreamObject } from "./stream";
/**
 * inbound
 * ```json
 * {
 *   "protocol":"vmess",
 *   "settings":{},
 *   "port":"",
 *   "listen":"",
 *   "tag":"",
 *   "sniffing":{},
 *   "streamSettings":{}
 * }
 * ```
 **/
export interface Inbounds {
	[key: string]: any;
	/**
	 * 入站协议名称。
	 **/
	protocol?: any;
	/**
	 * 入站协议设置。
	 **/
	settings?: any;
	/**
	 * 接受的格式如下:
	 * * 整型数值：实际的端口号。
	 * * 字符串：可以是一个数值类型的字符串，如 `"1234"`；或者一个数值范围，如 `"5-10"` 表示端口 5 到端口 10，这 6 个端口。
	 **/
	port?: string;
	/**
	 * 监听地址，只允许 IP 地址，默认值为 `"0.0.0.0"`，表示接收所有网卡上的连接。除此之外，必须指定一个现有网卡的地址。
	 * v4.32.0+，支持填写 Unix domain socket，格式为绝对路径，形如 `"/dev/shm/domain.socket"`，可在开头加 `"@"` 代表 [abstract](https://www.man7.org/linux/man-pages/man7/unix.7.html)，`"@@"` 则代表带 padding 的 abstract。
	 * 填写 Unix domain socket 时，`port` 将被忽略，协议暂时可选 VLESS、VMess、Trojan，传输方式可选 TCP、WebSocket、HTTP/2。
	 * 对于常规（非 abstract）Unix domain socket，支持添加访问权限，格式为 `"/dev/shm/domain.socket,0666"`。即在路径后面加上逗号和八进制数（代表权限），权限的设定方式与类 Unix 系统的 `chmod` 命令相同。（v5.9.0+）
	 **/
	listen?: string;
	/**
	 * 此入站连接的标识，用于在其它的配置中定位此连接。当其不为空时，其值必须在所有 `tag` 中唯一。
	 **/
	tag?: string;
	/**
	 * 入站连接的流量探测设置。流量探测允许路由根据连接的内容和元数据转发连接。
	 **/
	sniffing?: SniffingObject;
	/**
	 * 底层传输配置。
	 * * [SOCKS](proxy/socks.md)
	 * * [VMess](proxy/vmess.md)
	 * * [VLite](proxy/vlite.md)
	 * * [Shadowsocks](proxy/shadowsocks.md)
	 * * [HTTP](proxy/http.md)
	 * * [Dokodemo](proxy/dokodemo.md)
	 * * [Trojan](proxy/trojan.md)
	 * * [VLESS](proxy/vless.md)
	 **/
	streamSettings?: StreamObject;
}
/**
 *
 **/
export interface SniffingObject {
	[key: string]: any;
	/**
	 * 是否开启流量探测。
	 **/
	enabled?: true | false;
	/**
	 * 当流量为指定类型时，按其中包括的目标地址重置当前连接的目标。
	 * `fakedns+others` 选项会优先进行 FakeDNS 虚拟 DNS 服务器匹配。如果 IP 地址处于虚拟 DNS 服务器的 IP 地址区间内，但是没有找到相应的域名记录时，使用 `http`、`tls` 的匹配结果。此选项仅在 `metadataOnly` 为 `false` 时有效。
	 **/
	destOverride?: Array<"http" | "tls" | "quic" | "fakedns" | "fakedns+others">;
	/**
	 * 是否仅使用元数据推断目标地址而不截取流量内容。只有元数据流量目标侦测模块会被激活。
	 * 如果关闭仅使用元数据推断目标地址，客户端必须先发送数据，代理服务器才会实际建立连接。此行为与需要服务器首先发起第一个消息的协议如 SMTP 协议不兼容。
	 **/
	metadataOnly?: true | false;
}
