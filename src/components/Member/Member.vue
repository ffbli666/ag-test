<template>
  <div class="container">
    <div class="create-member">
      <form class="form-inline" v-on:submit.prevent="onCreate">
        <input type="text" class="form-control" placeholder="Name" required v-model="name">
        <button class="btn btn-primary" type="submit">Create New User</button>
      </form>
    </div>
    <div v-show="members.length === 0">No data. You can create new member.</div>
    <table v-show="members.length > 0" class="table table-striped"> 
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
import { MemberUrl } from '@/utils/api';

export default {
  name: 'member',
  beforeCreate () {    
    let token =  this.$store.state.login.info.token;
    if (!token) {
      this.$router.push('/');
      return;
    }
    this.$fetch({
      method: 'get',
      url: MemberUrl,
    }).then((response) => {
      this.members = response.data.data.reverse()
    }).catch((err)=>{
      this.$swal({title: 'Permission denied', type: 'error'});
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
      let token =  that.$store.state.login.info.token;
      that.$fetch({
        method: 'post',
        url: MemberUrl,
        data: {
          name: that.name
        }
      }).then((response) => {
        //因為 api 沒吐回 ID , 只好重取一次, 有 ID 就能從前端直接放進資料
        that.$fetch({
          method: 'get',
          url: MemberUrl,
        }).then((response) => {
          this.members = response.data.data.reverse()
        });       
        that.name = '';
      }).catch((err)=>{
        this.$swal({title: 'Permission denied', type: 'error'});
      });     
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
