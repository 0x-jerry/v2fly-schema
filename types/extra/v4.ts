// export * as blackhole from "./blackhole"
// export * as dns from "./dns"
// export * as dokodemo from "./dokodemo"
// export * as freedom from "./freedom"
// export * as http from "./http"
// export * as loopback from "./loopback"
// export * as shadowsocks from "./shadowsocks"
// export * as socks from "./socks"
// export * as trojan from "./trojan"
// export * as vless from "./vless"
// export * as vmess from "./vmess"
import {
	blackhole,
	dns,
	dokodemo,
	freedom,
	http,
	loopback,
	shadowsocks,
	socks,
	trojan,
	vless,
	vmess,
} from "../v4/protocols";

export type InboundConfigurationObject =
	| t<dokodemo.InboundConfigurationObject, "dokodemo-door">
	| t<http.InboundConfigurationObject, "http">
	| t<shadowsocks.InboundConfigurationObject, "shadowsocks">
	| t<socks.InboundConfigurationObject, "socks">
	| t<trojan.InboundConfigurationObject, "trojan">
	| t<vless.InboundConfigurationObject, "vless">
	| t<vmess.InboundConfigurationObject, "vmess">;

export type OutboundConfigurationObject =
	| t<blackhole.OutboundConfigurationObject, "blackhole">
	| t<dns.OutboundConfigurationObject, "dns">
	| t<freedom.OutboundConfigurationObject, "freedom">
	| t<http.OutboundConfigurationObject, "http">
	| t<loopback.OutboundConfigurationObject, "loopback">
	| t<shadowsocks.OutboundConfigurationObject, "shadowsocks">
	| t<socks.OutboundConfigurationObject, "socks">
	| t<trojan.OutboundConfigurationObject, "trojan">
	| t<vless.OutboundConfigurationObject, "vless">
	| t<vmess.OutboundConfigurationObject, "vmess">;

type t<T, Type extends string> = T & { _t?: Type };
