<template>
  <Loading v-if="loading"></Loading>
  <div class="container-fluid fixed-top" id="nav">
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light px-0 py-4">
        <h1 class="navbar-brand m-0">
          <router-link to="/">
            <img src="@/assets/img/logo.svg" alt="logo" />
          </router-link>
        </h1>
        <button
          class="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbar">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">找路線</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'News'}" class="nav-link">最新消息</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
  <router-view/>
</template>

<script>
console.clear();
import store from "@/store/index.js";
import Loading from "./components/Loading.vue";

export default {
  components: {
    Loading,
  },
  computed: {
    loading() {
      return store.state.loading;
    }
  },
  mounted() {
      store.dispatch("GET_CITIES");
      store.dispatch("GET_ROUTES");
  },
};
</script>

<style lang="scss">
@import "@/assets/all.scss";
* {
  position: relative;
}

#app {
  font-family: 'Noto Sans TC', sans-serif;
  background: #e2e2e2;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

#nav {
  box-shadow: 0px 4px 5px 1px rgba(0, 0, 0, 0.1);
  background: white;
  z-index: 10;
  a {
    &.router-link-exact-active {
      font-weight: bold;
      color: $primary;
    }
  }
}
</style>
