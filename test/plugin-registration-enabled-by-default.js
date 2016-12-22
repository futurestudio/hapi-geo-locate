const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000 });

const lab = exports.lab = Lab.script();
const experiment = lab.experiment;
const test = lab.test;

experiment('hapi-geo-locate register plugin', function () {

    lab.before(function (done) {
        server.register({
            register: require('../lib/index'),
            options: {
                disabledByDefault: false
            }
        }, function (err) {
            done(err);
        });
    });

    test('test if the plugin disables with options during registration', function (done) {
        const routeOptions = {
            path: '/NO_OPTIONS',
            method: 'GET',
            handler: function (request, reply) {
                reply(request.location);
            }
        };

        server.route(routeOptions);

        const options = {
            url: routeOptions.path,
            method: routeOptions.method
        };

        server.inject(options, function (response) {
            const payload = JSON.parse(response.payload || '{}');

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(Object.keys(payload)).to.contain([ 'ip' ]);

            done();
        });
    });

    test('test if the plugin disables enables when passing plugin config on route', function (done) {
        const routeOptions = {
            path: '/DISABLED',
            method: 'GET',
            handler: function (request, reply) {
                reply(request.location);
            },
            config: {
                plugins: {
                    hapiGeoLocate: {
                        enabled: false
                    }
                }
            }
        };

        server.route(routeOptions);

        const options = {
            url: routeOptions.path,
            method: routeOptions.method
        };

        server.inject(options, function (response) {
            const payload = JSON.parse(response.payload || '{}');

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(Object.keys(payload)).to.be.empty();

            done();
        });
    });
})
