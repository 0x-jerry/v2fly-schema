import { StreamObject } from "./stream";
/**
 * outbound
 * 出站连接用于向远程网站或下一级代理服务器发送数据，可用的协议请见协议列表。
 * ```json
 * {
 *   "protocol": "vmess",
 *   "settings": {},
 *   "sendThrough": "1.2.3.4",
 *   "tag": "demo",
 *   "streamSettings": {},
 *   "proxySettings": {},
 *   "mux": {
 *     "enabled": false,
 *     "concurrency": 8
 *   }
 * }
 * ```
 **/
export interface Outbounds {
	[key: string]: any;
	/**
	 * 出站协议名称。
	 **/
	protocol?: any;
	/**
	 * 出站协议设置。
	 **/
	settings?: any;
	/**
	 * 用于发送数据的 IP 地址，当主机有多个 IP 地址时有效，默认值为 `"0.0.0.0"`。
	 **/
	sendThrough?: string;
	/**
	 * 此出站连接的标识，用于在其它的配置中定位此连接。当其值不为空时，必须在所有 tag 中唯一。
	 **/
	tag?: string;
	/**
	 * 底层传输配置。
	 **/
	streamSettings?: StreamObject;
	/**
	 * 出站代理配置。当出站代理生效时。
	 **/
	proxySettings?: ProxyObject;
	/**
	 * Mux 配置。
	 **/
	mux?: MuxObject;
	/**
	 * 控制如何如何处理传出连接中的域名. (v5.12.0+)
	 * - "AsIs" : 让操作系统来解析。
	 * - "UseIP" : 使用内置 dns 解析它，并使用结果中的任意 IP 地址。
	 * - "UseIP4" : 使用内置 dns 解析它，并使用结果中的任意 IPv4 地址。
	 * - "UseIP6" : 使用内置 dns 解析它，并使用结果中的任意 IPv6 地址。
	 * * [SOCKS](proxy/socks.md)
	 * * [VMess](proxy/vmess.md)
	 * * [VLite](proxy/vlite.md)
	 * * [Shadowsocks](proxy/shadowsocks.md)
	 * * [Shadowsocks2022](proxy/shadowsocks2022.md)
	 * * [Freedom](proxy/freedom.md)
	 * * [Loopback](proxy/loopback.md)
	 * * [Blackhole](proxy/blackhole.md)
	 * * [DNS](proxy/dns.md)
	 * * [Trojan](proxy/trojan.md)
	 * * [VLESS](proxy/vless.md)
	 **/
	domainStrategy?: Array<"AsIs" | "UseIP" | "UseIP4" | "UseIP6" | "">;
}
/**
 * ```json
 * {
 *     "tag": "another-outbound-tag",
 *     "transportLayer": false
 * }
 * ```
 **/
export interface ProxyObject {
	[key: string]: any;
	/**
	 * 当指定另一个出站连接的标识时，此出站连接发出的数据，将被转发至所指定的出站连接发出。
	 **/
	tag?: string;
	/**
	 * 是否启用传输层转发支持。在启用后,此出站连接的传输层协议将保持生效（如果传输层协议支持）。
	 * 如果不启用此选项, 在转发时传输层协议将失效，只能使用默认的 TCP 传输协议。
	 **/
	transportLayer?: true | false;
}
/**
 * Mux 功能实现了在一条 TCP 连接上分发多条 TCP 连接的数据。协议细节详见 [Mux.Cool](../../developer/protocols/muxcool.md)。
 * ```json
 * {
 *     "enabled": false,
 *     "concurrency": 8
 * }
 * ```
 **/
export interface MuxObject {
	[key: string]: any;
	/**
	 * 是否启用 Mux，默认值为 `false`。
	 **/
	enabled?: true | false;
	/**
	 * 最大并发连接数。最小值 `1`，最大值 `1024`，默认值 `8`。
	 * 如果填负数，如 `-1`，则不加载 Mux 模块。
	 * 此数值表示了一个 TCP 连接上最多承载的 Mux 连接数量。当客户端发出了 8 个 TCP 请求，而 `concurrency=8` 时，V2Ray 只会发出一条实际的连接，客户端的 8 个请求全部由这条连接传输。
	 **/
	concurrency?: number;
}
