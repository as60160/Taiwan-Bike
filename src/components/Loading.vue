<template>
  <div class="container-fluid bg-dark bg-opacity-50 full-screen">
    <div class="spinner position-absolute top-50 start-50"></div>
  </div>
</template>

<script>
export default {
  name: "Loading"
}
</script>

<style lang="scss" scoped>
@import "@/assets/all.scss";
.full-screen {
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid $light;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.5s infinite linear;
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>