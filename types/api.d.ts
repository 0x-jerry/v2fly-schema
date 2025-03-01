/**
 * `ApiObject` 对应配置文件的 `api` 项。
 * ```json
 * {
 *   "api": {
 *     "tag": "api",
 *     "listen": "127.0.0.1:8080",
 *     "services": ["HandlerService", "LoggerService", "StatsService", "RoutingService"]
 *   }
 * }
 * ```
 **/
export interface ApiObject {
  [key: string]: unknown
  /**
   * 出站代理标识。
   **/
  tag?: string
  /**
   * API 服务监听的 IP 和端口。这是一个可选配置项。
   * 省略这项时需要按照下面[相关配置](#相关配置)中的示例，添加 inbounds 和 routing 配置。
   **/
  listen?: string
  /**
   * 开启的 API 列表，可选的值见 [API 列表](#支持的-api-列表)。
   * 可以在 inbounds 配置中增加一个 api 的 inbound
   * ```json
   * "inbounds": [
   *   {
   *     "listen": "127.0.0.1",
   *     "port": 10085,
   *     "protocol": "dokodemo-door",
   *     "settings": {
   *       "address": "127.0.0.1"
   *     },
   *     "tag": "api"
   *   }
   * ]
   * ```
   * 在路由配置中增加针对 api inbound 的路由规则
   * ```json
   * "routing": {
   *   "rules": [
   *     {
   *       "inboundTag": [
   *         "api"
   *       ],
   *       "outboundTag": "api",
   *       "type": "field"
   *     }
   *   ]
   * }
   * ```
   * 在基础配置中增加 api
   * ```json
   * "api": {
   *   "tag": "api",
   *   "services": [
   *     "StatsService"
   *   ]
   * }
   * ```
   **/
  services?: Array<string>
}
/**
 * 一些对于入站出站代理进行修改的 API，可用的功能如下：
 * - 添加一个新的入站代理；
 * - 添加一个新的出站代理；
 * - 删除一个现有的入站代理；
 * - 删除一个现有的出站代理；
 * - 在一个入站代理中添加一个用户（仅支持 VMess、VLESS、Trojan、Shadowsocks（v1.3.0+））；
 * - 在一个入站代理中删除一个用户（仅支持 VMess、VLESS、Trojan、Shadowsocks（v1.3.0+））；
 **/
export interface HandlerService {
  [key: string]: unknown
}
/**
 * 添加、删除、替换 routing 规则，查询均衡器统计信息的 API，可用的功能如下：
 * - adrules 添加、替换 routing 配置
 * - rmrules 删除 routing 规则
 * - sib 断开来源 IP 的连接
 * - bi 查询均衡器统计信息
 * - bo 强制均衡器选中指定的 outboundTag
 * 可以使用类似于 `./xray help api bi` 这样的命令来查询具体用法。
 **/
export interface RoutingService {
  [key: string]: unknown
}
/**
 * 支持对内置 Logger 的重启，可配合 logrotate 进行一些对日志文件的操作。
 **/
export interface LoggerService {
  [key: string]: unknown
}
/**
 * 内置的数据统计服务，详见 [统计信息](./stats.md)。
 **/
export interface StatsService {
  [key: string]: unknown
}
/**
 * 支持 gRPC 客户端获取服务端的 API 列表。
 * ```bash
 * $ grpcurl -plaintext localhost:10085 list
 * grpc.reflection.v1alpha.ServerReflection
 * v2ray.core.app.proxyman.command.HandlerService
 * v2ray.core.app.stats.command.StatsService
 * xray.app.proxyman.command.HandlerService
 * xray.app.stats.command.StatsService
 * ```
 * [Xray-API-documents](https://github.com/XTLS/Xray-API-documents) @crossfw
 **/
export interface ReflectionService {
  [key: string]: unknown
}
