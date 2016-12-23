'use strict'

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000 });

const lab = exports.lab = Lab.script();
const experiment = lab.experiment;
const test = lab.test;

experiment('hapi-geo-locate register plugin', () => {

    lab.before((done) => {

        server.register({
            register: require('../lib/index')
        }, (err) => {

            done(err);
        });
    });

    test('test if the plugin works without any options', (done) => {

        const routeOptions = {
            path: '/no-options',
            method: 'GET',
            handler: (request, reply) => {
                reply(request.location);
            }
        };

        server.route(routeOptions);

        const options = {
            url: routeOptions.path,
            method: routeOptions.method
        };

        server.inject(options, (response) => {

            const payload = JSON.parse(response.payload || '{}');

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(Object.keys(payload)).to.contain([ 'ip' ]);

            done();
        });
    });

    test('test if the plugin disables when passing plugin config on route', (done) => {

        const routeOptions = {
            path: '/with-options',
            method: 'GET',
            handler: (request, reply) => {
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

        server.inject(options, (response) => {

            const payload = JSON.parse(response.payload || '{}');

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(payload).to.be.empty();

            done();
        });
    });
})
