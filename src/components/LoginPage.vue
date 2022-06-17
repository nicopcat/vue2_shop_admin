<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.gif" alt="" />
      </div>
      <el-form
        class="login_form"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 4,
            max: 18,
            message: '长度在 4 到 18 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 2,
            max: 16,
            message: '长度在 2 到 16 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        // 直接用花括号解构赋值出得到的data
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(`登录失败！错误代码 ${res.meta.status}`)
        } else {
          this.$message.success('登录成功')
          // 1. 将token储存到seesionStorage
          sessionStorage.setItem('token', res.data.token)

          // 2. 路由跳转到/home
          setTimeout(() => {
            this.$router.push('/home')
          }, 1500)
        }
      })
    },
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  display: grid;
  place-items: center;
  background-color: rgba(12, 39, 82, 0.91);
}

//   整一下Less语法嵌套！
.login_box {
  position: absolute;
  width: 450px;
  height: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid rgb(49, 78, 190);

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
.login_form {
  position: absolute;
  padding: 0 30px;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
