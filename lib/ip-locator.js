'use strict'

const { promisify } = require('util')
const Ipinfo = promisify(require('ipinfo'))
const RequestIp = require('@supercharge/request-ip')

class IpLocator {
  constructor (options) {
    const { enabledByDefault = true, authToken } = options

    this.authToken = authToken
    this.enabledByDefault = enabledByDefault
  }

  /**
   * Handle geo-location of the incoming request.
   *
   * @param {Request} request
   * @param {Toolkit} h
   */
  async handle (request, h) {
    if (this.isDisabledFor(request)) {
      return h.continue
    }

    request.location = await this.locate(request)

    return h.continue
  }

  /**
   * Check whether geo-location is disabled for
   * the request.
   *
   * @param {Request} request
   *
   * @returns {Boolean}
   */
  isDisabledFor (request) {
    return !this.isEnabledFor(request)
  }

  /**
   * Check whether geo-location is enabled for
   * the request.
   *
   * @param {Request} request
   *
   * @returns {Boolean}
   */
  isEnabledFor (request) {
    const { enabled = this.enabledByDefault } = this.routeConfig(request)

    return enabled
  }

  /**
   * Returns the hapi-geo-locate route config.
   * If no config is present, it falls back
   * to an empty object.
   *
   * @param {Request} request
   *
   * @returns {Object}
   */
  routeConfig (request) {
    return request.route.settings.plugins['hapi-geo-locate'] || {}
  }

  /**
   * Determine the request’s location by
   * IP address.
   *
   * @param {Request} request
   *
   * @returns {Object}
   */
  locate (request) {
    try {
      return Ipinfo(this.ipFrom(request), this.authToken)
    } catch (ignoreErr) { }
  }

  /**
   * Returns the request’s IP address or a
   * configured fake IP.
   *
   * @param {Request} request
   *
   * returns {String}
   */
  ipFrom (request) {
    return this.fakeIp(request) || RequestIp.getClientIp(request)
  }

  /**
   * Returns the fake IP address
   * from the route config.
   *
   * @param {Request} request
   *
   * @returns {String}
   */
  fakeIp (request) {
    const { fakeIP } = this.routeConfig(request)

    return fakeIP
  }
}

module.exports = IpLocator
