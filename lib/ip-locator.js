'use strict'

const Ipinfo = require('ipinfo')
const RequestIp = require('request-ip')

class IpLocator {
  constructor (options) {
    const { enabledByDefault = true } = options
    this.enabledByDefault = enabledByDefault
  }

  /**
   * @function setting
   * @description Return the setting for the hapi-geo-locate by taking the request as a parameter and return the setting
   * @param {Object} request
   * @returns {Object}
   */
  setting (request) {
    return request.route.settings.plugins['hapi-geo-locate'] || {}
  }

  /**
   * @async
   * @function handle
   * @description This is the main function to handle the request
   * @param {Object} request
   * @param {Object} h
   */
  async handle (request, h) {
    if (this.isDisabledFor(request)) {
      return h.continue
    }
    request.location = await this.locate(request)
    return h.continue
  }

  /**
   * @function isDisabledFor
   * @param {Object} request
   * @returns Boolean
   */
  isDisabledFor (request) {
    const settings = this.setting(request)
    let geoLocate = this.enabledByDefault
    if (typeof settings.enabled !== 'undefined') {
      geoLocate = settings.enabled
    }
    if (!geoLocate) {
      return true
    }
    return false
  }

  /**
   * @async
   * @function locate
   * @description This function will locate IP of the client and return the Promise
   * @param {Object} request
   * @returns {Promise}
   */
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

  /**
   * @function ipFrom
   * @description This function will return the IP of the client
   * @param {Object} request
   */
  ipFrom (request) {
    return this.fakeIp(request) || RequestIp.getClientIp(request)
  }

  /**
   * @function fakeIp
   * @param {Object} request
   */
  fakeIp (request) {
    const settings = this.setting(request)
    const fakeIP = settings.fakeIP && settings.fakeIP.length > 0 ? settings.fakeIP : undefined
    return fakeIP
  }
}

module.exports = IpLocator
