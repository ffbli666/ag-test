<template>
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" v-on:click="onToggle">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <router-link class="navbar-brand" to="/">ag test</router-link>
      </div>
      <div id="navbar" class="navbar-collapse collapse" v-bind:class="{ in: toggle}">
        <ul class="nav navbar-nav">
          <li v-show="isLogin"><router-link to="/member">Members</router-link></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li v-show="isLogin"><a v-on:click="onLogout">Logout</a></li>
        </ul>
      </div><!--/.nav-collapse -->
    </div>
  </nav>
</template>

<script>
export default {
  name: 'navbar',
  methods: {
    onLogout () {
      this.$router.push('/');
      this.$store.commit('login', {name:'', token: ''});
    },
    onToggle () {
      this.toggle = !this.toggle;
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.login.token.token !== '';
    }
  },
  data () {
    return {
      toggle: false
    };
  }
}
</script>

<style scoped>
 a {
  cursor: pointer;
 }
</style>
