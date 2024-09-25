import {getApiKey} from './gaodeMap';

/**
 * 实时获取天气信息
 * @param cityCode
 * @returns {Promise<{visibility: *, windpower, weather, temperature, humidity, winddirection}>}
 */
export async function getWeatherInfo(cityCode) {
    const apiKey = await getApiKey();
    return new Promise((resolve, reject) => {
        wx.request({

            // url: `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=${apiKey}&extensions=all`,
            url: `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=${apiKey}`,
            method: 'GET',
            success: res => {
                // console.log('Weather Info Response:', res); // 打印响应数据
                if (res.statusCode === 200 && res.data.status === '1') {
                    const lives = res.data.lives;
                    if (Array.isArray(lives) && lives.length > 0) {
                        const weather = lives[0];
                        resolve({
                            weather: weather.weather,
                            temperature: weather.temperature,
                            winddirection: weather.winddirection,
                            windpower: weather.windpower,
                            humidity: weather.humidity,
                            visibility: weather.visibility
                        });
                    } else {
                        reject(new Error('获取天气信息失败：没有找到天气数据'));
                    }
                } else {
                    reject(new Error(`获取天气信息失败: ${res.data.info}`));
                }
            },
            fail: err => {
                reject(err);
            }
        });
    });
}

/**
 * 获取三天天预报
 * @param cityCode
 * @returns {Promise<unknown>}
 */
export async function getWeatherForecast(cityCode) {
    const apiKey = await getApiKey();
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${cityCode}&key=${apiKey}&extensions=all`;

    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            method: 'GET',
            success: (res) => {
                if (res.statusCode === 200 && res.data.status === '1') {
                    const forecasts = res.data.forecasts[0].casts;
                    const forecastData = {};

                    forecasts.forEach(forecast => {
                        const date = forecast.date;
                        const dayOfWeek = getDayOfWeek(date);
                        forecastData[forecast.date] = {
                            dayOfWeek: dayOfWeek,
                            weather: forecast.dayweather,
                            temperature: `${forecast.daytemp}℃ ~ ${forecast.nighttemp}℃`,
                            winddirection: forecast.daywind,
                            windpower: forecast.daypower
                        };
                    });
                    resolve(forecastData);
                } else {
                    reject(new Error(`获取天气信息失败: ${res.data.info}`));
                }
            },
            fail: (error) => {
                reject(error);
            }
        });
    });
}
// 获取星期几
function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return days[date.getDay()];
}

