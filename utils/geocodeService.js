import {getApiKey} from './gaodeMap';

/**
 * 获取地址编码
 * @param lng
 * @param lat
 * @returns {Promise<*>}
 */
export async function getCityCodeFromLatLng(lng, lat) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://restapi.amap.com/v3/geocode/regeo?key=${getApiKey()}&location=${lng},${lat}`,
            method: 'GET',
            success: res => {
                if (res.data.status === '1' && res.data.regeocode.formatted_address) {
                    const addressComponent = res.data.regeocode.addressComponent;
                    resolve(addressComponent.adcode);
                } else {
                    reject(new Error('逆地理编码失败'));
                }
            },
            fail: err => {
                reject(err);
            }
        });
    });
}

