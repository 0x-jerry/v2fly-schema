/**
 **/
export interface DnsObject {
/**
**/
hosts: Record<string, string> | Record<string, string[]>
/**
**/
servers: string | ServerObject[]
/**
**/
clientIp: string
/**
**/
queryStrategy: "UseIP" | "UseIPv4" | "UseIPv6"
/**
**/
disableCache: boolean
/**
**/
disableFallback: boolean
/**
**/
disableFallbackIfMatch: boolean
/**
**/
tag: string
}
/**
 **/
export interface ServerObject {
/**
**/
address: string
/**
**/
port: number
/**
**/
clientIp: string
/**
**/
skipFallback: boolean
/**
**/
domains: string[]
/**
**/
expectIPs: string[]
}