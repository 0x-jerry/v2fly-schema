/**
 **/
export interface RoutingObject {
/**
**/
domainStrategy: "AsIs" | "IPIfNonMatch" | "IPOnDemand"
/**
**/
domainMatcher: "linear" | "mph"
/**
**/
rules: RuleObject[]
/**
**/
balancers: BalancerObject[]
}
/**
 **/
export interface RuleObject {
/**
**/
domainMatcher: "linear" | "mph"
/**
**/
type: "field"
/**
**/
domains: string[]
/**
**/
ip: string[]
/**
**/
port: number | string
/**
**/
sourcePort: number | string
/**
**/
network: "tcp" | "udp" | "tcp,udp"
/**
**/
source: string[]
/**
**/
user: string[]
/**
**/
inboundTag: string[]
/**
**/
protocol: "http" | "tls" | "bittorrent"[]
/**
**/
attrs: string
/**
**/
outboundTag: string
/**
**/
balancerTag: string
}
/**
 **/
export interface BalancerObject {
/**
**/
tag: string
/**
**/
selector: string[]
/**
**/
strategy: StrategyObject
}
/**
 **/
export interface StrategyObject {
/**
**/
type: string
}