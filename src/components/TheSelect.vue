<template>
  <p class="pt-3">
    <span class="me-3 fw-bold">搜尋結果</span>
    <span class="text-muted"
      >共 <span>{{ routeNumber }}</span> 筆</span
    >
  </p>
  <div class="row mb-3">
    <div class="col-12 col-xl-4">
      <form class="d-flex justify-content-between">
        <select
          name="city"
          id="city"
          class="form-select me-2"
          v-model="currentCity"
        >
          <option value="null">請選擇縣市</option>
          <option v-for="city in cityList" :key="city.City" :value="city.City">
            {{ city.CityName }}
          </option>
        </select>
        <select name="town" id="town" class="form-select" v-model="currentTown">
          <option value="null">請選擇鄉鎮</option>
          <option
            v-for="town in townList"
            :key="town.ZipCode"
            :value="town.AreaName"
          >
            {{ town.AreaName }}
          </option>
        </select>
      </form>
    </div>
  </div>
</template>

<script>
import store from "@/store/index.js";

export default {
  props: {
    routeNumber: {
      type: Number,
      required: true,
    },
  },
  computed: {
    currentCity: {
      get() {
        return store.state.currentCity;
      },
      set(val) {
        store.commit("SET_CURRENT_CITY", val);
        store.commit("SET_CURRENT_TOWN", null);
      }
    },
    currentTown: {
      get() {
        return store.state.currentTown;
      },
      set(val) {
        store.commit("SET_CURRENT_TOWN", val);
        store.dispatch("GET_ROUTES", val);
      }
    },
    cityList() {
      return store.state.cities;
    },
    townList() {
      return store.getters["townList"];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/all.scss";
.form-select {
  cursor: pointer;
  border: 1px solid $primary;
}

</style>