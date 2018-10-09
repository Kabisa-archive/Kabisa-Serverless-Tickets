<template>
  <md-card class="md-layout-item md-size-50 md-small-size-100 md-center">
    <form @submit.prevent="login">
      <md-card-header>
        <div class="md-title">Kabisa Tickets Login</div>
      </md-card-header>


      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <md-input
                id="inputUsername"
                v-model="username"
                type="text"
                placeholder="Username" 
                required/>
            </md-field>

            <md-field>
              <md-input
                id="inputPassword"
                v-model="pass"
                type="password"
                placeholder="Password"
                required/>
            </md-field>

            <md-field v-if="newPasswordRequired">
              <md-input
                id="newPassword"
                v-model="newPassword"
                type="password"
                placeholder="New password"
                required/>
            </md-field>
          </div>
        </div>
      </md-card-content>
      <md-card-actions>
        <md-button
          class="md-raised md-primary" 
          type="submit">Login</md-button>
        <md-button
          to="/signup">Create an account</md-button>
      </md-card-actions>

      <md-snackbar :md-active.sync="error">
        {{ errorMessage }}
      </md-snackbar>

      <md-snackbar :md-active.sync="newPasswordRequired">
        A new password is required, please set it below.
      </md-snackbar>
    </form>
  </md-card>
</template>

<script>
export default {
	data () {
		return {
			username: "",
			pass: "",
			newPasswordRequired: false,
			newPassword: "",
			error: false,
			errorMessage: null
		};
	},
	methods: {
		login () {
			this.$cognitoAuth.signin( this.username, this.pass, this.newPassword, ( err, result, newPasswordRequired ) => {
				this.error = null;

				if ( err ) {
					this.error = true;
					this.errorMessage = err.message;
					console.error( err );
				} else  if ( newPasswordRequired ) {
					this.newPasswordRequired = true;
				} else {
					this.$root.$emit( "login", result );
					this.$router.replace( this.$route.query.redirect || "/" );
				}
			} );
		}
	}
};
</script>
