'use strict'

const IpLocator = require('./ip-locator')

async function register (server, options) {
  server.decorate('request', 'location', undefined)

  const locator = new IpLocator(options)
  // here Server life cycle is extended via onPreAuth to fetch the client location
  // before authenticating the request
  server.ext('onPreAuth', async (request, h) => {
    return locator.handle(request, h)
  })
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
