# V2ray config json schema

根据 [v2fly](https://v2fly.org/) 文档，自动生成 JSON Schema 和 TypeScript typedef

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
      "url": "https://raw.githubusercontent.com/0x-jerry/v2ray-config-json-schema/master/v2fly.schema.json"
    }
  ]
}
```

### Nodejs

安装：`pnpm i @0x-jerry/v2ray-schema -D`

`typescript`:

```ts
import type { V2FlyConfig } from '@0x-jerry/v2ray-schema'

const v2raySchema: V2FlyConfig = {
  ...
}
```
