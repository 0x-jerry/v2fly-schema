/**
 * <Badge text="v1.4.1+" type="warning"/>
 * 根据浏览器的需求，对 early data 机制进行了如下调整：
 * - 服务端响应头会带有请求的 `Sec-WebSocket-Protocol`，这也初步混淆了 WSS 握手响应的长度特征。
 * - 用于浏览器的 early data 编码是 `base64.RawURLEncoding` 而不是 `StdEncoding`，服务端做了兼容。
 * - 此外，由于 [Xray-core#375](https://github.com/XTLS/Xray-core/pull/375) 推荐 `?ed=2048`，这个 PR 顺便将服务端一处 `MaxHeaderBytes` 扩至了 4096。 ~~（虽然好像不改也没问题）~~
 **/
export interface WebSocket {
	[key: string]: unkown;
}
/**
 * <Badge text="v1.8.19+" type="warning"/>
 * SplitHTTP 本身支持 QUIC，如果想使用浏览器自己的 QUIC 网络栈，Chrome 可以在 `chrome://flags` 中设定。其它浏览器也有相关选项。
 * 原理上说 `tlsSettings` 项会被忽略，使用哪个 HTTP 版本将完全由浏览器决定。
 **/
export interface SplitHTTP {
	[key: string]: unkown;
}
