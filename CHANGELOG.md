# Changelog


## Version [4.1.1](https://github.com/futurestudio/hapi-geo-locate/compare/v4.1.0...v4.1.1) - 2020-08-05

### Updated
- bump dependencies
- test against Node.js v14
- replaced `request-ip` dependency with `@supercharge/request-ip` improving request IP detection


## Version [4.1.0](https://github.com/futurestudio/hapi-geo-locate/compare/v4.0.0...v4.1.0) - 2020-04-05

### Added
- new plugin option: `authToken`
  - the `authToken` option represents the IPinfo API token to authenticate requests

### Updated
- bump dependencies


## Version [4.0.0](https://github.com/futurestudio/hapi-geo-locate/compare/v3.2.0...v4.0.0) - 2020-01-10

### Breaking Changes
- require Node.js v12
  - this change aligns with the hapi ecosystem requiring Node.js v12 with the release of hapi 19


## Version [3.2.0](https://github.com/futurestudio/hapi-geo-locate/compare/v3.1.5...v3.2.0) - 2019-10-17

### Added
- basic TypeScript declarations in `lib/index.d.ts`


## Version [3.1.5](https://github.com/futurestudio/hapi-geo-locate/compare/v3.1.4...v3.1.5) - 2019-10-12

### Updated
- bump dependencies
- minor refactorings
- increase test timeouts
- Readme: rename GitHub references `fs-opensource -> futurestudio`


## Version [3.1.4](https://github.com/futurestudio/hapi-geo-locate/compare/v3.1.3...v3.1.4) - 2019-04-24

### Updated
- update to hapi scoped dependencies
- bump dependencies


## Version [3.1.3](https://github.com/futurestudio/hapi-geo-locate/compare/v3.1.2...v3.1.3) - 2019-02-18

### Updated
- bump dependencies
- fix badges in Readme


## Version [3.1.2](https://github.com/futurestudio/hapi-geo-locate/compare/v3.1.1...v3.1.2) - 2019-01-26

### Updated
- Readme: rename GitHub references `fs-opensource -> futurestudio`


## Version [3.1.1](https://github.com/futurestudio/hapi-geo-locate/compare/v3.1.0...v3.1.1) - 2019-01-22

### Added
- test plugin for hapi 18

### Updated
- fix plugin subtitle in readme
- remove NSP badge from readme
- minor code changes
- bump dependencies


## Version [3.1.0](https://github.com/futurestudio/hapi-geo-locate/compare/v3.0.2...v3.1.0) - 2018-12-06
- `add` Node.js v11 as version in Travis CI
- `update` refactor code to IP locator class
- `update` dependencies: `request-ip` now supports more ways to find the client’s IP address
- `update` tests: minor refactorings
- `remove` NPM’s `package-lock.json` from repository


## Version [3.0.2](https://github.com/futurestudio/hapi-geo-locate/compare/v3.0.1...v3.0.2) - 2018-08-21
- `add` keywords in package.json
- `update` readme: reformat, quick navigation and logo size fix for small screens
- `update` logo: minify file


## Version 3.0.1 (2018-02-12)
- `update` code to be use async/await instead of promise
- `update` code examples in readme to async/await
- `bump` dependencies

## Version 3.0.0 (2017-11-06)
- `update` readme to show hapi v17 functionality
- `update` dependencies to newest versions
- `update` Node.js versions on travis to 8 and 9

## Version 3.0.0-rc.1 (2017-11-01)
- `update` hapi-geo-locate to support hapi v17
- `update` library and tests to support new async/await structure

## Version 2.2.1 (2017-10-18)
- `add` ESLint file `.eslintrc.json` for hapi-style code formatting
- `add` option to lint code while testing (lab does that with the `--lint` flag)
- `add` required Node.js to `engines` field in `package.json` (To make sure that NPM follows the Node.js v4+ requirement)
- `update` code formatting to hapi-style
- `update` dependencies

## Version 2.2.0 (2017-05-30)
- use [request-ip](https://github.com/pbojinov/request-ip) package to determine the external IP address (`request-ip` supports a lot more ways to get the IP 👌)
- `update` dependencies
- `update` README and point out that all ways of determining the external IP address that are supported :)

## Version 2.1.0 (2017-05-04)
- `add` route option `fakeIP` to use a defined IP address for geo location

## Version 2.0.0 (2017-05-01)
- `update` route settings to listen on `hapi-geo-locate` instead of `hapiGeoLocate` (breaking change)
- add logo

### Migration for Breaking Changes
- check your routes where your reference `hapiGeoLocate` and replace it with `'hapi-geo-locate'`. With the new style,
 route options and plugin name match.

## Version 1.1.2 (2017-03-24)
- add project badges for TravisCI, Snyk and NSP (both checking for dependency vulerabilities), NPM
- `fix` wrong import code in README
- `add` 2017 to license

## Version 1.1.1 (2017-02-12)
- change extension point from `onPreHandler` to `onPreAuth` to determine the location before validation
- improve tests for proxied requests and check explicitly for correct client IP address

## Version 1.1.0 (2017-02-01)
- detect client IP if request goes through multiple proxies ([thank you Anton!](https://futurestud.io/tutorials/hapi-geo-locate-hapi-plugin-for-client-geo-location-by-future-studio#comment-3092108774))
- add changelog to keep track of changes during releases

## Version 1.0.0 (2016-12-27)
- provide client location at `request.location` in route handler
- option to have the plugin `enabledByDefault`
- detect client IP from `request.info.remoteAddress`
- detect client IP through `x-forwared-for` header
