import fs, { emptyDir, ensureFile } from 'fs-extra'
import { writeFile } from 'fs/promises'
import { generateType, generateTS } from './convert'
import glob from 'fast-glob'
import { join } from 'path'

// await generate('docs/dns.md', 'types/dns.d.ts')

const configDir = 'v2fly-docs/docs/config'

const files = await glob('**/*.md', {
  cwd: configDir,
})

await emptyDir('types')

for (const file of files) {
  const outFile = join('types', file.replace('.md', '.ts'))
  await ensureFile(outFile)
  await generate(join(configDir, file), outFile)
}

async function generate(inputFs: string, outputFs: string) {
  const data = await fs.readFile(inputFs, { encoding: 'utf-8' })

  const defs = generateType(data)

  const file = generateTS(defs)
  await writeFile(outputFs, file)
}
