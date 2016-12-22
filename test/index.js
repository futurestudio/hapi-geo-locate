const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port: 3000});

const lab = exports.lab = Lab.script();

lab.experiment('hapi-geo-locate register plugin', function () {
  lab.before(function (done) {
    server.register({
      register: require('../lib/index')
    }, function (err) {
      done(err);
    });
  });

  lab.test('test if the plugin works without any options', function (done) {
    const NO_OPTIONS = {
      path: '/NO_OPTIONS',
      method: 'GET',
      handler: function (request, reply) {
        reply(request.location);
      }
    }

    server.route(NO_OPTIONS)

    const options = {
      url: NO_OPTIONS.path,
      method: NO_OPTIONS.method
    };

    server.inject(options, function (response) {
      const payload = JSON.parse(response.payload || '{}');

      Code.expect(response.statusCode).to.equal(200);
      Code.expect(Object.keys(payload)).to.contain(['ip']);

      done();
    });
  });

})
