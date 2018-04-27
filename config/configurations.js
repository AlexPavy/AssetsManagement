function getConfig(type) {
  const env = process.env.NODE_ENV || 'development';
  return require(`./${type}.${env}.json`);
}

function getApiKeys() {
  return require("./secret_keys")
}

module.exports = {
  getConfig,
  getApiKeys,
};
