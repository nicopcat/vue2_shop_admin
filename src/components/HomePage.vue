<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="header_logo">
        <router-link to="/home">
          <img src="../assets/img/222.gif" alt="222" width="35" />
          <span>咩商后台管理系统</span>
        </router-link>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 主体区域 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '180px'">
        <div class="toggle_button">
          <el-button @click="toggle_menu"><i class="el-icon-menu" /></el-button>
        </div>

        <!-- unique-opened表示只展开一个菜单默认false -->

        <el-menu
          :collapse-transition="false"
          :default-active="$route.path"
          router
          unique-opened
          :collapse="isCollapse"
          background-color="#212835"
          text-color="#fff"
          active-text-color="#e6a23c"
        >
          <template v-for="menu in menuList">
            <!-- 没有子集的菜单 -->
            <el-menu-item
              :index="'/' + menu.path"
              v-if="!menu.children"
              :key="menu.id"
            >
              <i :class="iconsObj[menu.id]"></i>
              <span slot="title"> {{ menu.authName }} </span>
            </el-menu-item>

            <!-- 有子集的菜单 -->
            <el-submenu :index="'/' + menu.path" v-else :key="menu.id">
              <template slot="title">
                <i :class="iconsObj[menu.id]"></i>
                <span> {{ menu.authName }}</span>
              </template>
              <el-menu-item
                :index="'/' + subMenu.path"
                v-for="subMenu in menu.children"
                :key="subMenu.id"
              >
                <i class="el-icon-menu"></i>
                <span slot="title">{{ subMenu.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>

      <!-- 右侧主体区 -->
      <el-main>
        <TheBreadcrumbs />
        <transition name="slide-fade" mode="out-in">
          <router-view :key="$route.path"> </router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import TheBreadcrumbs from './TheBreadcrumbs'
export default {
  components: { TheBreadcrumbs },
  created() {
    this.getMenuList()
    this.list = this.$route.matched
  },

  data() {
    return {
      isCollapse: false,
      isCollapseWidth: 64,
      menuList: [],
      routeToFrom: [],
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-cooperation',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      }
    }
  },
  methods: {
    toggle_menu() {
      this.isCollapse = !this.isCollapse
    },
    logout() {
      sessionStorage.removeItem('token')
      // 或者 sessionStorage.clear();
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取菜单失败')
      // 获取菜单
      this.menuList = res.data
    }
  }
}
</script>
<style lang="less" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.el-container {
  height: 100%;
}
.el-header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #24282a;
  color: #fff;
  text-align: center;
  line-height: 60px;

  .header_logo {
    img {
      transform: translate(-10%, 30%);
    }
    a {
      text-decoration: none;
      color: #fff;
    }
  }
}

.el-aside {
  height: 100%;
  background-color: #212835;
  color: #fff;
  text-align: center;
  line-height: 200px;
  max-width: 220px;
  width: 100%;
  overflow: hidden;
  .el-menu .el-submenu .el-submenu__title {
    padding: 0px 50px !important;
  }
}

.el-main {
  background-color: #e9edf1;
}

.toggle_button {
  line-height: 40px;

  .el-button {
    border: none;
    color: #fff;
    background-color: #212835;
  }
}

.el-menu {
  border: none;
}
</style>
