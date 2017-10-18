'use strict';

const Ipinfo = require('ipinfo');
const RequestIp = require('request-ip');

/**
 * set the initial state for `location` decorator
 * @returns {{}}
 */
const getState = () => {

    return undefined;
};


/**
 * Extract the IP address from request
 *
 * @param request
 * @returns {*} - client request IP address
 */
const getClientIP = (request) => {

    return RequestIp.getClientIp(request);
};


/**
 * Retrieve the actual location by IP geo location using ipinfo.io
 * @param ip
 * @param callback
 * @returns {*} - location object
 */
const getLocation = (ip, callback) => {

    return Ipinfo(ip, (err, location) => {

        if (err) {
            // return without data -> results in "undefined" location
            return callback();
        }

        return callback(location);
    });
};


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
    server.decorate('request', 'location', getState, { apply: true });

    // extend the request lifecycle at `onPreAuth` to fetch
    // the client’s location before authenticating the request
    server.ext('onPreAuth', (request, reply) => {
        // get the configuration that is assigned to a route
        const settings = request.route.settings.plugins['hapi-geo-locate'] || {};

        // should use a defined fake IP address?
        // a fake IP might be used for debug purposes
        // to locate a request within a given country
        const fakeIP = settings.fakeIP && settings.fakeIP.length > 0 ? settings.fakeIP : undefined;

        let geoLocate = options.enabledByDefault;

        if (typeof settings.enabled !== 'undefined') {
            geoLocate = settings.enabled;
        }

        if (!geoLocate) {
            return reply.continue();
        }

        const ip = fakeIP ? fakeIP : getClientIP(request);

        return getLocation(ip, (location) => {

            request.location = location;
            return reply.continue();
        });
    });

    next();
};


exports.register.attributes = {
    pkg: require('../package.json')
};
