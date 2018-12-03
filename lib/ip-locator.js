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

  isDisabledFor (request) {
    // TODO
  }

  async locate (request) {
    const ip = this.ipFrom(request)

    // TODO: locate request by IP
  }

  ipFrom (request) {
    return this.fakeIp(request) || RequestIp.getClientIp(request)
  }

  fakeIp (request) {
    // TODO: fake IP defined in the route options
  }
}

module.exports = IpLocator
