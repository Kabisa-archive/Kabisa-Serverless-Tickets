<template >
  <div id="app">
    <md-card 
      v-if="$store.state.user.session" 
      class="md-layout-item md-size-50 md-small-size-100 md-center">
      <md-card-content>
        <md-button
          v-if="$store.state.user.session"
          class="md-primary"
          @click="redirectHome">Home</md-button>
        <md-button
          v-if="$store.state.user.session && $store.state.user.groups.includes('Admin')"
          id="admin-panel"
          class="md-default"
          @click="redirectAdmin">
          Admin panel</md-button>
        <md-button
          v-if="$store.state.user.session"
          id="logout-button"
          class="md-accent md-pull-right"
          @click="logout">Logout</md-button>
      </md-card-content>
    </md-card>

    <router-view/>
  </div>
</template>

<script>
import cognitoAuth from "@/cognito";

export default {
	methods: {
		redirectHome() {
			this.$router.push( "/" );
		},
		redirectAdmin() {
			this.$router.push( "admin" );
		},
		logout() {
			this.userSession = null;
			cognitoAuth.logout();
			this.$router.push( "/login" );
		}
	},
};
</script>

<style>
  .md-center {
    margin: 0 auto;
  }

  .md-pull-right {
    float: right;
  }


</style>
