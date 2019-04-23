'use strict'

const IpLocator = require('./ip-locator')

async function register (server, options) {
  server.decorate('request', 'location')

  const locator = new IpLocator(options)

  server.ext('onPreAuth', async (request, h) => {
    return locator.handle(request, h)
  })
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json')
}
