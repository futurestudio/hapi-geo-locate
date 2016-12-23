'use strict'

const ipinfo = require('ipinfo');


/**
 * set the initial state for `location` decorator
 * @returns {{}}
 */
const getState = () => {

    return {};
}


/**
 * Extract the IP address from request
 *
 * @param request
 * @returns {*} - client request IP address
 */
const getClientIP = (request) => {

    // support IP recognition for nginx reverse proxy
    // prefer IP received in header field over local request one
    return request.headers[ 'x-forwarded-for' ] || request.info.remoteAddress;
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
exports.register = (server, pluginOptions, next)  => {

    const options = {
        disabledByDefault: false
    };

    Object.assign(options, pluginOptions);

    // decorate the request with a `location` property
    server.decorate('request', 'location', getState, { apply: true })

    server.ext('onPreHandler', (request, reply) => {
        const settings = request.route.settings.plugins.hapiGeoLocate || {};
        let geoLocate = !options.disabledByDefault;

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
