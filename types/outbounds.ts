/**
 **/
export interface OutboundObject {
/**
**/
sendThrough: string
/**
**/
protocol: string
/**
**/
settings: OutboundConfigurationObject
/**
**/
tag: string
/**
**/
streamSettings: StreamSettingsObject
/**
**/
proxySettings: ProxySettingsObject
/**
**/
mux: MuxObject
}
/**
 **/
export interface ProxySettingsObject {
/**
**/
tag: string
/**
**/
transportLayer: true | false
}
/**
 **/
export interface MuxObject {
/**
**/
enabled: true | false
/**
**/
concurrency: number
}