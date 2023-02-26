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
encryption: "none"
/**
**/
level: number
}
/**
 **/
export interface InboundConfigurationObject {
/**
**/
clients: ClientObject[]
/**
**/
decryption: "none"
/**
**/
fallbacks: FallbackObject[]
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
email: string
}
/**
 **/
export interface FallbackObject {
/**
**/
alpn: string
/**
**/
path: string
/**
**/
dest: string | number
/**
**/
xver: number
}