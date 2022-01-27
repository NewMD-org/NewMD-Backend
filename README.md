# MdTimetableAPI
## 用途
抓取明道中學各班的課表

## APIs
1. 抓取特定班級之最新課表(以學期課表為主)
    > https://md-apps.herokuapp.com/API/{className}
    - **參數**  
        className: 班級代號 (例: Y313, X212)
    - **Response**  
        data: json object 分成當週個天每節課之課表，每節課的資訊也皆為一物件包刮classname(科目)以及teacher(教師)
2. 抓取特定班級之特定學期週課表
    > https://md-apps.herokuapp.com/API/{className}/{year}/{week}
    - **參數**  
        className: 班級代號 (例: Y313, X212)  
        year: 學年度，為兩部代號組成，其一為學年(民國年，如110)，其二為學期(1為上學期，2為下學期，3為暑假，4為寒假)，兩者相加則為此參數的全貌(如110年之上學期為1101)  
        week: 週次，為當學期之第幾週  
    - **Response**  
        data: json object 分成當週個天每節課之課表，每節課的資訊也接為一物件包刮classname(科目)以及teacher(教師)

## Example
**Code:(js)**
```js
try {
    let data = await fetch('https://md-apps.herokuapp.com/API/Y313/1101/2');
    data = await data.json();
    console.log(data);
}catch(err) {
    console.log('fetch err');
    console.error(err);
}
```
**Response:**
```json
{
    "day1":{
        "1":{"classname":"英文","teacher":"吳O甄"},
        "2":{"classname":"體育","teacher":"林O民"},
        "3":{"classname":"物理","teacher":"賴O宏"},
        "4":{"classname":"地球科學","teacher":"黃O娟"},
        "5":{"classname":"萬花筒中的世界觀","teacher":"蘇O群"},
        "6":{"classname":"國文","teacher":"李O真"}.....(略)
```
## Contributors
**[Anonymous-AAAA](https://github.com/Anonymous-AAAA)**  
**[LAZPbanahaker](https://github.com/banahaker)**  