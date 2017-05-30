<p align="center">
  <img height="256" src="https://github.com/fs-opensource/hapi-geo-locate/blob/master/media/hapi-geo-locate.png?raw=true" alt="hapi-geo-locate logo">
</p>

<p align="center">
    <a href="https://travis-ci.org/fs-opensource/hapi-geo-locate"><img src="https://camo.githubusercontent.com/9f56ef242c6f588f74f39f0bd61c1acd34d853af/68747470733a2f2f7472617669732d63692e6f72672f66732d6f70656e736f757263652f686170692d67656f2d6c6f636174652e7376673f6272616e63683d6d6173746572" alt="Build Status" data-canonical-src="https://travis-ci.org/fs-opensource/hapi-geo-locate.svg?branch=master" style="max-width:100%;"></a>
    <a href="https://nodesecurity.io/orgs/future-studio/projects/41f5cf32-7bb6-43c9-9677-84c2c635de43"><img src="https://camo.githubusercontent.com/fd89d5815debd9dbfc83079a31fb758000356009/68747470733a2f2f6e6f646573656375726974792e696f2f6f7267732f6675747572652d73747564696f2f70726f6a656374732f34316635636633322d376262362d343363392d393637372d3834633263363335646534332f6261646765" alt="NSP Status" data-canonical-src="https://nodesecurity.io/orgs/future-studio/projects/41f5cf32-7bb6-43c9-9677-84c2c635de43/badge" style="max-width:100%;"></a>
    <a href="https://snyk.io/test/github/fs-opensource/hapi-geo-locate"><img src="https://camo.githubusercontent.com/a3b4309f8139ab05f486dc97807b8a13fd071503/68747470733a2f2f736e796b2e696f2f746573742f6769746875622f66732d6f70656e736f757263652f686170692d67656f2d6c6f636174652f62616467652e737667" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/fs-opensource/hapi-geo-locate/badge.svg" style="max-width:100%;"></a>
    <a href="https://www.npmjs.com/package/hapi-geo-locate"><img src="https://camo.githubusercontent.com/5eed05045c5bbe5ba8619779fa5cb790be4e160e/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f686170692d67656f2d6c6f636174652e737667" alt="hapi-geo-locate Version" data-canonical-src="https://img.shields.io/npm/v/hapi-geo-locate.svg" style="max-width:100%;"></a>
</p>


## Introduction
A hapi plugin to geo locate requests by IP and provide `request.location` in your route handlers. The plugin uses [ipinfo.io](http://ipinfo.io/) for the IP geo location.


## Requirements
The plugin is written in ES2015, please use **Node.js v4 or later**.


## Installation
Add `hapi-geo-locate` as a dependency to your project:

```bash
npm i -S hapi-geo-locate
# you’re using NPM shortcuts to (i)nstall and (-S)ave the module as a dependency
```


## Usage
The most straight forward way to register the `hapi-geo-locate` plugin:

```js
server.register(require('hapi-geo-locate'), (err) => {
    if (err) {
        // handle plugin registration error
    }

    // went smooth like chocolate :)
})

// Within your route handler functions, you can access the location like this
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        const location = request.location

        // use client location

        reply(location)
    }
})
```


## Plugin Registration Options
The following plugin options allow you to customize the default behavior of `hapi-geo-locate`:

- **enabledByDefault**: `(boolean)`, default: `true` — by default, the plugin geo locates the request by IP on every request

```js
server.register({
    register: require('hapi-geo-locate'),
    options: {
        enabledByDefault: true
    }
}, (err) => {
    // …
})

// Within your route handler functions, you can access the location like this
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        const location = request.location // will be undefined
        reply(location)
    }
})
```


## Route Handler Options
The following plugin options on individual route handlers allow you to customize the behavior of `hapi-geo-locate`:

- **enabled**: `(boolean)` — tells the plugin to enable (`true`) or disable (`false`) geo location for the request by IP
- **fakeIP**: `(string)` — tells the plugin to use the defined IP address to geo locate the request (by this IP)

The plugin configuration can be customized for single routes using the `hapi-geo-locate` key:

```js
server.register({
    register: require('hapi-geo-locate') // enabled by default)
}, (err) => {
    // …
})

// Within your route handler functions, you can access the location like this
server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        const location = request.location
        // use the location

        reply(location)
    },
    config: {
        plugins: {
            'hapi-geo-locate': {
                enabled: true,
                fakeIP: '4.4.4.4'
            }
        }
    }
})
```


## Supported Proxies
`hapi-geo-locate` supports all proxies that [request-ip](https://github.com/pbojinov/request-ip) does:

- `X-Client-IP`
- `X-Forwarded-For`, picking the first, client IP if the request went through multiple proxies.
- `X-Forwarded`, `Forwarded-For` and `Forwarded` as variations of `X-Forwarded-For`
- `CF-Connecting-IP`
- `True-Client-Ip`
- `X-Real-IP`
- `X-Cluster-Client-IP`
- and all the `request.[connection|socket|info].remoteAddress` variations.

If the IP address cannot be found, `null` is returned.

Running your application behind a (reverse) proxy like nginx, the client’s IP address gets reset to localhost.
You can grab the actual request IP to your app using an HTTP header.

`hapi-geo-locate` uses the [request-ip](https://github.com/pbojinov/request-ip) package to determine the external IP address. This package supports
all common HTTP headers and ways to get the request’s IP. Awesome!

You should be safe in any way :)


## Feature Requests
Do you miss a feature? Please don’t hesitate to
[create an issue](https://github.com/fs-opensource/hapi-geo-locate/issues) with a short description of your
desired addition to this plugin.


## Links & Resources

- [hapi tutorial series](https://futurestud.io/tutorials/hapi-get-your-server-up-and-running)
- [node-ipinfo](https://github.com/IonicaBizau/node-ipinfo): Node.js wrapper for the [ipinfo.io](http://ipinfo.io) API
- [request-ip](https://github.com/pbojinov/request-ip): Node.js module for retrieving a request’s IP address


## Contributing

1.  Create a fork
2.  Create your feature branch: `git checkout -b my-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request 🚀


## License

MIT © [Future Studio](https://futurestud.io)

---

> [futurestud.io](https://futurestud.io) &nbsp;&middot;&nbsp;
> GitHub [@fs-opensource](https://github.com/fs-opensource/) &nbsp;&middot;&nbsp;
> Twitter [@futurestud_io](https://twitter.com/futurestud_io)
