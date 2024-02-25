/**
 * Meek 是一个将请求编码为普通 HTTP 请求 / 回应的传输协议. 您可以使用任何支持转发 HTTP 请求的服务来转发 meek 连接。(v5.7.0+)
 * 这个传输协议的传输速度较低，适用于其他传输协议无法使用的情况。
 * * 名称: `meek`
 * * 类型: 传输协议
 * * ID: `stream.meek`
 **/
export interface Meek {
	[key: string]: any;
	/**
	 * 服务器地址链接。
	 **/
	url?: string;
}
