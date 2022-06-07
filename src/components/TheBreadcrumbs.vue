<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item
      v-for="(p, i) in list"
      :to="{ path: $route.path }"
      :key="i"
      >{{ p.meta.name }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      routeToFrom: []
    }
  },
  watch: {
    $route(to) {
      this.list = to.matched
      console.log(this.$route.path)
    }
  },
  created() {
    this.list = this.$route.matched
  }
}
</script>
