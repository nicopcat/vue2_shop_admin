<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item v-for="(p, i) in routeToFrom" :to="p.path" :key="i">{{
      p.meta.name
    }}</el-breadcrumb-item>
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
      this.routeToFrom = to.matched
      console.log(to.matched)
    }
  },
  created() {
    this.routeToFrom = this.$route.matched
  }
}
</script>
