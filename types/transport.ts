/**
 **/
export interface TransportObject {
/**
**/
tcpSettings: TcpObject
/**
**/
kcpSettings: KcpObject
/**
**/
wsSettings: WebSocketObject
/**
**/
httpSettings: HttpObject
/**
**/
quicSettings: QuicObject
/**
**/
dsSettings: DomainSocketObject
/**
**/
grpcSettings: grpcObject
}
/**
 **/
export interface StreamSettingsObject {
/**
**/
network: "tcp" | "kcp" | "ws" | "http" | "domainsocket" | "quic" | "grpc"
/**
**/
security: "none" | "tls"
/**
**/
tlsSettings: TLSObject
/**
**/
tcpSettings: TcpObject
/**
**/
kcpSettings: KcpObject
/**
**/
wsSettings: WebSocketObject
/**
**/
httpSettings: HttpObject
/**
**/
quicSettings: QUICObject
/**
**/
dsSettings: DomainSocketObject
/**
**/
grpcSettings: grpcObject
/**
**/
sockopt: SockoptObject
}
/**
 **/
export interface TLSObject {
/**
**/
serverName: string
/**
**/
alpn: string[]
/**
**/
allowInsecure: true | false
/**
**/
disableSystemRoot: true | false
/**
**/
certificates: CertificateObject[]
/**
**/
pinnedPeerCertificateChainSha256: string[]
/**
**/
verifyClientCertificate: true | false
}
/**
 **/
export interface CertificateObject {
/**
**/
usage: "encipherment" | "verify" | "issue" | "verifyclient"
/**
**/
certificateFile: string
/**
**/
certificate: string[]
/**
**/
keyFile: string
/**
**/
key: string[]
}
/**
 **/
export interface SockoptObject {
/**
**/
mark: number
/**
**/
tcpFastOpen: true | false
/**
**/
tcpFastOpenQueueLength: number
/**
**/
tproxy: "redirect" | "tproxy" | "off"
/**
**/
tcpKeepAliveInterval: number
}