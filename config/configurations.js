const env = process.env.NODE_ENV || 'development';

function getConfig(type) {
  return require(`./${type}.${env}.json`);
}

module.exports = {
  getConfig
};
