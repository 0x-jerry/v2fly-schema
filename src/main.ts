import fs, { emptyDir, ensureDir, ensureFile } from 'fs-extra'
import { writeFile } from 'node:fs/promises'
import { parseType, generateTS, type GenerateConfig } from './convert'
import glob from 'fast-glob'
import path, { join } from 'node:path'
import { type Arrayable, ensureArray } from '@0x-jerry/utils'
import { spawnSync } from 'node:child_process'

const config: GenerateConfig = {
  interfaceMap: {
    基础配置模块: 'V2FlyConfig',
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
  skipProperty(propKey, def) {
    return propKey === 'Tony'
  },
}

const genConf = {
  extension: '.d.ts',
}

await generateConfigDts('xray-docs/docs/config', 'types', config)

formatCodes()

async function generateConfigDts(
  inputDir: string,
  outputDir: string,
  conf?: GenerateConfig,
) {
  const files = await glob('**/*.md', {
    cwd: inputDir,
  })

  await ensureDir(outputDir)
  await emptyDir(outputDir)

  for (const file of files) {
    const outFile = join(outputDir, file.replace('.md', genConf.extension))

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
  const indexFile = join(folder, `index${genConf.extension}`)

  const lines = files
    .filter((n) => n.endsWith(genConf.extension))
    .map((n) => {
      const name = n.replace(genConf.extension, '')
      return `export * as ${name} from ${JSON.stringify(`./${name}`)}`
    })

  await writeFile(indexFile, lines.join('\n'))

  const p = files
    .filter((n) => !n.endsWith(genConf.extension))
    .map((n) => generateIndexDts(join(folder, n)))
  await Promise.all(p)
}

async function unshiftText(file: string, content: Arrayable<string>) {
  const lines = ensureArray(content)
  const txt = await fs.readFile(file, { encoding: 'utf-8' })
  lines.push(txt)

  await fs.writeFile(file, lines.join('\n'))
}

function formatCodes() {
  const biomeBin = path.resolve('node_modules/.bin/biome')

  const resp = spawnSync(biomeBin, ['format', '--write', 'types'], {
    shell: true,
  })
  if (resp.error) {
    console.log(resp.error?.toString())
  } else {
    console.log(resp.output?.toString())
  }
}
