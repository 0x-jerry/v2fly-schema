/**
 **/
export interface InboundConfigurationObject {
/**
**/
timeout: number
/**
**/
accounts: AccountObject[]
/**
**/
allowTransparent: true | false
/**
**/
userLevel: number
}
/**
 **/
export interface AccountObject {
/**
**/
user: string
/**
**/
pass: string
}
/**
 **/
export interface OutboundConfigurationObject {
/**
**/
servers: any
/**
**/
address: string
/**
**/
port: number
/**
**/
user: AccountObject[]
}