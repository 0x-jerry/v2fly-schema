import { remark } from 'remark'
import { ElementOf } from '@0x-jerry/utils'

export function generateType(str: string) {
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

    if (item.type === 'heading' && item.depth > 1) {
      const head = itemContent.slice(item.depth).trim()

      if (head === '概述') {
        currentDef = {
          name: 'V2FlyConfig',
          comment: [],
          properties: [],
        }

        defs.push(currentDef)

        currentProps = null
      } else if (head.endsWith('Object')) {
        currentDef = {
          name: head,
          comment: [],
          properties: [],
        }

        defs.push(currentDef)

        currentProps = null
      }
    } else if (item.type === 'blockquote') {
      const txt = itemContent
      const isProp = /^>\s+\`([\w\d_]+)\`[:：](.+)/
      const [_, propKey, content] = txt.match(isProp) || []

      if (propKey) {
        currentProps = {
          key: propKey,
          type: convertPropType(content),
          comment: [],
        }

        if (currentDef) {
          currentDef.properties.push(currentProps)
        }
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
}

export function generateTS(defs: InterfaceDef[]): string {
  const output: string[] = []
  const headScript = defs
    .map((n) => n.head)
    .filter(Boolean)
    .join('\n')
  if (headScript) {
    output.push(headScript)
  }

  defs.forEach((item) => {
    const type = `/**
 **/
export interface ${item.name} {
${item.properties
  .map(
    (n) => `/**
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
  head?: { name: string; from: string }[]
}

export interface InterfaceDefProp {
  key: string
  type: string
  comment: string[]
}

function convertPropType(content: string): string {
  content = content.trim()
  if (content.startsWith('\\[')) {
    const t = content.slice(2, -2)
    return `${convertPropType(t)}[]`
  } else if (content.includes('|')) {
    return content
      .split('|')
      .map((n) => convertPropType(n))
      .join(' | ')
  } else if (content.startsWith('map')) {
    const reg = /map\s*\\?\{\s*([\w\d]+)\s*[:,]\s*([^}]+)}/
    let [_, keyType, type] = content.match(reg) || []

    // map \{string: string\}, remove the last `\`
    type = type.endsWith('\\') ? type.slice(0, -1) : type

    return `Record<${keyType}, ${convertPropType(type)}>`
  } else if (content.startsWith('[')) {
    const reg = /^\[([^\]]+)\]/
    const [_, type] = content.match(reg) || []

    return convertPropType(type)
  } else {
    const typeMap: Record<string, string> = {
      bool: 'boolean',
      address: 'string',
      'string: CIDR': 'string',
      address_port: 'string',
      int: 'number',
      数组: 'any',
      // fix type,
      HttpHeaderobject: 'HttpHeaderObject',
    }

    return typeMap[content] || content
  }
}
