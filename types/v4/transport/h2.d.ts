/**
  `HttpObject` 对应传输配置的 `httpSettings` 项。
```json
{
    "host": [
        "v2ray.com"
    ],
    "path": "/random/path",
    "method":"PUT",
    "headers": {
    }
}
```
 **/
export interface HttpObject {
  [key: string]: any
/**
一个字符串数组，每一个元素是一个域名。客户端会随机从列表中选出一个域名进行通信，服务器会验证域名是否在列表中。
HTTP 路径，由 `/` 开头。客户端和服务器必须一致。可选参数，默认值为 `"/"`。
**/
host?: Array<string>
/**
HTTP 方法，默认值为 `"PUT"`。 (v4.39.0+)
**/
method?: string
/**
HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是一个数组。(v4.39.0+)
**/
headers?: Record<string, Array<string>>
}