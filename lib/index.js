const ipinfo = require('ipinfo');

/**
 * set the initial state for `location` decorator
 * @returns {{}}
 */
const getState = function () {

    return {};
}

/**
 * Extract the IP address from request
 *
 * @param request
 * @returns {*} - client request IP address
 */
const getClientIP = function (request) {

    // support IP recognition for nginx reverse proxy
    return request.headers[ 'x-forwarded-for' ] || request.info.remoteAddress;
}

/**
 * Retrieve the actual location by IP geo location using ipinfo.io
 * @param ip
 * @param callback
 * @returns {*} - location object
 */
const getLocation = function getLocation (ip, callback) {

    return ipinfo(ip, function (err, location) {
        if (err) {
            return callback({});
        }

        return callback(location);
    })
}

exports.register = function (server, pluginOptions, next) {

    const options = {
        disabledByDefault: false
    };

    Object.assign(options, pluginOptions);

    // decorate the request with a `location` property
    server.decorate('request', 'location', getState, { apply: true })

    server.ext('onPreHandler', function (request, reply) {
        const settings = request.route.settings.plugins.hapiGeoLocate || {};
        let geoLocate = !options.disabledByDefault;

        if (typeof settings.enabled !== 'undefined') {
            geoLocate = settings.enabled;
        }

        if (!geoLocate) {
            return reply.continue();
        }

        const ip = getClientIP(request);

        return getLocation(ip, function (location) {
            request.location = location;
            return reply.continue();
        })
    })

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
