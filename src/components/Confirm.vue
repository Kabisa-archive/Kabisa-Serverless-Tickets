<template>
  <md-card class="md-layout-item md-size-50 md-small-size-100 md-center">
    <form @submit.prevent="confirm">
      <md-card-header>
        <div class="md-title">Confirm Account</div>
      </md-card-header>


      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <md-input
                v-model="username"
                type="text"
                placeholder="Username"
                required 
                readonly/>
            </md-field>
            <md-field>
              <md-input
                v-model="code"
                type="text"
                placeholder="Confirmation code"
                required/>
            </md-field>
          </div>
        </div>
      </md-card-content>
      <md-card-actions>
        <md-button
          class="md-raised md-primary"
          type="submit">Confirm</md-button>
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
			username: this.$route.query.username,
			code: "",
			error: false,
			errorMessage: null
		};
	},
	methods: {
		confirm () {
			this.$cognitoAuth.confirmRegistration( this.username, this.code, ( err, ) => {
				if ( err ) {
					this.errorMessage = err.message;
					this.error = true;
					console.error( err );
				} else {
					this.$router.replace( "/login" );
				}
			} );
		}
	}
};
</script>
