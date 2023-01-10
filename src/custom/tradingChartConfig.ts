/* eslint-disable */
import { ThemeName } from '../charting_library/charting_library.min';
import { colors } from '../constants';
import { convertRgbToHex, getStylesValueByKey } from '../helpers';

export const customWidgetParams = {};

export const customWidgetOptions = (colorTheme?: string) => {
    if (colorTheme === 'light') {
        return ({
            toolbar_bg: colors.light.chart.primary,
            loading_screen: {
                backgroundColor: colors.light.chart.primary,
            },
            overrides: {
                ['symbolWatermarkProperties.color']: colors.light.chart.primary,
                ['volumePaneSize']: 'iny',
                ['mainSeriesProperties.candleStyle.upColor']: colors.light.chart.up,
                ['mainSeriesProperties.candleStyle.downColor']: colors.light.chart.down,
                ['mainSeriesProperties.candleStyle.borderUpColor']: colors.light.chart.up,
                ['mainSeriesProperties.candleStyle.borderDownColor']: colors.light.chart.down,
                ['mainSeriesProperties.candleStyle.wickUpColor']: colors.light.chart.up,
                ['mainSeriesProperties.candleStyle.wickDownColor']: colors.light.chart.down,
                ['paneProperties.background']:  colors.light.chart.primary,
                ['paneProperties.vertGridProperties.color']: colors.light.chart.primary,
                ['paneProperties.vertGridProperties.style']: 1,
                ['paneProperties.horzGridProperties.color']: colors.light.chart.primary,
                ['paneProperties.horzGridProperties.style']: 1,
                ['paneProperties.crossHairProperties.color']: colors.light.chart.primary,
                ['paneProperties.crossHairProperties.width']: 1,
                ['paneProperties.crossHairProperties.style']: 1,
                ['scalesProperties.backgroundColor']: colors.light.chart.primary,
                ['scalesProperties.lineColor'] : '#d9dce1',
            },
            theme: 'Light' as ThemeName,
        });
    }

    const primaryColor = '#131722';
    const upColor = '#007a6a';
    const downColor = '#e35461';
    const borderColor = '#2f333e';



    return ({
        toolbar_bg: primaryColor,
        loading_screen: {
            backgroundColor: primaryColor,
        },
        overrides: {
            ['symbolWatermarkProperties.color']: primaryColor,
            ['volumePaneSize']: 'iny',
            ['mainSeriesProperties.candleStyle.upColor']: upColor,
            ['mainSeriesProperties.candleStyle.downColor']: downColor,
            ['mainSeriesProperties.candleStyle.borderUpColor']: upColor,
            ['mainSeriesProperties.candleStyle.borderDownColor']: downColor,
            ['mainSeriesProperties.candleStyle.wickUpColor']: upColor,
            ['mainSeriesProperties.candleStyle.wickDownColor']: downColor,
            ['paneProperties.background']: primaryColor,
            ['paneProperties.vertGridProperties.color']: primaryColor,
            ['paneProperties.vertGridProperties.style']: 1,
            ['paneProperties.horzGridProperties.color']: primaryColor,
            ['paneProperties.horzGridProperties.style']: 1,
            ['paneProperties.crossHairProperties.color']: primaryColor,
            ['paneProperties.crossHairProperties.width']: 1,
            ['paneProperties.crossHairProperties.style']: 1,
            ['scalesProperties.backgroundColor']: primaryColor,
            ['scalesProperties.lineColor'] : borderColor,
        },
        studies_overrides: {
            ['volume.volume.color.0']: downColor,
            ['volume.volume.color.1']: upColor,
        },
        theme: 'Dark' as ThemeName,
    });
};
