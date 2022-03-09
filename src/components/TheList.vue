<template>
  <div class="col-12 col-lg-4" v-if="routeList">
    <ul id="cardList" class="ps-0 text-align-start">
      <li v-if="!routeList.length">查無自行車路線，請重新選擇地區。</li>
      <li
        class="card mb-4"
        v-for="r in routeList"
        :key="r.RouteName"
        v-else
        :class="{ active: r === currentRoute }"
        @click="setCurrentRoute(r)"
      >
        <div
          class="card-header bg-white d-flex justify-content-between align-items-center py-3"
        >
          <h3 class="card-title fw-bold fs-6 m-0">
            {{ spliceString(r.RouteName, 15) }}
          </h3>
          <span
            class="badge round-pill bg-secondary fs-8 d-inline-block py-2 px-3"
            >{{ r.Direction }}</span
          >
        </div>
        <div
          class="card-body d-flex justify-content-between align-items-center"
        >
          <div class="">
            <p class="card-text mb-2">
              <span class="circle-primary me-3">起</span>
              {{ spliceString(r.RoadSectionStart, 13) }}
            </p>
            <p class="card-text">
              <span class="circle-primary me-3">迄</span>
              {{ spliceString(r.RoadSectionEnd, 13) }}
            </p>
          </div>
          <div class="text-center">
            <p class="fs-8 mb-0">全長</p>
            <span class="text-primary fs-7 fw-bold">
              {{ formatNumber(r.CyclingLength, 2) }} 公里
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import store from "../store";

export default {
  props: {
    routeList: {
      type: Array,
      required: true,
    },
    currentRoute: {
      type: Object,
    }
  },
  methods: {
    spliceString(val, num) {
      return val.length >= num ? val.slice(0, num) + "..." : val;
    },
    formatNumber(val, num) {
      if (!val) return;
      val = (Number(val) / 1000).toFixed(num);
      return val;
    },
    setCurrentRoute(val){
      store.commit("SET_CURRENT_ROUTE", val)
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/all.scss";

#cardList {
  max-height: 60vh;
  overflow-y: auto;
  @media screen and (max-width: 768px) {
    height: 20vh;
  }
}

.card {
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    transform: scale(0.99);
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.3);
  }
}

.active {
  border: 1px solid $primary;
}

.circle-primary {
  color: $primary;
  font-size: 12px;
  position: relative;
  &::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 2px solid $primary;
    border-radius: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>