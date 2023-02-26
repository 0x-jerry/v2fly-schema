/**
 **/
export interface QuicObject {
/**
**/
security: "none" | "aes-128-gcm" | "chacha20-poly1305"
/**
**/
key: string
/**
**/
header: HeaderObject
}
/**
 **/
export interface HeaderObject {
/**
**/
type: string
}