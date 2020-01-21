// コマンドからの引数を取得可能にする
const commander = require('commander')
  .option('-c, --config-file <type>')
  .option('-i, --input-csv <type>')
  .option('-o, --output-csv <type>')
commander.parse(process.argv)

// 設定ファイルの読み込み
const { getConfig } = require('./config.js')
const config = getConfig(commander.configFile)
const parseJson = config.inputSettings.json

const fileStream = require('fs')
const csvParser = require('csv')

// 出力のロジック
const exportCsv = (data) => {
  csvParser.stringify(data, (error, rawOutput) => {
    const outputCsv = commander.outpuCsv || 'output.csv'
    const output = iconv.encode(rawOutput, "Shift_JIS")
    fileStream.writeFile(outputCsv, output, (error) => {
      if (error) {
        throw new Error(error)
      }
    })
  })
}

// 設定ファイルの読み込みロジックを適用する
const convertRow = (row) => {
  const parses = { ...config.inputSettings.parses }
  Object.keys(parses).forEach((key) => {
    const fromValue = row[key]
    row[key] = parses[key](fromValue)
  })

  const newRow = []

  // 列の生成
  config.outputSettings.columns.forEach(column => {
    let value = null

    if ('default' in column) {
      value = column.default
    }

    if ('from' in column) {
      value = row[column.from]
    }

    if ('convert' in column) {
      value = column.convert(value)
    }

    newRow.push(value)
  })

  return newRow
}

// 入出力のロジック
const convertCsv = (error, data) => {
  const newData = data.map(convertRow)

  const header = config.outputSettings.columns.map(column => column.name)
  newData.unshift(header)
  exportCsv(newData)
}

const iconv = require("iconv-lite")
fileStream
  .createReadStream(commander.inputCsv)
  .pipe(iconv.decodeStream('Shift_JIS'))
  .pipe(csvParser.parse({ columns: parseJson }, convertCsv))