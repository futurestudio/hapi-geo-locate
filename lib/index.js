'use strict'

const Ipinfo = require('ipinfo')
const RequestIp = require('request-ip')

/**
 * Set the initial state for `location` decorator
 *
 * @returns {undefined}
 */
function getState () {
  return undefined
}

/**
 * Extract the IP address from request
 *
 * @param request
 *
 * @returns {String} - client request IP address
 */
function getClientIP (request) {
  return RequestIp.getClientIp(request)
}

/**
 * Retrieve the actual location by IP geo location using ipinfo.io
 *
 * @param ip
 * @param callback
 *
 * @returns {Object} - location object
 */
function getLocation (ip) {
  return new Promise((resolve, reject) => {
    Ipinfo(ip, (err, location) => {
      if (err) {
        // return without data -> results in "undefined" location
        return reject(err)
      }

      return resolve(location)
    })
  })
}

/**
 * The hapi plugin implementation
 *
 * @param server
 * @param pluginOptions
 * @param next
 */
async function register (server, pluginOptions, next) {
  const options = {
    enabledByDefault: true
  }

  Object.assign(options, pluginOptions)

  // decorate the request with a `location` property
  server.decorate('request', 'location', getState, { apply: true })

  // extend the request lifecycle at `onPreAuth` to fetch
  // the client’s location before authenticating the request
  server.ext('onPreAuth', async (request, h) => {
    // get the configuration that is assigned to a route
    const settings = request.route.settings.plugins['hapi-geo-locate'] || {}

    // should use a defined fake IP address?
    // a fake IP might be used for debug purposes
    // to locate a request within a given country
    const fakeIP = settings.fakeIP && settings.fakeIP.length > 0 ? settings.fakeIP : undefined

    let geoLocate = options.enabledByDefault

    if (typeof settings.enabled !== 'undefined') {
      geoLocate = settings.enabled
    }

    if (!geoLocate) {
      return h.continue
    }

    const ip = fakeIP || getClientIP(request)

    const location = await getLocation(ip)
    request.location = location

    return h.continue
  })
}

exports.plugin = {
  register,
  pkg: require('../package.json')
}
