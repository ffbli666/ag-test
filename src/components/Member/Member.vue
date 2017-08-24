<template>
  <div class="container">
    <div class="create-member">
      <form class="form-inline" v-on:submit.prevent="onCreate">
        <label>Create New Member</label>
        <input type="text" class="form-control" placeholder="Name" required v-model="name">
        <button class="btn btn-primary" type="submit">Create New User</button>
      </form>
    </div>
    <table class="table table-striped"> 
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr> 
      </thead>
      <tbody>
        <tr v-for="member in members">
          <th scope="row">{{member.ID}}</th>
          <td>{{member.name}}</td>
        </tr>
      </tbody> 
    </table>
  </div>
</template>


<script>
import ajax from '@/utils/ajax';
const getMemberList = (token) => {
  return ajax.fetch({
    headers: {
      Authorization: token
    },
    method: 'get',
    url: 'http://52.197.192.141:3443/member',
  })
}
export default {
  name: 'member',
  beforeCreate () {
    let token =  this.$store.state.login.token.token;
    if (!token) {
      this.$router.push('/');
      return;
    }
    getMemberList(token).then((response) => {
      this.members = response.data.data.reverse()
    });
  },
  data () {
    return {
      name: '',
      members: [],
    }
  },
  methods: {
    onCreate() {
      let that = this;
      let token =  that.$store.state.login.token.token;
      ajax.fetch({
        headers: {
          Authorization: token
        },
        method: 'post',
        url: 'http://52.197.192.141:3443/member',
        data: {
          name: that.name
        }
      }).then((response) => {
        //因為 api 沒吐回 ID , 只好重取一次, 有 ID 就能從前端直接放進資料
        getMemberList(token).then((response) => {
          that.members = response.data.data.reverse()
        });        
        that.name = '';
      })       
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.create-member {
  margin: 20px 0;
}
</style>
