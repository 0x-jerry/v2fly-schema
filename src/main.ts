import fs, { emptyDir, ensureDir, ensureFile, readdir } from 'fs-extra'
import { writeFile } from 'fs/promises'
import { parseType, generateTS, GenerateConfig } from './convert'
import glob from 'fast-glob'
import { join } from 'path'

const v4config: GenerateConfig = {
  interfaceMap: {
    概述: 'V2FlyConfig',
  },
  typeMap: {
    bool: 'boolean',
    address: 'string',
    'string: CIDR': 'string',
    address_port: 'string',
    int: 'number',
    数组: 'any',
    // fix type,
    HttpHeaderobject: 'HttpHeaderObject',
    QUICObject: 'QuicObject',
  },
}

await generateConfigDts('v2fly-docs/docs/config', 'types/v4', v4config)

const v5config: GenerateConfig = {
  interfaceMap: {
    概述: 'V2FlyConfig',
    'VMess 入站': 'VMessInbound',
    'VMess 出站': 'VMessOutbound',
    'Router 路由': 'RoutingObject',
    TLS: 'TLSConfig',
  },
  typeMap: {
    bool: 'boolean',
    address: 'string',
    'string: CIDR': 'string',
    address_port: 'string',
    int: 'number',
    数组: 'any',
    // fix type,
    HttpHeaderobject: 'HttpHeaderObject',
    QUICObject: 'QuicObject',
  },
}

await generateConfigDts('v2fly-docs/docs/v5/config', 'types/v5', v5config)

async function generateConfigDts(inputDir: string, outputDir: string, conf?: GenerateConfig) {
  const files = await glob('**/*.md', {
    cwd: inputDir,
  })

  await ensureDir(outputDir)
  await emptyDir(outputDir)

  for (const file of files) {
    const outFile = join(outputDir, file.replace('.md', '.ts'))

    await generate(join(inputDir, file), outFile)
  }

  // generate extra types
  await generateIndexDts(outputDir)

  return

  async function generate(inputFs: string, outputFs: string) {
    const data = await fs.readFile(inputFs, { encoding: 'utf-8' })

    const defs = parseType(data, conf)

    const file = generateTS(defs)

    if (!file.trim()) return

    await ensureFile(outputFs)
    await writeFile(outputFs, file)
  }
}

async function generateIndexDts(folder: string) {
  const files = await fs.readdir(folder)
  const indexFile = join(folder, 'index.ts')

  const lines = files
    .filter((n) => n.endsWith('.ts'))
    .map((n) => {
      const name = n.replace('.ts', '')
      return `export * as ${name} from ${JSON.stringify('./' + name)}`
    })

  await writeFile(indexFile, lines.join('\n'))

  const p = files.filter((n) => !n.endsWith('.ts')).map((n) => generateIndexDts(join(folder, n)))
  await Promise.all(p)
}
