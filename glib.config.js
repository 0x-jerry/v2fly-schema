/**
 * @type {import('@exyz/glib').UserOption}
 */
const conf = {
  release: {
    async afterDone(ctx) {
      ctx.info('Publishing to npm...')
      await ctx.run('yarn', ['publish', '--new-version', ctx.version])
    },
  },
}
