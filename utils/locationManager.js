import {getApiKey} from './gaodeMap';
import  {getUserLocation} from "./locationService";

// 获取用户定位授权
function requestUserAuthorization() {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: res => {
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: () => resolve(),
                        fail: err => reject(err)
                    });
                } else {
                    resolve();
                }
            },
            fail: err => reject(err)
        });
    });
}
/**
 * 获取定位地址和经纬度信息
 * @param latitude
 * @param longitude
 * @returns {Promise<unknown>}
 */
function getAddress(latitude, longitude) {
    const key = getApiKey();
    const url = `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${key}`;

    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            method: 'GET',
            success: res => {
                if (res.data.status === '1' && res.data.info === 'OK') {
                    const address = res.data.regeocode.formatted_address;
                    resolve(address);
                } else {
                    reject(new Error('解析地址失败'));
                }
            },
            fail: err => reject(err)
        });
    });
}

export async function getLocationAndAddress() {
    try {
        await requestUserAuthorization();
        const {latitude, longitude} = await getUserLocation();
        const address = await getAddress(latitude, longitude);
        return {latitude, longitude, address};
    } catch (error) {
        console.error('获取位置和地址失败', error);
        throw error;
    }
}
