const validateConfig = (config) => {
  // TODO: 必須項目を作成する
}

const getConfig = (filePath) => {
  const config = require(`${filePath}`)
  validateConfig(config)

  return config
}

module.exports = {
  getConfig
}
