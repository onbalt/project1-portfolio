module.exports = {
  root: './build',

  autoprefixerConfig: ['last 3 version', '> 1%', 'ie 8', 'ie 9', 'Opera 12.1'],

  pxtoremPlusConfig: {
    rootValue: 16,
    propList: ['*'],
    selectorBlackList: ['html', '.skills__circle', '.preloader-svg'],
    // replace: false
    minPixelValue: 2
  }
};