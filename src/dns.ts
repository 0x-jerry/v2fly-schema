interface DNSServerObject {
  /**
   * DNS 服务器地址，如"8.8.8.8"。目前只支持 UDP 协议的 DNS 服务器
   */
  address?: string
  /**
   * DNS 服务器端口，如53
   */
  port?: number
  /**
   * 一个域名列表，此列表包含的域名，将优先使用此服务器进行查询。域名格式和路由配置中相同
   */
  domains?: string[]
  /**
   * （V2Ray 4.22.0+）一个 IP 范围列表，格式和 路由配置 中相同。
   *
   * 当配置此项时，V2Ray DNS 会对返回的 IP 的进行校验，只返回包含 expectIPs 列表中的地址。
   *
   * 如果未配置此项，会原样返回 IP 地址。
   */
  expectIps?: string[]
}

export interface IV2rayDNS {
  /**
   * 静态 IP 列表，其值为一系列的"域名":"地址"。其中地址可以是 IP 或者域名。在解析域名时，如果域名匹配这个列表中的某一项，当该项的地址为 IP 时，则解析结果为该项的 IP，而不会使用下述的 servers 进行解析；当该项的地址为域名时，会使用此域名进行 IP 解析，而不使用原始域名
   */
  hosts?: {
    [k: string]: string
  }
  /**
   * 一个 DNS 服务器列表，支持的类型有三种：IP 地址（字符串形式），ServerObject，或者"localhost"
   */
  servers?: (string | DNSServerObject)[]
  /**
   * 当前系统的 IP 地址，用于 DNS 查询时，通知服务器客户端的所在位置。不能是私有地址
   */
  clientIp?: string
  /**
   * (V2Ray 4.13+) 由此 DNS 发出的查询流量，除localhost外，都会带有此标识，可在路由使用inboundTag进行匹配
   */
  tag?: string
}
