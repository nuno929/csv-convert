# CSV変換ツール
## 概要
- 本ツールは、CSV変換処理の実装を呼び出すツールである
    - node.jsでの実装は、windows、macともに、簡単に環境構築できるためである
        - ※ windowsでの動作は未検証
- コマンドラインから、node.jsで書かれた設定ファイルを読み込み、csv変換を実行する 

### 環境構築
- node.jsのinstall
    - 以下のURLからダウンロード
        - https://nodejs.org
- node_modulesのinstall
    - `npm install`

### 変換処理の実行方法
- 以下のコマンドで実効
    - `npm run convert -c./hogehoge.js -iinput.csv -ooutput.csv` 

#### コマンドライン引数

|引数名|略字|必須|デフォルト値|概要|
|--|--|--|--|--|
|--config-file|-c|[x]||node.jsで書かれた設定ファイルの相対パスを入力する|
|--input-csv|-i|[x]||変換元のCSVのパスを入力する|
|--output-csv|-0|[]|output.csv|node.jsで書かれた設定ファイルの相対パスを入力する|

## 設定ファイルのスキーマ
```node.js
    module.exports = {
        // 入力CSVのパース方法を指定する
        inputSettings: {
            // csvのパース方法を選択する
            // 入力CSVの列名が重複している場合に、falseにする
            //  ※ 現状、trueの場合しか実装していない
            json: true,

            // 列名をキーにした連想配列になる
            parses: {
                // columnValueには、対応する列の値が入る
                '列名': (columnValue) => {
                    // 整形したデータを返す
                    return columnValue
                }
            }
        },

        // 変換後のCSVの出力方法を設定する
        outputSettings: {
            outputs: {
                // 出力CSVのカラムを配列で設定する
                columns: [
                    {
                        name: '列名',
                        default: '固定値',
                        from: 'データソースとなる入力CSVの列名',
                        // 変換処理を記載する。引数には、fromで指定した列の値が入る
                        convert: (fromValue) => {
                            return fromValue
                        }
                    }
                ]
            }
        }
    }
```