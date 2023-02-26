/**
 **/
export interface InboundConfigurationObject {
/**
**/
address: string
/**
**/
port: number
/**
**/
network: "tcp" | "udp" | "tcp,udp"
/**
**/
timeout: number
/**
**/
followRedirect: true | false
/**
**/
userLevel: number
}