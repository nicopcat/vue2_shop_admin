<template>
  <div class="login_container">
    <div class="avatar_box">
      <img src="../assets/logo.gif" alt="" />
    </div>

    <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
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

      <el-form-item>
        <el-row>
          <el-col class="login">
            <el-button type="primary" @click="login">登录</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="tips">
            <span>username: admin</span>
            <span>password: 123456</span>
          </el-col>
          <el-col :span="12" class="reset">
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据对象
      loginForm: {
        username: '',
        password: ''
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
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;

  .el-form {
    position: relative;
    width: 400px;
    max-width: 100%;
    padding: 160px 0;
    margin: 0 auto;
    overflow: hidden;
    .el-form-item {
      padding: 0 1rem;
      line-height: 20px !important;
    }
  }

  .avatar_box {
    padding: 10px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 60%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      background-color: rgb(238, 238, 238);
      border-radius: 50%;
    }
  }

  .login .el-button {
    margin-top: 3rem;
    width: 100%;
  }
  .reset {
    margin-top: 2rem;

    .el-button {
      width: 50%;
      float: right;
    }
  }

  .tips {
    margin-top: 2rem;
    line-height: 20px;

    span {
      display: inline-block;
      font-size: 12px;
      color: rgba(180, 180, 180, 0.88);
    }
  }
}
</style>
