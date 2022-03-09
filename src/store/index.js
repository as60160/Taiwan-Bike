import { createStore } from "vuex";
import axios from "axios";
import GetAuthorizationHeader from "@/assets/api.js";

export default createStore({
  // strict: true,
  state: {
    loading: false,
    cities: [],
    currentCity: "Kaohsiung",
    currentTown: "前鎮區",
    routes: [],
    currentRoute: [],
  },
  getters: {
    townList(state) {
      return (
        state.cities.find((c) => c.City === state.currentCity)?.AreaList || null
      );
    },
    routeList(state) {
      return state.routes
        .filter((route) => route.Town === state.currentTown)
        .filter((route) => route.RoadSectionStart && route.RoadSectionEnd);
    },
  },
  mutations: {
    SET_LOADING(state, val) {
      state.loading = val;
    },
    SET_CITIES(state, data) {
      state.cities = data;
    },
    SET_CURRENT_CITY(state, data) {
      state.currentCity = data;
    },
    SET_CURRENT_TOWN(state, data) {
      state.currentTown = data;
    },
    SET_ROUTES(state, data) {
      state.routes = data;
    },
    SET_CURRENT_ROUTE(state, data) {
      state.currentRoute = data;
    },
  },
  actions: {
    async GET_CITIES(context) {
      context.commit("SET_LOADING", true);

      const catchLocations = await axios({
        method: "get",
        url: "https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json",
      })
        .then((res) => {
          // console.log("locations", res.data);
          return res.data;
        })
        .catch((err) => console.log("err of location:", err));

      const catchCities = await axios({
        method: "get",
        url: "https://gist.transportdata.tw/gist_api/V3/Map/Basic/City?$format=JSON",
      })
        .then((res) => {
          // console.log("cities", res.data);
          return res.data;
        })
        .catch((err) => console.log("err of cities", err));

      const list = [];
      catchLocations.forEach((location) => {
        catchCities.forEach((city) => {
          if (location.CityName === "新竹市") return;
          if (location.CityName === city.CityName) {
            const { CityName, City } = city;
            const { AreaList } = location;
            list.push({ CityName, City, AreaList });
          }
        });
      });

      // console.log("list", list);
      context.commit("SET_CITIES", list);
      context.commit("SET_LOADING", false);
    },
    async GET_ROUTES(context) {
      context.commit("SET_LOADING", true);
      const city = context.state.currentCity;

      const data = await axios({
        method: "get",
        url: `https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${city}?%24format=JSON`,
        headers: GetAuthorizationHeader(),
      })
        .then((res) => {
          // console.log("shape", res.data);
          return res.data;
        })
        .catch((err) => console.log("err of shape:", err));

      context.commit("SET_ROUTES", data);
      context.commit("SET_LOADING", false);
    },
  },
  modules: {},
});
