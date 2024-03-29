/**
 * QUIC 全称 Quick UDP Internet Connection，是由 Google 提出的使用 UDP 进行多路并发传输的协议。其主要优势是:
 * 1. 减少了握手的延迟（1-RTT 或 0-RTT）
 * 2. 多路复用，并且没有 TCP 的阻塞问题
 * 3. 连接迁移，（主要是在客户端）当由 Wifi 转移到 4G 时，连接不会被断开。
 * V2Ray 4.7:
 * * 开始支持 QUIC。
 * * 默认设定:
 *   * 12 字节的 Connection ID
 *   * 30 秒没有数据通过时自动断开连接 (可能会影响一些长连接的使用)
 **/
export interface QUIC {
	[key: string]: any;
}
/**
 * `QuicObject` 对应传输配置的 `quicSettings` 项。对接的两端的配置必须完全一致，否则连接失败。QUIC 强制要求开启 TLS，在传输配置中没有开启 TLS 时，V2Ray 会自行签发一个证书进行 TLS 通讯。在使用 QUIC 传输时，可以关闭 VMess 的加密。
 * ```json
 * {
 *     "security": "none",
 *     "key": "",
 *     "header": {
 *         "type": "none"
 *     }
 * }
 * ```
 **/
export interface QuicObject {
	[key: string]: any;
	/**
	 * 加密方式。默认值为不加密。
	 * 此加密是对 QUIC 数据包的加密，加密后数据包无法被探测。
	 **/
	security?: "none" | "aes-128-gcm" | "chacha20-poly1305";
	/**
	 * 加密时所用的密钥。可以是任意字符串。当 `security` 不为 `"none"` 时有效。
	 **/
	key?: string;
	/**
	 * 数据包头部伪装设置
	 **/
	header?: HeaderObject;
}
/**
 * ```json
 * {
 *     "type": "none"
 * }
 * ```
 **/
export interface HeaderObject {
	[key: string]: any;
	/**
	 * 伪装类型，可选的值有：
	 * * `"none"`：默认值，不进行伪装。
	 * * `"srtp"`：伪装成 SRTP 数据包，会被识别为视频通话数据（如 FaceTime）。
	 * * `"utp"`：伪装成 uTP 数据包，会被识别为 BT 下载数据。
	 * * `"wechat-video"`：伪装成微信视频通话的数据包。
	 * * `"dtls"`：伪装成 DTLS 1.2 数据包。
	 * * `"wireguard"`：伪装成 WireGuard 数据包。（并不是真正的 WireGuard 协议）
	 * :::tip
	 * 当加密和伪装都不启用时，数据包即为原始的 QUIC 数据包，可以与其它的 QUIC 工具对接。为了避免被探测，建议加密或伪装至少开启一项。
	 * :::
	 **/
	type?: string;
}
