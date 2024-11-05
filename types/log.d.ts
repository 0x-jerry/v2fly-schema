/**
 * LogObject 对应配置文件的 `log` 项。
 * ```json
 * {
 *   "log": {
 *     "access": "文件地址",
 *     "error": "文件地址",
 *     "loglevel": "warning",
 *     "dnsLog": false,
 *     "maskAddress": ""
 *   }
 * }
 * ```
 **/
export interface LogObject {
	[key: string]: unkown;
	/**
	 * 访问日志的文件地址，其值是一个合法的文件地址，如`"/var/log/Xray/access.log"`（Linux）或者`"C:\\Temp\\Xray\\_access.log"`（Windows）。当此项不指定或为空值时，表示将日志输出至 stdout。
	 * - 特殊值`none`，即关闭 access log。
	 **/
	access?: string;
	/**
	 * 错误日志的文件地址，其值是一个合法的文件地址，如`"/var/log/Xray/error.log"`（Linux）或者`"C:\\Temp\\Xray\\_error.log"`（Windows）。当此项不指定或为空值时，表示将日志输出至 stdout。
	 * - 特殊值`none`，即关闭 error log。
	 **/
	error?: string;
	/**
	 * error 日志的级别, 指示 error 日志需要记录的信息.
	 * 默认值为 `"warning"`。
	 * - `"debug"`：调试程序时用到的输出信息。同时包含所有 `"info"` 内容。
	 * - `"info"`：运行时的状态信息等，不影响正常使用。同时包含所有 `"warning"` 内容。
	 * - `"warning"`：发生了一些并不影响正常运行的问题时输出的信息，但有可能影响用户的体验。同时包含所有 `"error"` 内容。
	 * - `"error"`：Xray 遇到了无法正常运行的问题，需要立即解决。
	 * - `"none"`：不记录任何内容。
	 **/
	loglevel?: "debug" | "info" | "warning" | "error" | "none";
	/**
	 * 是否启用 DNS 查询日志，例如：`DOH//doh.server got answer: domain.com -> [ip1, ip2] 2.333ms`
	 **/
	dnsLog?: boolean;
	/**
	 * IP地址遮罩，启用后将自动替换log中出现的IP地址，用于在分享日志时保护隐私，默认为空即不启用。
	 * 目前可选等级 `quarter` `half` `full` 遮罩形式对应如下
	 * - ipv4 `1.2.*.*` `1.*.*.*` `[Masked IPv4]`
	 * - ipv6 `1234:5678::/32` `1234::/16` `[Masked IPv6]`
	 **/
	maskAddress?: "quarter" | "half" | "full";
}
