# V2ray config json schema

根据 v2fly 文档，自动生成 json schema 和 typescript types

## 使用方式

### Visual Studio Code

官方文档: [json-schemas-and-settings](https://code.visualstudio.com/docs/languages/json#_json-schemas-and-settings)

示例：

在项目中添加 `.vscode/settings.json` 配置文件，并设置 `json.schemas` 字段如下：

```json
{
  "json.schemas": [
    {
      "fileMatch": ["/*.json", "/*.jsonc"],
      "url": "https://raw.githubusercontent.com/0x-jerry/v2ray-config-json-schema/master/v4.schema.json"
    }
  ]
}
```

### Nodejs

安装：`yarn add @0x-jerry/v2ray-schema`

`typescript`:

```ts
import type { V4Config } from '@0x-jerry/v2ray-schema'

const v2raySchema: V4Config = {
  ...
}
```

### Deno

```ts
import { V4Config } from 'npm:@0x-jerry/v2ray-schema'

const v2raySchema: V4Config = {
  ...
}
```
