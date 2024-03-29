/**
 * outbound.dns
 * DNS 是一个出站协议，主要用于拦截和转发 DNS 查询。此出站协议只能接收 DNS 流量（包含基于 UDP 和 TCP 协议的查询），其它类型的流量会导致错误。
 * 在处理 DNS 查询时，此出站协议会将 IP 查询（即 A 和 AAAA）转发给内置的 [DNS 服务器](../dns.md)。其它类型的查询流量将被转发至它们原本的目标地址。
 **/
export interface DNS {
	[key: string]: any;
}
