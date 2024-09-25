// pages/weather/weather.js
import {getLocationAndAddress} from '../../utils/locationManager';
import {getCityCodeFromLatLng} from "../../utils/geocodeService";
import {getWeatherInfo,getWeatherForecast} from "../../utils/weatherService";
import {getUserLocation} from "../../utils/locationService";
import {extractAddressDetails} from "../../utils/extractAddressDetails";

Page({

    /**
     * 页面的初始数据
     */
    data() {
        return {
            location: null,
            address: '',
            weatherInfo: null,
            weather3dInfo: []
        };
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getLocation();
        this.getWeatherInfo();
        this.getWeatherForecast()
    },

    /**
     * 获取用户位置和地址
     */
    getLocation: async function () {
        try {
            const data = await getLocationAndAddress();
            const addressDetails = await extractAddressDetails(data.address)
            this.setData({
                location: {
                    latitude: data.latitude,
                    longitude: data.longitude
                },
                address: addressDetails
            });
        } catch (error) {
            console.error('获取位置和地址失败', error);
        }
    },
    /**
     * 获取实时天气信息
     * @returns {Promise<void>}
     */
    getWeatherInfo: async function () {
        try {
            const location = await getUserLocation();
            const lng = location.longitude;
            const lat = location.latitude;
            const cityCode = await getCityCodeFromLatLng(lng, lat);
            const weatherData = await getWeatherInfo(cityCode);
            this.setData({
                weatherInfo: weatherData
            });
        } catch (error) {
            console.error('获取天气信息失败', error);
            this.setData({weatherInfo: null});
        }
    },

    /**
     * 获取未来三天天气预报
     * @returns {Promise<void>}
     */
    getWeatherForecast: async function () {
        try {
            const location = await getUserLocation();
            const lng = location.longitude;
            const lat = location.latitude;
            // 根据经纬度获取城市编码
            const cityCode = await getCityCodeFromLatLng(lng, lat);
            // 获取天气预报数据
            const weatherData = await getWeatherForecast(cityCode);
            // 打印并设置天气数据
            // console.log(weatherData);
            this.setData({
                weather3dInfo: weatherData
            });
        } catch (error) {
            // 处理错误并设置默认值
            console.error('获取未来三天天气预报失败', error);
            this.setData({ weatherInfo: null });
        }
    },
    /**
     * 格式化日期
     * @param dateString
     * @returns {string}
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const month = date.getMonth() + 1; // 月份从0开始
        const day = date.getDate();
        return `${month}/${day}`;
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        console.log('页面在刷新');
        //调用 this.getLocation()方法
        this.getUserLocation();

        setTimeout(() => {
            wx.stopPullDownRefresh();
            console.log('页面刷新结束');
        }, 2000);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})