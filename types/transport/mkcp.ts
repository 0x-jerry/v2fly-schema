/**
 **/
export interface KcpObject {
/**
**/
mtu: number
/**
**/
tti: number
/**
**/
uplinkCapacity: number
/**
**/
downlinkCapacity: number
/**
**/
congestion: true | false
/**
**/
readBufferSize: number
/**
**/
writeBufferSize: number
/**
**/
header: HeaderObject
/**
**/
seed: string
}
/**
 **/
export interface HeaderObject {
/**
**/
type: string
}