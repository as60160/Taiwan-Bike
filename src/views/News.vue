<template>
  <div class="container pt-5 mt-5">
    <div class="row pt-5">
      <div class="table-responsive">
        <table class="table table-hover table-light table-sm">
          <thead class="table-primary">
            <tr class="py-2">
              <th scope="col">更新日期</th>
              <th scope="col">最新消息</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="n in news" :key="n.Title">
              <td>{{ n.UpdateTime }}</td>
              <td>
                <h3 class="h6">{{ n.Title }}</h3>
                <p>{{ n.Description }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store/index.js";
import GetAuthorizationHeader from "../assets/api.js";
import axios from "axios";

export default {
  data() {
    return {
      news: [],
    }
  },
  methods: {
    getNews() {
      store.commit("SET_LOADING", true);
      axios({
        method: "get",
        url: "https://ptx.transportdata.tw/MOTC/v2/PTX/Web/News?%24top=30&%24format=JSON",
        header: GetAuthorizationHeader(),
      })
        .then((res) => {
          const data = res.data.Newses
          this.news = data.map((item) => {
            const { Title, Description, UpdateTime } = item
            return {
              Title,
              Description,
              UpdateTime: UpdateTime.slice(0, 10)
            }
          })
          console.log(this.news);
          store.commit("SET_LOADING", false);
        })
        .catch((err) => {
          console.log("err of news", err);
        });
    }
  },
  mounted() {
    this.getNews()
  }
}
</script>

<style lang="scss" scoped>
.table-responsive {
  max-height: 70vh;
  overflow-y: auto;
}

th, td {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  @media screen and (max-width: 768px) {
    font-size: 14px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>