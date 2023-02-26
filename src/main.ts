import fs, { emptyDir, ensureDir, ensureFile } from 'fs-extra'
import { writeFile } from 'fs/promises'
import { generateType, generateTS } from './convert'
import glob from 'fast-glob'
import { join } from 'path'

await generateConfigDts('v2fly-docs/docs/config', 'types/v4')
await generateConfigDts('v2fly-docs/docs/v5/config', 'types/v5')

async function generateConfigDts(inputDir: string, outputDir: string) {
  const files = await glob('**/*.md', {
    cwd: inputDir,
  })

  await ensureDir(outputDir)
  await emptyDir(outputDir)

  for (const file of files) {
    const outFile = join(outputDir, file.replace('.md', '.ts'))

    await ensureFile(outFile)
    await generate(join(inputDir, file), outFile)
  }
}

async function generate(inputFs: string, outputFs: string) {
  const data = await fs.readFile(inputFs, { encoding: 'utf-8' })

  const defs = generateType(data)

  const file = generateTS(defs)
  await writeFile(outputFs, file)
}
