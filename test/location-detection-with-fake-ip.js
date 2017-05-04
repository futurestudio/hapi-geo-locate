'use strict'

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port: 3000});

const lab = exports.lab = Lab.script();
const experiment = lab.experiment;
const test = lab.test;

experiment('hapi-geo-locate detect client location with fake IP address', () => {

    lab.before((done) => {

        server.register({
            register: require('../lib/index')
        }, (err) => {

            done(err);
        });
    });

    test('test if the plugin works with a fake IP address', (done) => {

        const routeOptions = {
            path: '/with-fake-ip',
            method: 'GET',
            config: {
                handler: (request, reply) => {
                    reply(request.location);
                },
                plugins: {
                    'hapi-geo-locate': {
                        fakeIP: '4.4.4.4'
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
            Code.expect(Object.keys(payload)).to.contain(['ip']);
            Code.expect(Object.keys(payload)).to.contain(['hostname']);
            Code.expect(payload.ip).to.equal('4.4.4.4');

            done();
        });
    });

    test('test if the plugin works without a fake IP address', (done) => {

        const routeOptions = {
            path: '/with-empty-fake-ip',
            method: 'GET',
            config: {
                handler: (request, reply) => {
                    reply(request.location);
                },
                plugins: {
                    'hapi-geo-locate': {
                        fakeIP: ''
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
            Code.expect(Object.keys(payload)).to.contain(['ip']);
            Code.expect(Object.keys(payload)).to.contain(['bogon']);
            Code.expect(payload.ip).to.equal('127.0.0.1');

            done();
        });
    });

    test('test if the plugin works with a proxied request through multiple proxies', (done) => {

        const routeOptions = {
            path: '/without-fake-ip',
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
            Code.expect(Object.keys(payload)).to.contain(['ip']);
            Code.expect(Object.keys(payload)).to.contain(['bogon']);
            Code.expect(payload.ip).to.equal('127.0.0.1');

            done();
        });
    });

})
