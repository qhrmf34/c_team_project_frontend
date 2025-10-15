// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 개발 서버 설정
  devServer: {
    port: 8080,
    hot: true,
    // HMR 관련 설정
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: false, // 런타임 에러 오버레이 비활성화
      },
    },
  },

})
