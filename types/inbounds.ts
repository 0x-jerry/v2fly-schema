/**
 **/
export interface InboundObject {
/**
**/
listen: string
/**
**/
port: number | "env:variable" | string
/**
**/
protocol: string
/**
**/
settings: InboundConfigurationObject
/**
**/
streamSettings: StreamSettingsObject
/**
**/
tag: string
/**
**/
sniffing: SniffingObject
/**
**/
allocate: AllocateObject
}
/**
 **/
export interface SniffingObject {
/**
**/
enabled: true | false
/**
**/
destOverride: "http" | "tls" | "quic" | "fakedns" | "fakedns+others"[]
/**
**/
metadataOnly: true | false
}
/**
 **/
export interface AllocateObject {
/**
**/
strategy: "always" | "random"
/**
**/
refresh: number
/**
**/
concurrency: number
}