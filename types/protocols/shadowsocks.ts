/**
 **/
export interface InboundConfigurationObject {
/**
**/
email: string
/**
**/
method: string
/**
**/
password: string
/**
**/
level: number
/**
**/
network: "tcp" | "udp" | "tcp,udp"
/**
**/
ivCheck: true | false
}
/**
 **/
export interface OutboundConfigurationObject {
/**
**/
servers: ServerObject[]
}
/**
 **/
export interface ServerObject {
/**
**/
email: string
/**
**/
address: string
/**
**/
port: number
/**
**/
method: string
/**
**/
password: string
/**
**/
level: number
/**
**/
ivCheck: true | false
}