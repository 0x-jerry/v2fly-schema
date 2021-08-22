import path from 'path'
import glob from 'fast-glob'
import fs from 'fs-extra'
import { transformAsync, PluginObj } from '@babel/core'
// @ts-ignore
import tsSyntax from '@babel/plugin-syntax-typescript'

function node2deno(): PluginObj {
  const transformPathSuffix = (sourceValue: string) => {
    if (sourceValue.startsWith('.')) {
      sourceValue += '.ts'
    }

    return sourceValue
  }

  return {
    name: 'node2deno',

    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source
        source.value = transformPathSuffix(source.value)
      },
      ExportAllDeclaration(path) {
        const source = path.node.source
        source.value = transformPathSuffix(source.value)
      },
      ExportNamedDeclaration(path) {
        const source = path.node.source
        if (!source) return

        source.value = transformPathSuffix(source.value)
      },
    },
  }
}

async function main() {
  const files = await glob(['**/*.ts', '!**/*.test.ts'], { cwd: 'src' })

  await Promise.all(
    files.map(async (file) => {
      if (file === 'node.ts') return
      const content = await fs.readFile(path.join('src', file), 'utf8')
      const transformed = await transformAsync(content, {
        plugins: [tsSyntax, node2deno],
      })

      const result = `// @ts-nocheck\n${transformed?.code || ''}`

      await fs.outputFile(path.join('deno', file), result, 'utf8')
    })
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
