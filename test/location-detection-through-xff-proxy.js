'use strict'

const Lab = require('lab');
const Code = require('code');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port: 3000});

const lab = exports.lab = Lab.script();
const experiment = lab.experiment;
const test = lab.test;

experiment('hapi-geo-locate detect client location with proxied request (x-forwarded-for header)', () => {

    lab.before((done) => {

        server.register({
            register: require('../lib/index'),
            options: {
                enabledByDefault: true
            }
        }, (err) => {

            done(err);
        });
    });

    test('test if the plugin works with a proxied request through a single proxy', (done) => {

        const routeOptions = {
            path: '/no-proxy',
            method: 'GET',
            handler: (request, reply) => {
                reply(request.location);
            }
        };

        server.route(routeOptions);

        const options = {
            url: routeOptions.path,
            method: routeOptions.method,
            headers: {
                'x-forwarded-for': ''
            }
        };

        server.inject(options, (response) => {

            const payload = JSON.parse(response.payload || '{}');

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(Object.keys(payload)).to.contain(['ip']);
            Code.expect(payload.ip).to.equal('127.0.0.1');

            done();
        });
    });

    test('test if the plugin works with a proxied request through a single proxy', (done) => {

        const routeOptions = {
            path: '/single-proxy',
            method: 'GET',
            handler: (request, reply) => {
                reply(request.location);
            }
        };

        server.route(routeOptions);

        const options = {
            url: routeOptions.path,
            method: routeOptions.method,
            headers: {
                'x-forwarded-for': '8.8.8.8'
            }
        };

        server.inject(options, (response) => {

            const payload = JSON.parse(response.payload || '{}');

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(Object.keys(payload)).to.contain(['ip']);
            Code.expect(Object.keys(payload)).to.contain(['hostname']);
            Code.expect(payload.ip).to.equal('8.8.8.8');

            done();
        });
    });

    test('test if the plugin works with a proxied request through multiple proxies', (done) => {

        const routeOptions = {
            path: '/multiple-proxies',
            method: 'GET',
            handler: (request, reply) => {
                reply(request.location);
            }
        };

        server.route(routeOptions);

        const options = {
            url: routeOptions.path,
            method: routeOptions.method,
            headers: {
                'x-forwarded-for': '4.4.4.4, 8.8.8.8, 1.1.1.1'
            }
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

})
