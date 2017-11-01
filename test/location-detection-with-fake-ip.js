'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')

const server = new Hapi.Server()

const lab = (exports.lab = Lab.script())
const experiment = lab.experiment
const test = lab.test

experiment('hapi-geo-locate detect client location with fake IP address', () => {
  lab.before(async () => {
    await server.register({
      plugin: require('../lib/index')
    })
  })

  test('test if the plugin works with a fake IP address', async () => {
    const routeOptions = {
      path: '/with-fake-ip',
      method: 'GET',
      config: {
        handler: (request, h) => {
          return request.location
        },
        plugins: {
          'hapi-geo-locate': {
            fakeIP: '8.8.8.8'
          }
        }
      }
    }

    server.route(routeOptions)

    const options = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(200)
    Code.expect(Object.keys(payload)).to.contain(['ip'])
    Code.expect(Object.keys(payload)).to.contain(['hostname'])
    Code.expect(payload.ip).to.equal('8.8.8.8')
  })

  test('test if the plugin works without a fake IP address', async () => {
    const routeOptions = {
      path: '/with-empty-fake-ip',
      method: 'GET',
      config: {
        handler: (request, h) => {
          return request.location
        },
        plugins: {
          'hapi-geo-locate': {
            fakeIP: ''
          }
        }
      }
    }

    server.route(routeOptions)

    const options = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(200)
    Code.expect(Object.keys(payload)).to.contain(['ip'])
    Code.expect(Object.keys(payload)).to.contain(['bogon'])
    Code.expect(payload.ip).to.equal('127.0.0.1')
  })

  test('test if the plugin works with a proxied request through multiple proxies', async () => {
    const routeOptions = {
      path: '/without-fake-ip',
      method: 'GET',
      handler: (request, h) => {
        return request.location
      }
    }

    server.route(routeOptions)

    const options = {
      url: routeOptions.path,
      method: routeOptions.method
    }

    const response = await server.inject(options)
    const payload = JSON.parse(response.payload || '{}')

    Code.expect(response.statusCode).to.equal(200)
    Code.expect(Object.keys(payload)).to.contain(['ip'])
    Code.expect(Object.keys(payload)).to.contain(['bogon'])
    Code.expect(payload.ip).to.equal('127.0.0.1')
  })
})
