<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <h1>后台系统</h1>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input type="password" v-model="form.passaword"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Form from "element-ui";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  display: grid;
  place-items: center;
  background-color: rgb(28, 70, 139);
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;

  //   整一下Less语法嵌套！
  .avatar_box {
    padding: 10px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      background-color: rgb(238, 238, 238);
      border-radius: 50%;
    }
  }
}
</style>