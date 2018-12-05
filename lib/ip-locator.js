'use strict'
const { promisify } = require('util')
const RequestIp = require('request-ip')
const Ipinfo = promisify(require('ipinfo'))

class IpLocator {
  constructor (options) {
    const { enabledByDefault = true } = options

    this.enabledByDefault = enabledByDefault
  }

  async handle (request, h) {
    if (this.isDisabledFor(request)) {
      return h.continue
    }

    request.location = await this.locate(request)

    return h.continue
  }

  isDisabledFor (request) {
    return !this.isEnabledFor(request)
  }

  isEnabledFor (request) {
    const { enabled = this.enabledByDefault } = this.routeConfig(request)

    return enabled
  }

  routeConfig (request) {
    return request.route.settings.plugins['hapi-geo-locate'] || {}
  }

  locate (request) {
    try {
      const ip = this.ipFrom(request)

      return Ipinfo(ip)
    } catch (error) { }
  }

  ipFrom (request) {
    return this.fakeIp(request) || RequestIp.getClientIp(request)
  }

  fakeIp (request) {
    const { fakeIP } = this.routeConfig(request)

    return fakeIP
  }
}

module.exports = IpLocator
