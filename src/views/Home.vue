<template>
  <div id="home" class="container pt-5 mt-5">
    <TheSelect :routeNumber="routeList.length"></TheSelect>
    <div id="bikeRoute" class="row d-flex flex-xl-row-reverse">
      <TheMap :currentRoute="currentRoute"></TheMap>
      <TheList :routeList="routeList" :currentRoute="currentRoute"></TheList>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import store from "@/store/index.js"
import TheSelect from "../components/TheSelect.vue"
import TheList from "../components/TheList.vue";
import TheMap from "../components/TheMap.vue";

export default {
  name: "Home",
  components: {
    TheList,
    TheSelect,
    TheMap,
  },
  computed: {
    routeList() {
      return store.getters["routeList"];
    },
    currentRoute() {
      return store.state.currentRoute;
    },
  },
};
</script>

<style lang="scss">

</style>
