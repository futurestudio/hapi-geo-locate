const ipinfo = require('ipinfo');

const getState = function () {
  return {};
}

const getClientIP = function (request) {
  return request.info.remoteAddress;
}

const getLocation = function getLocation(ip, callback) {
  return ipinfo(ip, function (err, location) {
    if (err) {
      return callback({})
    }

    return callback(location);
  })
}

exports.register = function (server, pluginOptions, next) {

  const options = {
    disabledByDefault: false
  };

  Object.assign(options, pluginOptions);

  server.decorate('request', 'location', getState, {apply: true})

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
