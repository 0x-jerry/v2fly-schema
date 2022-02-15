import { defineConfig } from '@0x-jerry/x-release'

export default defineConfig({
  sequence: [
    'npm:build',
    'pkg.update.version',
    'git.commit',
    'git.tag',
    'git.push',
    'npm.publish',
  ],
})
