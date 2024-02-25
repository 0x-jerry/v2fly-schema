/**
 *
 **/
export interface SubscriptionImportObject {
	[key: string]: any;
	/**
	 * 订阅源名称
	 **/
	name?: string;
	/**
	 * 订阅源的地址：
	 * 目前有两种收到支持的发地址
	 * - HTTP(S) 地址 : 通过 HTTP(S) 即  「超文本传输协议」或 「超文本传输安全协议」下载订阅文档。
	 * - DataURL : 链接本身即为订阅文档。文档类型需为 "application/vnd.v2ray.subscription-singular" 才会被接受。
	 **/
	url?: string;
	/**
	 * 创建的订阅的出站实例前缀。
	 **/
	tagPrefix?: string;
	/**
	 * 指定下载订阅文档的出站代理标志。
	 **/
	importUsingTag?: string;
	/**
	 * 默认的订阅过期时间。
	 * 英语文档中包含更多细节。
	 **/
	defaultExpireSeconds?: number;
}
