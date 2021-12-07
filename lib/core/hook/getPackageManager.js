'use strict';

function getPackageManager() {
  if (!process.env.npm_config_user_agent) {
    return void 0;
  }
  return pmFromUserAgent(process.env.npm_config_user_agent);
}
function pmFromUserAgent(userAgent) {
  const pmSpec = userAgent.split(" ")[0];
  const position = pmSpec.lastIndexOf("/");
  return {
    name: pmSpec.substr(0, position),
    version: pmSpec.substr(position + 1)
  };
}
module.exports = getPackageManager;
