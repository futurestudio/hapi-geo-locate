# Changelog

## Version 1.1.0 (2017-xx-xx)
- detect client IP if request goes through multiple proxies  
- add changelog to keep track of changes during releases

## Version 1.0.0 (2016-12-27)
- provide client location at `request.location` in route handler
- option to have the plugin `enabledByDefault`
- detect client IP from `request.info.remoteAddress`
- detect client IP through `x-forwared-for` header
