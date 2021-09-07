'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getPackageManager() {
  if (!process.env.npm_config_user_agent) {
    return undefined;
  }

  return pmFromUserAgent(process.env.npm_config_user_agent);
}

function pmFromUserAgent(userAgent) {
  const pmSpec = userAgent.split(' ')[0];
  const pos = pmSpec.lastIndexOf('/');
  return {
    name: pmSpec.substr(0, pos),
    version: pmSpec.substr(pos + 1)
  };
}

exports['default'] = getPackageManager;
exports.getPackageManager = getPackageManager;
