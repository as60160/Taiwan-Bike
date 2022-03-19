<template>
  <div class="container-fluid vh-100 bg-dark bg-opacity-25 cover">
    <img
      src="@/assets/img/logo-s.svg"
      alt="bicycle"
      class="move position-absolute top-50 start-50"
    />
  </div>
</template>

<script>
export default {
  name: "Loading"
}
</script>

<style lang="scss" scoped>
@import "@/assets/all.scss";
.cover {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 30;
}

.move {
  animation: move 1.5s infinite linear;
}

@keyframes move {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(100px);
  }
}
</style>