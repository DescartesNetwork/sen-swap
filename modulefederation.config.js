const name = process.env.REACT_APP_ID

module.exports = {
  name,
  filename: 'index.js',
  shared: {
    react: { singleton: true, requiredVersion: '^17.0.2' },
    'react-dom': { singleton: true, requiredVersion: '^17.0.2' },
    'react-router-dom': { singleton: true, requiredVersion: '^5.3.0' },
    '@reduxjs/toolkit': { singleton: true, requiredVersion: '^1.6.2' },
    'react-redux': { singleton: true, requiredVersion: '^7.2.5' },
    antd: { singleton: true, requiredVersion: '^4.23.0' },
    '@sentre/senhub': { singleton: true, requiredVersion: '^4' },
  },
  remotes: {
    '@frame/sen_assets':
      'sen_assets@https://descartesnetwork.github.io/sen-assets/index.js',
  },
  exposes: {
    './bootstrap': 'bootstrap.app',
  },
}
