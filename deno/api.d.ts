// @ts-nocheck
export enum APIService {
  /**
   * 一些对于入站出站代理进行修改的 API，可用的功能如下：
   * - 添加一个新的入站代理；
   * - 添加一个新的出站代理；
   * - 删除一个现有的入站代理；
   * - 删除一个现有的出站代理；
   * - 在一个入站代理中添加一个用户（仅支持 VMess、VLESS、Trojan）；
   * - 在一个入站代理中删除一个用户（仅支持 VMess、VLESS、Trojan）；
   */
  HandlerService = 'HandlerService',

  /**
   * 支持对内置 Logger 的重启，可配合 logrotate 进行一些对日志文件的操作。
   */
  LoggerService = 'LoggerService',

  /**
   * 内置的数据统计服务，详见 统计信息。
   */
  StatsService = 'StatsService',
}
export interface IV2rayAPI {
  /**
   * 出站代理标识
   */
  tag?: string;
  /**
   * 开启的 API 列表
   */

  services?: APIService[];
}