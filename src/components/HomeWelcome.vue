<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <h1>咩商后台管理系统</h1>
      </div>
      <div class="page">
        <h2>介绍</h2>
        <p>
          <a
            href="https://github.com/vuejs/vue"
            target="_blank"
            rel="noopener noreferrer"
            ><img
              src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg"
              alt="vue"
            />
          </a>

          <a
            href="https://github.com/ElemeFE/element"
            target="_blank"
            rel="noopener noreferrer"
            ><img
              src="https://img.shields.io/badge/element--ui-2.15.9-brightgreen.svg"
              alt="element-ui"
          /></a>
        </p>
        <p>
          <a href="https://github.com/nicopcat/vue2_shop_admin"
            >vue_shop_admin</a
          >是一个针对电商的管理后台项目，整体采用前后端分离的开发模式，基于
          <a href="https://github.com/vuejs/vue">Vue</a> 和
          <a href="https://github.com/ElemeFE/element">Element-UI</a>
          实现。它采用了较为现代的前端技术栈，包括权限验证，组件化开发，Echarts等。
        </p>
        <h2>功能</h2>
        <div class="indent">
          <h5>登录 / 注销</h5>
          <h5>权限验证</h5>
          <p>- 登陆前预校验信息</p>
          <p>- 路由导航卫士控制访问权限</p>
          <h5>全局功能</h5>
          <p>- 可折叠侧边栏（支持多级路由嵌套）</p>
          <p>- 动态面包屑</p>
          <h5>优化</h5>
          <p>- 为 env 和 prod 定制打包入口</p>
          <p>- webpack 配置 externals 减小打包体积</p>
          <p>- 路由懒加载</p>
          <p>- 路由切换过渡动效</p>
          <h5>第三方插件 / 包</h5>
          <p>- axios</p>
          <p>- ECharts 图表</p>
          <p>- Nprogress</p>
          <p>- vue-quill-editor</p>
          <p>- normalize.css</p>
          <p>- vue-table-with-tree-grid</p>
          <p></p>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {}
</script>
<style scoped>
.page p a {
  margin-right: 10px;
}

p {
  font-size: 16px;
  line-height: 1.75;
}
.indent p {
  margin-left: 1rem;
  line-height: 1;
}
</style>
