/**
 * 连接协议名称
 */
export enum V2RayProtocol {
  BLACKHOLE = 'blackhole',
  VLESS = 'vless',
  DNS = 'dns',
  DOKODEMO_DOOR = 'dokodemo-door',
  FREEDOM = 'freedom',
  HTTP = 'http',
  MTPROTO = 'mtproto',
  SHADOWSOCKS = 'shadowsocks',
  SOCKS = 'socks',
  VMESS = 'vmess',
  TROJAN = 'trojan',
}

export enum IVmessSecurity {
  /**
   * 推荐在 PC 上使用
   */
  AES_128_GCM = 'aes-128-gcm',
  /**
   * 推荐在手机端使用
   */
  CHACHA20_POLY1305 = 'chacha20-poly1305',
  /**
   * 默认值，自动选择（运行框架为 AMD64、ARM64 或 s390x 时为 aes-128-gcm 加密方式，其他情况则为 Chacha20-Poly1305 加密方式）
   */
  AUTO = 'auto',
  /**
   * 不加密
   */
  NONE = 'none',
}

export enum ShadowSocksMethod {
  AES_256_GCM = 'aes-256-gcm',
  AES_128_GCM = 'aes-128-gcm',
  CHACHA20_POLY1305 = 'chacha20-poly1305',
  CHACHA20_IETF_POLY1305 = 'chacha20-ietf-poly1305',
  NODE = 'none',
  PLAIN = 'plain',
}

export enum HeaderObjectType {
  /**
   *  默认值，不进行伪装，发送的数据是没有特征的数据包
   */
  NONE = 'none',
  /**
   * 伪装成 SRTP 数据包，会被识别为视频通话数据（如 FaceTime）
   */
  SRTP = 'srtp',
  /**
   * 伪装成 uTP 数据包，会被识别为 BT 下载数据
   */
  UTP = 'utp',
  /**
   * 伪装成微信视频通话的数据包
   */
  WECHAT_VIDEO = 'wechat-video',
  /**
   * 伪装成 DTLS 1.2 数据包
   */
  DTLS = 'dtls',
  /**
   * 伪装成 WireGuard 数据包。(并不是真正的 WireGuard 协议)
   */
  WIREGUARD = 'wireguard',
}

export interface ICertificateObject {
  /**
   * - "encipherment"：证书用于 TLS 认证和加密。
   * - "verify"：证书用于验证远端 TLS 的证书。当使用此项时，当前证书必须为 CA 证书。
   * - "issue"：证书用于签发其它证书。当使用此项时，当前证书必须为 CA 证书。
   */
  usage?: 'encipherment' | 'verify' | 'issue'
  /**
   * 证书文件路径，如使用 OpenSSL 生成，后缀名为 .crt。
   */
  certificateFile?: string
  /**
   * 密钥文件路径，如使用 OpenSSL 生成，后缀名为 .key。目前暂不支持需要密码的 key 文件。
   */
  keyFile?: string
  /**
   * 一个字符串数组，表示证书内容，格式如样例所示。certificate 和 certificateFile 二者选一。
   */
  certificate?: string[]
  /**
   * 一个字符串数组，表示密钥内容，格式如样例如示。key 和 keyFile 二者选一。
   *
   * 当 certificateFile 和 certificate 同时指定时，V2Ray 优先使用 certificateFile。keyFile 和 key 也一样。
   */
  key?: string[]
}

export interface IHttpAccountObject {
  /**
   * 用户名，字符串类型。必填
   */
  user?: string
  /**
   * 密码，字符串类型。必填
   */
  pass?: string
}

export interface IMTProtoAccount {
  /**
   * 用户邮箱，用于统计流量等辅助功能
   */
  email?: string
  /**
   * 用户等级
   */
  level?: number
  /**
   * 用户密钥。必须为 32 个字符，仅可包含0到9和a到f之间的字符
   */
  secret?: string
}

export interface IVmessAccount {
  [key: string]: any
  /**
   * VMess 的用户 ID。必须是一个合法的 UUID
   */
  id?: string
  /**
   * 用户等级
   */
  level?: number
  /**
   * 为了进一步防止被探测，一个用户可以在主 ID 的基础上，再额外生成多个 ID。这里只需要指定额外的 ID 的数量，推荐值为 4。不指定的话，默认值是 0。最大值 65535。这个值不能超过服务器端所指定的值
   */
  alterId?: number
  /**
   * 用户邮箱地址，用于区分不同用户的流量
   */
  email?: string
}

export interface IVLESSAccountObject {
  /**
   * VLESS 的用户 ID，必须是一个合法的 UUID，你也可以用 V2Ctl 生成它。
   */
  id: string
  /**
   * 用户等级，详见 本地策略。
   */
  level: number
  /**
   * 用户邮箱，用于区分不同用户的流量（日志、统计）。
   */
  email: string
}

export interface ITrojanAccountObject {
  /**
   * 必填，任意字符串。
   */
  password: string
  /**
   * 邮件地址，可选，用于标识用户
   */
  email?: string
  /**
   * 用户等级，默认值为 0。详见 本地策略。
   */
  level?: number
}

export interface ISocksAccountObject {
  /**
   * 用户名
   */
  user: string
  /**
   * 密码
   */
  pass: string
  /**
   * 用户等级
   */
  level?: number
}

export interface IVmessServerAccountObject {
  /**
   * VMess 用户的主 ID。必须是一个合法的 UUID
   */
  id?: string
  /**
   * 为了进一步防止被探测，一个用户可以在主 ID 的基础上，再额外生成多个 ID。这里只需要指定额外的 ID 的数量，推荐值为 4。不指定的话，默认值是 0。最大值 65535。这个值不能超过服务器端所指定的值
   */
  alterId?: number
  /**
   * 加密方式，客户端将使用配置的加密方式发送数据，服务器端自动识别，无需配置
   */
  security?: IVmessSecurity
  /**
   * 用户等级
   */
  level?: number
}

export interface IHttpAccountObject {
  /**
   * 用户名，字符串类型。必填
   */
  user?: string
  /**
   * 密码，字符串类型。必填
   */
  pass?: string
}
