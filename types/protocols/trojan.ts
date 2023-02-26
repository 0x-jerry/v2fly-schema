/**
 **/
export interface InboundConfigurationObject {
/**
**/
clients: ClientObject[]
/**
**/
fallbacks: FallbackObject[]
}
/**
 **/
export interface ClientObject {
/**
**/
password: string
/**
**/
email: string
/**
**/
level: number
}
/**
 **/
export interface FallbackObject {

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
address: string
/**
**/
port: number
/**
**/
password: string
/**
**/
email: string
/**
**/
level: number
}