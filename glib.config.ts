import { defineConfig } from '@exyz/glib'

export default defineConfig({
  release: {
    async afterDone(ctx) {
      ctx.info('Publishing to npm...')
      await ctx.run('yarn', ['publish', '--new-version', ctx.version])
    },
  },
})
