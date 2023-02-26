/**
 **/
export interface V2FlyConfig {
/**
**/
log: LogObject
/**
**/
api: ApiObject
/**
**/
dns: DnsObject
/**
**/
routing: RoutingObject
/**
**/
policy: PolicyObject
/**
**/
inbounds: InboundObject[]
/**
**/
outbounds: OutboundObject[]
/**
**/
transport: TransportObject
/**
**/
stats: StatsObject
/**
**/
reverse: ReverseObject
/**
**/
fakedns: FakeDnsObject[]
/**
**/
browserForwarder: BrowserForwarderObject
/**
**/
observatory: ObservatoryObject
}
/**
 **/
export interface LogObject {
/**
**/
access: string
/**
**/
error: string
/**
**/
loglevel: "debug" | "info" | "warning" | "error" | "none"
}