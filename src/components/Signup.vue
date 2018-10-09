<template>
  <md-card class="md-layout-item md-size-50 md-small-size-100 md-center">
    <form @submit.prevent="signup">
      <md-card-header>
        <div class="md-title">Sign Up</div>
      </md-card-header>

      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <md-input
                v-model="username"
                type="text"
                placeholder="Username"
                required/>
            </md-field>
            <md-field>
              <md-input
                v-model="email"
                type="text"
                placeholder="Email"
                required/>
            </md-field>
            <md-field>
              <md-input
                v-model="pass"
                type="password"
                placeholder="Password"
                required/>
            </md-field>
          </div>
        </div>
      </md-card-content>

      <md-card-actions>
        <md-button
          class="md-raised md-primary"
          type="submit">Sign up</md-button>
      </md-card-actions>

      <md-snackbar :md-active.sync="error">
        {{ errorMessage }}
      </md-snackbar>
    </form>
  </md-card>
</template>
<script>
export default {
	data () {
		return {
			username: "",
			email: "",
			pass: "",
			error: false,
			errorMessage: null
		};
	},
	methods: {
		signup () {
			this.$cognitoAuth.signup( this.username, this.email, this.pass, ( err, ) => {
				if ( err ) {
					this.error = true;
					this.errorMessage = err.message;
					console.error( err );
				} else {
					this.$router.replace( { path: "/confirm", query: { username: this.username } } );
				}
			} );
		}
	}
};
</script>

<style>
.error {
  color: red;
}
</style>
