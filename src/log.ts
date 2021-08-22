export enum LogLevel {
  /**
   * 只有开发人员能看懂的信息。同时包含所有 "info" 内容。
   */
  debug = 'debug',
  /**
   * V2Ray 在运行时的状态，不影响正常使用。同时包含所有 "warning" 内容。
   */
  info = 'info',
  /**
   * V2Ray 遇到了一些问题，通常是外部问题，不影响 V2Ray 的正常运行，但有可能影响用户的体验。同时包含所有 "error" 内容。
   */
  warning = 'warning',
  /**
   * V2Ray 遇到了无法正常运行的问题，需要立即解决。
   */
  error = 'error',
  /**
   * 不记录任何内容。
   */
  none = 'none',
}

export interface IV2rayLog {
  /**
   * 访问日志的文件地址，其值是一个合法的文件地址，如"/tmp/v2ray/_access.log"（Linux）或者"C:\Temp\v2ray\_access.log"（Windows）。当此项不指定或为空值时，表示将日志输出至 stdout
   */
  access?: string
  /**
   * 错误日志的文件地址，其值是一个合法的文件地址，如"/tmp/v2ray/_error.log"（Linux）或者"C:\Temp\v2ray\_error.log"（Windows）。当此项不指定或为空值时，表示将日志输出至 stdout
   */
  error?: string
  /**
   * 错误日志的级别。默认值为"warning"
   */
  loglevel?: LogLevel
}
