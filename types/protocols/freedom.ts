/**
 **/
export interface OutboundConfigurationObject {
/**
**/
domainStrategy: "AsIs" | "UseIP" | "UseIPv4" | "UseIPv6"
/**
**/
redirect: string
/**
**/
userLevel: number
}