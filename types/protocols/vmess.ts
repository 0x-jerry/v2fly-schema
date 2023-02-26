/**
 **/
export interface OutboundConfigurationObject {
/**
**/
vnext: ServerObject[]
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
id: string
/**
**/
alterId: number
/**
**/
level: number
/**
**/
security: "aes-128-gcm" | "chacha20-poly1305" | "auto" | "none" | "zero"
/**
**/
experiments: string
}
/**
 **/
export interface InboundConfigurationObject {
/**
**/
clients: ClientObject[]
/**
**/
detour: DetourObject
/**
**/
default: DefaultObject
/**
**/
disableInsecureEncryption: true | false
}
/**
 **/
export interface ClientObject {
/**
**/
id: string
/**
**/
level: number
/**
**/
alterId: number
/**
**/
email: string
}
/**
 **/
export interface DetourObject {
/**
**/
to: string
}
/**
 **/
export interface DefaultObject {
/**
**/
level: number
/**
**/
alterId: number
}