import { remark } from 'remark'
import { ElementOf } from '@0x-jerry/utils'

export interface GenerateConfig {
  interfaceMap?: Record<string, string>
  typeMap?: Record<string, string>
}

export function generateType(str: string, conf?: GenerateConfig) {
  const defs: InterfaceDef[] = []
  const r = remark().parse(str)
  const items = r.children

  type Content = ElementOf<typeof items>
  const getContent = (item: Content) =>
    str.slice(item.position!.start.offset!, item.position!.end.offset!)

  let idx = 0
  let currentDef: InterfaceDef | null = null
  let currentProps: InterfaceDefProp | null = null

  while (idx < items.length) {
    const item = items[idx]
    const itemContent = getContent(item).trim()

    if (item.type === 'heading') {
      const head = itemContent.slice(item.depth).trim()

      const name = conf?.interfaceMap?.[head]

      if (name) {
        currentDef = {
          name: name,
          head: [],
          comment: [],
          properties: [],
        }

        defs.push(currentDef)

        currentProps = null
      } else if (/^[\w]+$/.test(head)) {
        currentDef = {
          head: [],
          name: head,
          comment: [],
          properties: [],
        }

        defs.push(currentDef)

        currentProps = null
      }
    } else if (item.type === 'blockquote') {
      const txt = itemContent
      const isProp = /^>\s+\`([\w\d_]+)\`\s*[:：](.+)/
      const [_, propKey, content] = txt.match(isProp) || []

      if (propKey && currentDef) {
        currentProps = {
          key: propKey,
          type: convertPropType(content, currentDef),
          comment: [],
        }

        currentDef.properties.push(currentProps)
      }
    } else {
      if (currentProps) {
        currentProps.comment.push(itemContent)
      } else if (currentDef) {
        currentDef.comment.push(itemContent)
      }
    }

    idx++
  }

  return defs

  function convertPropType(content: string, def: InterfaceDef): string {
    if (!content) {
      console.log(def)
    }

    content = content.trim()

    // array
    if (/^\\?\[/.test(content) && /\\?\]$/.test(content)) {
      const count = content.startsWith('\\[') ? 2 : 1

      const t = content.slice(count, -count)
      return `${convertPropType(t, def)}[]`
    }
    // or operator
    else if (content.includes('|')) {
      return content
        .split('|')
        .map((n) => convertPropType(n, def))
        .join(' | ')
    }
    // map
    else if (content.startsWith('map')) {
      const reg = /map\s*\\?\{\s*([\w\d]+)\s*[:,]\s*([^}]+)}/
      let [_, keyType, type] = content.match(reg) || []

      // map \{string: string\}, remove the last `\`
      type = type.endsWith('\\') ? type.slice(0, -1) : type

      return `Record<${keyType}, ${convertPropType(type, def)}>`
    }
    // link node
    else if (content.startsWith('[')) {
      const reg = /^\[([^\]]+)\]\(([^)]+)\)/
      const [_, type, link] = content.match(reg) || []

      const realType = convertPropType(type, def)

      if (link.includes('.md')) {
        def.head.push({
          name: realType,
          from: link.replace(/#.+$/, '').replace('.md', ''),
        })
      }

      return realType
    } else {
      if (content.includes(' ')) {
        return 'any'
      }

      return conf?.typeMap?.[content] || content
    }
  }
}

export function generateTS(defs: InterfaceDef[]): string {
  const output: string[] = []
  const heads = defs
    .map((n) =>
      n.head.map(
        (item) =>
          `import { ${item.name} } from ${JSON.stringify(
            (item.from.startsWith('.') ? '' : './') + item.from
          )}`
      )
    )
    .flat()
    .filter(Boolean)

  const headScript = [...new Set(heads)].join('\n')

  if (headScript) {
    output.push(headScript)
  }

  defs.forEach((item) => {
    const type = `/**
  ${item.comment.join('\n')}
 **/
export interface ${item.name} {
${item.properties
  .map(
    (n) => `/**
${n.comment.join('\n')}
**/
${n.key}: ${n.type}`
  )
  .join('\n')}
}`
    output.push(type)
  })

  return output.join('\n')
}

export interface InterfaceDef {
  name: string
  comment: string[]
  properties: InterfaceDefProp[]
  head: { name: string; from: string }[]
}

export interface InterfaceDefProp {
  key: string
  type: string
  comment: string[]
}
