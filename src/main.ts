// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, ProxyConfiguration } from 'crawlee'
import { router } from './routes.js'

const startUrls = ['https://crawlee.dev']

const crawler = new PuppeteerCrawler({
  proxyConfiguration: new ProxyConfiguration({
    proxyUrls: ['http://127.0.0.1:6542'],
  }),
  requestHandler: router,
})

await crawler.run(startUrls)
