/**
 * `ApiObject` 对应配置文件的 `api` 项。
 * ```json
 * {
 *     "tag": "api",
 *     "services": [
 *         "HandlerService",
 *         "LoggerService",
 *         "StatsService"
 *     ]
 * }
 * ```
 **/
export interface ApiObject {
	[key: string]: any;
	/**
	 * 出站代理标识。
	 **/
	tag?: string;
	/**
	 * 开启的 API 列表，可选的值见 [API 列表](#支持的-api-列表)。
	 **/
	services?: Array<string>;
}
/**
 * 一些对于入站出站代理进行修改的 API，可用的功能如下：
 * * 添加一个新的入站代理；
 * * 添加一个新的出站代理；
 * * 删除一个现有的入站代理；
 * * 删除一个现有的出站代理；
 * * 在一个入站代理中添加一个用户（仅支持 VMess、VLESS、Trojan）；
 * * 在一个入站代理中删除一个用户（仅支持 VMess、VLESS、Trojan）；
 **/
export interface HandlerService {
	[key: string]: any;
}
/**
 * 支持对内置 Logger 的重启，可配合 logrotate 进行一些对日志文件的操作。
 **/
export interface LoggerService {
	[key: string]: any;
}
/**
 * 内置的数据统计服务，详见 [统计信息](stats.md)。
 **/
export interface StatsService {
	[key: string]: any;
}
/**
 * [连接观测](observatory.md) 组件 API (v4.38.0+) 。
 **/
export interface ObservatoryService {
	[key: string]: any;
}
