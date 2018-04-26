function getConfig(type) {
  const env = process.env.NODE_ENV || 'development';
  return require(`./${type}.${env}.json`);
}

module.exports = {
  getConfig
};
