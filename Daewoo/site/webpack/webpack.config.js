const path = require('path'); //브라우저내에서는 사용X 

module.exports = {
  entry: './src/index.js', //번들링이되는 최종 목적지. 여기에 css, png를 모을 수 있음 
  output: {     //아웃풋이 된 후에 dist아래에 있는 파일들의 설정이 여기서 이루어짐
    filename: 'bundle.js',  //설정안하면 기본은 main.js 
    path: path.resolve(__dirname, './dist'), //현재 디렉토리 기준으로 상대경로 알아서 지정
    publicPath: 'dist/'
},
  mode: 'none', //development나 production 여기서 설정
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: 200 * 1024 // 3 Kilobyte
          }
        }
      },
      {
        test: /\.txt/,
        type: 'asset/source'
      },
      {
        test: /\.css/,
        use: [
          'style-loader', 'css-loader'
        ]
      },
      {
        test: /\.scss/,
        use: [
          'style-loader', 'css-loader', 'sass-loader'
          
        ]
      }
    ]
  }
}