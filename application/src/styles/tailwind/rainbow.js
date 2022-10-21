const common = require('./common.js');

module.exports = {
    ...common,
    theme: {
        ...common.theme,
        colors: {
            ...common.theme.colors,
            ctaBlue: '#BEE1E6',
            grey: '#F5F5F5',
            grey2: '#F9F9F9',
            grey3: '#8F8F8F',
            grey4: '#DFDFDF',
            grey5: '#BBBBBB',
            buttonBg1: '#FBDCCE',
            buttonBg2: '#FAD2E1',
            buttonText: '#9E8376',
            green: '#DAF5CB',
            pink: '#FCE8F0',
            green2: '#83B69D',
            black: '#0E0E0E',
            white: '#ffffff',
        },
        fontFamily: {
            ...common.theme.fontFamily,
            text: ['Raleway', 'sans-serif'],
        },
    },
};
