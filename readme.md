# V2ray config json schema

根据 `V2Ray.config.d.ts` 自动生成 `V2Ray.config.schema.json`

raw schema content: https://raw.githubusercontent.com/cwxyz007/v2ray-config-json-schema/master/V2Ray.config.schema.json

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
      "url": "https://raw.githubusercontent.com/cwxyz007/v2ray-config-json-schema/master/V2Ray.config.schema.json"
    }
  ]
}
```

### Nodejs

安装：`yarn add @exyz/v2ray-schema`

`typescript`:

```ts
import { IV2Ray } from '@exyz/v2ray-schems`

const v2raySchema: IV2Ray = {
  ...
}
```
