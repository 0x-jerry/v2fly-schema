# V2ray config json schema

根据 `V2Ray.config.d.ts` 自动生成 `V2Ray.config.schema.json`

Raw schema content: https://raw.githubusercontent.com/0x-jerry/v2ray-config-json-schema/master/V2Ray.config.schema.json

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
      "url": "https://raw.githubusercontent.com/0x-jerry/v2ray-config-json-schema/master/V2Ray.config.schema.json"
    }
  ]
}
```

### Nodejs

安装：`yarn add @0x-jerry/v2ray-schema`

`typescript`:

```ts
import { IV2Ray } from '@0x-jerry/v2ray-schems'

const v2raySchema: IV2Ray = {
  ...
}
```

### Deno

```ts
import { IV2Ray } from 'https://raw.githubusercontent.com/0x-jerry/v2ray-config-json-schema/master/v2ray-schema.ts'

const v2raySchema: IV2Ray = {
  ...
}
```
