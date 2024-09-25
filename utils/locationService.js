//获取定位信息
export function getUserLocation() {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'gcj02',
            success: res => {
                const latitude = res.latitude;
                const longitude = res.longitude;
                resolve({latitude, longitude});
            },
            fail: err => reject(err)
        });
    });
}

