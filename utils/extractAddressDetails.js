/**
 * 提取地址中的省市区县街道等信息
 * @param fullAddress
 * @returns {Promise<void>}
 */
export async function extractAddressDetails(fullAddress) {
    const components = [];
    // 匹配县或区
    const countyOrDistrictMatch = fullAddress.match(/([^\s]+[县区])/);
    if (countyOrDistrictMatch) {
        components.push(countyOrDistrictMatch[1]);
    }
    // 匹配街道或路
    const streetOrRoadMatch = fullAddress.match(/([^\s]+[街道路])/);
    if (streetOrRoadMatch) {
        components.push(streetOrRoadMatch[1]);
    }
    return components.join('');

}