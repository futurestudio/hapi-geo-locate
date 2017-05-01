'use strict'

const ipinfo = require('ipinfo');


/**
 * set the initial state for `location` decorator
 * @returns {{}}
 */
const getState = () => {

    return undefined;
}


/**
 * Extract the IP address from request
 *
 * @param request
 * @returns {*} - client request IP address
 */
const getClientIP = (request) => {

    // support IP recognition for nginx reverse proxy
    // prefer IP received in proxied header field over local one
    // take first IP (that's the client) from possible array of proxy IPs
    const xFF = request.headers['x-forwarded-for'];
    return xFF ? xFF.split(',')[0] : request.info.remoteAddress;
}


/**
 * Retrieve the actual location by IP geo location using ipinfo.io
 * @param ip
 * @param callback
 * @returns {*} - location object
 */
const getLocation = (ip, callback) => {

    return ipinfo(ip, (err, location) => {
        if (err) {
            // return without data -> results in "undefined" location
            return callback();
        }

        return callback(location);
    })
}


/**
 * The hapi plugin implementation
 * @param server
 * @param pluginOptions
 * @param next
 */
exports.register = (server, pluginOptions, next) => {

    const options = {
        enabledByDefault: true
    };

    Object.assign(options, pluginOptions);

    // decorate the request with a `location` property
    server.decorate('request', 'location', getState, {apply: true})

    server.ext('onPreAuth', (request, reply) => {
        const settings = request.route.settings.plugins['hapi-geo-locate'] || {};
        let geoLocate = options.enabledByDefault;

        if (typeof settings.enabled !== 'undefined') {
            geoLocate = settings.enabled;
        }

        if (!geoLocate) {
            return reply.continue();
        }

        const ip = getClientIP(request);

        return getLocation(ip, (location) => {
            request.location = location;
            return reply.continue();
        })
    })

    next();
};


exports.register.attributes = {
    pkg: require('../package.json')
};
