/**
 **/
export interface OutboundConfigurationObject {
/**
**/
servers: ServerObject[]
/**
**/
version: "5" | "4a" | "4"
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
users: UserObject[]
}
/**
 **/
export interface UserObject {
/**
**/
user: string
/**
**/
pass: string
/**
**/
level: number
}
/**
 **/
export interface InboundConfigurationObject {
/**
**/
auth: "noauth" | "password"
/**
**/
accounts: AccountObject[]
/**
**/
udp: true | false
/**
**/
ip: string
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