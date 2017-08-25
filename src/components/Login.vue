<template>
  <div class="container">
    <form class="form-signin" v-on:submit.prevent="onSubmit">
      <h2 class="form-signin-heading">Please sign in</h2>
      <label class="sr-only">Name</label>
      <input type="text" class="form-control" placeholder="Name" required autofocus v-model="name">
      <label class="sr-only">Password</label>
      <input type="password" class="form-control" placeholder="Password" required v-model="password">
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      <div class="error" v-show="error">Name or Password incorrect!!</div>
    </form>
  </div>
</template>


<script>
import { getInitState } from '@/stores/login';
import { LoginUrl } from '@/utils/api';

export default {
  name: 'login',
  methods: {
    onSubmit () {
      let that = this;
      that.$fetch({
        method: 'post',
        url: LoginUrl,
        data: {
          name: this.name,
          pwd: this.password,
        }
      }).then((response) => {
        that.$store.commit('login', {
          ...response.data.token,
          password: this.password
        });
        that.error = false;
        that.name = '';
        that.password = '';
        that.$router.push('/member');
      }).catch((err) => {
        that.$store.commit('login', getInitState());
        that.error = true;
      })
    }
  },
  data () {
    return {
      name: '',
      password: '',
      error: false
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  justify-content: center;
}
.form-signin  {
  width: 300px;
  margin-top: 100px;
}
.form-signin input[type="text"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}
.form-signin .form-control {
    position: relative;
    height: auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px;
    font-size: 16px;
}
.error {
  color: #f00;
  font-size: 16px;
  padding: 5px 0;
}
</style>
