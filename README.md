# Taiwan Bike

![Taiwan Bike](https://i.imgur.com/1T0LQg5.png)

## Demo
https://as60160.github.io/Taiwan-Bike/


## 簡介
- 串接 「[交通部PTX平臺](https://tdx.transportdata.tw/api-service/swagger)」 自行車資料，呈現自行車路線及站點資訊。
- 採用 [ivan_chang 的設計稿](https://2021.thef2e.com/users/6296432819610583743?week=2&type=1)
- The F2E 3rd 活動


### 功能
- 可選擇縣市鄉鎮，列出自行車路線
- 點擊自行車路線後，於地圖呈現此路線及起訖點
- 可點擊地圖中 YouBike 按鈕，切換顯示 YouBike 站點。
- 點擊 YouBike 站點能瀏覽該站點資訊 (名稱、地址、可租、可還的 YouBike 數量)。
- 可瀏覽 TDX 最新 30 筆消息


### 使用的技術、框架
- Vue CLI
- Vue Router
- Vuex
- Bootstrap
- SCSS
- Babel
- axios
- jsSHA
- leaflet
