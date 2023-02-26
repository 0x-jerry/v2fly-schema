/**
 **/
export interface PolicyObject {
/**
**/
level: Record<string, LevelPolicyObject>
/**
**/
system: SystemPolicyObject
}
/**
 **/
export interface LevelPolicyObject {
/**
**/
handshake: number
/**
**/
connIdle: number
/**
**/
uplinkOnly: number
/**
**/
downlinkOnly: number
/**
**/
statsUserUplink: true | false
/**
**/
statsUserDownlink: true | false
/**
**/
bufferSize: number
}
/**
 **/
export interface SystemPolicyObject {
/**
**/
statsInboundUplink: true | false
/**
**/
statsInboundDownlink: true | false
/**
**/
statsOutboundUplink: true | false
/**
**/
statsOutboundDownlink: true | false
}