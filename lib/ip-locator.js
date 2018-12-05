'use strict'

const Ipinfo = require('ipinfo')
const RequestIp = require('request-ip')

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

  routeConfig (request) {
    return request.route.settings.plugins['hapi-geo-locate'] || {}
  }

  isDisabledFor (request) {
    const { enabled = this.enabledByDefault } = this.routeConfig(request)

    return enabled
  }

  locate (request) {
    const ip = this.ipFrom(request)

    return new Promise((resolve, reject) => {
      Ipinfo(ip, (err, location) => {
        if (err) {
          return reject(err)
        }

        return resolve(location)
      })
    })
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
