<template>
  <div>
    <md-card class="md-layout-item md-size-50 md-small-size-100 md-center">
      <md-card-header>
        <div class="md-title">Cognito User Management</div>
        <br><br>
        <div class="md-title">Create a new user</div>
      </md-card-header>


      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field >
              <md-input
                v-model="newUser.Username"
                type="text"
                placeholder="Username"/>
            </md-field>
            <md-field >
              <md-input
                v-model="newUser.Email"
                type="email"
                placeholder="Email"/>
            </md-field>
          </div>
        </div>
      </md-card-content>

      <md-card-actions>
        <md-button
          class="md-raised md-primary"
          @click="createNewUser(newUser)">Create new user</md-button>
      </md-card-actions>

      <md-dialog-alert
        :md-active.sync="newUserCreated"
        :md-content="newUser.Username + ' successfully deleted!'"
        md-confirm-text="Cool!" />

    </md-card>
    <br/>
    <md-card 
      v-for="(user, index) in users"
      :key="index"
      class="md-layout-item md-size-50 md-small-size-100 md-center">
      <md-card-header>
        <div class="md-title">Current user: {{ user.Username }}</div>
      </md-card-header>


      <md-card-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-small-size-100">
            <md-field 
              v-for="(attribute, index) in user.Attributes"
              :key="index"
              class="text">
              <label>{{ attribute.Name }}</label>
              <md-input
                v-model="attribute.Value"
                :readonly="attribute.Name !== 'email'"
                type="text"
              />
            </md-field>
          </div>
        </div>
      </md-card-content>

      <md-card-actions>
        <md-button
          class="md-raised md-primary"
          @click="updateEmail(user, 'email', user.Attributes.find(attr => attr.Name === 'email').Value)">Update email</md-button>
        <md-button
          class="md-raised md-accent"
          @click="deleteUser(user.Username)">Delete user</md-button>
      </md-card-actions>

      <md-dialog-alert
        :md-active.sync="userDeleted"
        :md-content="deletedUser + ' successfully deleted!'"
        md-confirm-text="Cool!" />

      <md-dialog-alert
        :md-active.sync="userUpdated"
        :md-content="updatedUser + ' successfully updated!'"
        md-confirm-text="Cool!" />

    </md-card>

  </div>
</template>

<script>
import CognitoAdmin from "../cognito/admin";

export default {
	data () {
		return {
			newUser: {},
			users: [],
			newUserCreated: false,
			userDeleted: false,
			deletedUser: null,
			userUpdated: false,
			updatedUser: null
		};
	},
	beforeMount() {
		this.cognitoAdmin = new CognitoAdmin();
		this.loadUsers();
	},
	methods: {
		loadUsers() {
			this.cognitoAdmin.listUsers().then( ( users ) => {
				this.users = users;
			} );
		},
		deleteUser( username ) {
			this.cognitoAdmin.deleteUser( username ).then( ( result )  => {
				if ( result instanceof Error ) {
					console.error( result );
				} else {
					this.userDeleted = true;
					this.deletedUser = username;
					this.loadUsers();
				}
			} );
		},
		createNewUser( user ) {
			this.cognitoAdmin.createNewUser( user ).then( ( result )  => {
				if ( result instanceof Error ) {
					console.error( result );
				} else {
					this.newUserCreated = true;
					this.loadUsers();
				}
			} );
		},
		updateEmail( user, attributeName, attributeValue )  {
			this.cognitoAdmin.updateAttribute( user.Username, attributeName, attributeValue ).then( ( result )  => {
				if ( result instanceof Error ) {
					console.error( result );
				} else {
					this.userUpdated = true;
					this.updatedUser = user.Username;
				}
			} );
		},
		redirectHome() {
			this.$router.push( "/" );
		}
	}
};
</script>