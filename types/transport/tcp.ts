/**
 **/
export interface TcpObject {
/**
**/
acceptProxyProtocol: true | false
/**
**/
header: NoneHeaderObject | HttpHeaderObject
}
/**
 **/
export interface NoneHeaderObject {
/**
**/
type: "none"
}
/**
 **/
export interface HttpHeaderObject {
/**
**/
type: "http"
/**
**/
request: HTTPRequestObject
/**
**/
response: HTTPResponseObject
}
/**
 **/
export interface HTTPRequestObject {
/**
**/
version: string
/**
**/
method: string
/**
**/
path: string[]
/**
**/
headers: Record<string, string[]>
}
/**
 **/
export interface HTTPResponseObject {
/**
**/
version: string
/**
**/
status: string
/**
**/
reason: string
/**
**/
headers: Record<string, string[]>
}