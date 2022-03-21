<template>
  <div class="col-12 col-lg-8 pb-3">
    <div id="map"></div>
    <a href="#" id="showStationBtn" @click.prevent>
      <img
        src="@/assets/img/btn_bike_close.svg"
        alt="show bike station"
        @click="toggleStations"
        v-if="!showStations"
      />
      <img
        src="@/assets/img/btn_bike_open.svg"
        alt="show bike station"
        @click="toggleStations"
        v-else
      />
    </a>
    
  </div>
</template>

<script>
import store from "../store/index.js";
import "leaflet/dist/leaflet.css"
import L from "leaflet";
import Wkt from "wicket";
import axios from "axios";
import GetAuthorizationHeader from "@/assets/api.js";

const userLocationIcon = L.icon({
  iconUrl: require("@/assets/img/icon_myLocation.svg"),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const bikeRouteStartIcon = L.icon({
  iconUrl: require("@/assets/img/icon_route_start.svg"),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const bikeRouteEndIcon = L.icon({
  iconUrl: require("@/assets/img/icon_route_end.svg"),
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

const createStationIcon = (status) => {
  const imgName = status == 1 ? "icon_bike" : "icon_bike_outOfService"
  return L.icon({
    iconUrl: require(`@/assets/img/${imgName}.svg`),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -20],
  });
}

export default {
  props: {
    currentRoute: {
      type: Object,
    }
  },
  data(){
    return {
      searchCity: null,
      myMap: null,
      myLayer: null,
      longitude: 120.301697,
      latitude: 22.610657,
      geojsonFeature: null,
      routeStart: null,
      routeEnd: null,
      startMarker: null,
      endMarker: null,
      showStations: false,
      bikeStationList: [],
      bikeStationMarkers: [],
      stationAcceptableCities: [
        "Taichung",
        "Hsinchu",
        "MiaoliCounty",
        "NewTaipei",
        "PingtungCounty",
        "KinmenCounty",
        "Taoyuan",
        "Taipei",
        "Kaohsiung",
        "Tainan",
        "Chiayi",
      ],
    }
  },
  computed: {
    currentCity() {
      return store.state.currentCity;
    },
    userLocation() {
      return [this.latitude, this.longitude];
    }
  },
  watch: {
    currentRoute() {
      this.createPolyLine();
      this.checkCityForYouBikeStation();
    },
  },
  methods: {
    initMap() {
      this.myMap = L.map("map").setView(this.userLocation, 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.myMap);
      L.marker(this.userLocation, { icon: userLocationIcon }).addTo(this.myMap).bindPopup("現在位置");
    },
    removeLayer() {
      if (this.myLayer) {
        this.myMap.removeLayer(this.myLayer);
        this.myMap.removeLayer(this.startMarker);
        this.myMap.removeLayer(this.endMarker);
      }
    },
    createPolyLine() {
      if (!this.currentRoute) return;
      const wkt = new Wkt.Wkt();
      this.geojsonFeature = wkt.read(this.currentRoute.Geometry).toJson();
      this.removeLayer();
      const pathStyle = {
        color: "#007f77",
        weight: 8,
      }
      this.myLayer = L.geoJSON(this.geojsonFeature, { style: pathStyle }).addTo(this.myMap);
      this.myMap.fitBounds(this.myLayer.getBounds());
      this.routeStart = this.geojsonFeature.coordinates[0][0].reverse();
      this.routeEnd = this.geojsonFeature.coordinates[0][this.geojsonFeature.coordinates[0].length - 1].reverse();
      this.setStartMarker();
      this.setEndMarker();
    },
    setStartMarker() {
      this.startMarker = new L.marker(this.routeStart, { icon: bikeRouteStartIcon })
        .addTo(this.myMap)
        .bindPopup(
          /* html */
          `<div class="card">
            <div class="card-header">
              <h6 class="card-title">${this.currentRoute.RouteName}</h6>
            </div>
            <div class="card-body">
              <p class="card-text mt-0">起點：${this.currentRoute.RoadSectionStart}</p>
            </div>
          </div>`
        );
    },
    setEndMarker() {
      this.endMarker = new L.marker(this.routeEnd, { icon: bikeRouteEndIcon })
        .addTo(this.myMap)
        .bindPopup(
          /* html */
          `<div class="card">
            <div class="card-header">
              <h6 class="card-title">${this.currentRoute.RouteName}</h6>
            </div>
            <div class="card-body">
              <p class="card-text mt-0">終點：${this.currentRoute.RoadSectionEnd}</p>
            </div>
          </div>`
        );
    },
    getUserLocation() {
      navigator.geolocation.getCurrentPosition(position => {
        this.longitude = position.coords.longitude; // 經度
        this.latitude = position.coords.latitude; // 緯度
        this.myMap.setView(this.userLocation, 13)
        L.marker(this.userLocation, { icon: userLocationIcon }).addTo(this.myMap).bindPopup("現在位置");
      })
    },
    checkCityForYouBikeStation() {
      if (this.searchCity == this.currentCity) return
      this.searchCity = this.currentCity
      this.bikeStationList = [];
      this.showStations = false;
      this.clearStationMarkers();
      if (this.stationAcceptableCities.indexOf(this.searchCity) == -1) return;
      this.getBikeStationData();
    },
    getBikeStationData() {
      store.commit("SET_LOADING", true);
      axios({
        method: "get",
        url: `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/${this.searchCity}?%24format=JSON`,
        headers: GetAuthorizationHeader(),
      })
        .then((res) => {
          this.bikeStationList = res.data.map((item) => { 
            return { 
              uid: item.StationUID,
              name: item.StationName.Zh_tw,
              address: item.StationAddress.Zh_tw,
              position: [item.StationPosition.PositionLat, item.StationPosition.PositionLon],
              type: item.ServiceType,
            }
          });
          store.commit("SET_LOADING", false);
          this.getAvailableData();
        })
        .catch((err) => {
          console.log("err of station", err);
        });
    },
    getAvailableData() {
      store.commit("SET_LOADING", true);
      axios({
        method: "get",
        url: `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/${this.searchCity}?%24format=JSON`,
        headers: GetAuthorizationHeader(),
      })
        .then((res) => {
          res.data.forEach((available) => {
            this.bikeStationList.forEach((station) => {
              if (station.uid === available.StationUID) {
                station.rentBikes = available.AvailableRentBikes;
                station.returnBikes = available.AvailableReturnBikes;
                station.status = available.ServiceStatus;
              }
            })
          })
          store.commit("SET_LOADING", false);
        })
        .catch((err) => {
          console.log("err of available", err);
        });
    },
    toggleStations() {
      this.showStations = !this.showStations;
      store.commit("SET_LOADING", true);

      if (!this.showStations) {
        setTimeout(() => {
          this.clearStationMarkers()
          store.commit("SET_LOADING", false);
        }, 0)
        return;
      }

      this.checkCityForYouBikeStation();
      if (!this.bikeStationList.length) {
        this.showStations = false;
        store.commit("SET_LOADING", false);
        alert("抱歉，此縣市沒有提供 YouBike 服務！");
        return 
      }

      setTimeout(() => {
        this.setStationMarkers();
        store.commit("SET_LOADING", false);
      }, 0);
    },
    setStationMarkers() {
      this.bikeStationList.forEach((station) => {
        const stationIcon = createStationIcon(station.status);
        const marker = L.marker(station.position, { icon: stationIcon })
          .addTo(this.myMap)
          .bindPopup(
            /* html */
            `<div class="card">
              <div class="card-header">
                <h6 class="card-title m-0">${station.name}</h6>
              </div>
              <div class="card-body">
                <small class="card-text">${station.address}</small>
                <p class="card-text m-0">可租：${station.rentBikes}</p>
                <p class="card-text m-0">可還：${station.returnBikes}</p>
              </div>
            </div>`
          );
        this.bikeStationMarkers.push(marker)
      })
    },
    clearStationMarkers() {
      this.myMap.eachLayer(() => {
        this.bikeStationMarkers.forEach((marker) => this.myMap.removeLayer(marker))
      })
    },
  },
  mounted() {
    this.getUserLocation();
    this.initMap();
    this.checkCityForYouBikeStation();
  },
}
</script>

<style lang="scss">
#map {
  width: 100%;
  height: 60vh;
  z-index: 2;
  @media screen and (max-width: 768px) {
    height: 42vh;
  }
}

#showStationBtn {
  position: absolute;
  top: 3%;
  left: 8%;
  z-index: 5;
  @media screen and (max-width: 768px) {
    left: 13%;
  }
}
</style>