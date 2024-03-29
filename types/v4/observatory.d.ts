/**
 * ```json
 * {
 *   "subjectSelector":[
 *     "outbound"
 *   ]
 * }
 * ```
 **/
export interface ObservatoryObject {
	[key: string]: any;
	/**
	 * 一个字符串数组，其中每一个字符串将用于和出站协议标识的前缀匹配。在以下几个出站协议标识中：`[ "a", "ab", "c", "ba" ]`，`"selector": ["a"]` 将匹配到 `[ "a", "ab" ]`。
	 * 被匹配到的出站连接将被定时连接以确定是否可用。
	 **/
	subjectSelector?: Array<string>;
	/**
	 * 用于检测连接状态的网址。默认会使用内构的连接状态检测地址。(4.41.1+)
	 * :::tip
	 * 此目标地址的服务器可以推断出您使用了本程序。如果您使用了第三方提供的服务器，该服务器的运营商可能基于此信息作出不利于您的决定，如展示更多验证码，拒绝服务或封禁您的帐号。
	 * :::
	 **/
	probeURL?: string;
	/**
	 * 发起探测的间隔。每经过这个时间，就会对一个服务器进行服务器状态检测。时间格式为数字+单位，比如`"10s"`, `"2h45m"`，支持的时间单位有 `ns`, `us`, `ms`, `s`, `m`, `h`， 分别对应纳秒、微秒、毫秒、秒、分、时。(4.41.1+)
	 * :::tip
	 * 此配置项目的名称于 v4.42.0 发生了修改。
	 * :::
	 **/
	probeInterval?: string;
}
