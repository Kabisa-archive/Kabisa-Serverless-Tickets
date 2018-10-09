import { CognitoIdentityCredentials } from "aws-sdk/global";
import { config as Config } from "aws-sdk/global";

import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";

const adminPayload = {
	"cognito:groups": [ "Admin" ]
};

const userPayload = {

};

export default class CognitoAuth {


	constructor () {
	}

	configure () {

	}

	isAuthenticated ( cb ) {
		window.store.commit( "userSession", {} );
		window.store.commit( "token", this.getDecodedTokenPayload() );

		return cb( null, true );
	}

	signup ( username, email, pass, cb ) {

	}

	confirmRegistration ( username, code, cb ) {

	}

	resendCode ( username, code, cb ) {

	}

	forgotPassword ( username, cb ) {
		cb( null, { } );
	}

	confirmPassword ( username, code, password, cb ) {
		cb( null, {}  );
	}

	changePassword ( oldPassword, newPassword, cb ) {
		cb( null, {}  );
	}

	signin ( username, pass, newPassword, cb ) {
		sessionStorage.setItem( "username", username );
		cb( null, {} );
	}

	/**
   * Logout of your cognito session.
   */
	logout () {
		this.onChange( false );
	}

	/**
   * Resolves the current token based on a user session. If there
   * is no session it returns null.
   * @param {*} cb callback
   */
	getIdToken ( cb ) {
		cb( null, "JWT Token for development" );
	}

	getDecodedTokenPayload = () => {
		if ( sessionStorage.getItem( "username" ) === "admin" ) {
			return adminPayload;
		}

		return userPayload;
	};

	getCurrentUser () {
		return {
			"Name": "test"
		};
	}

	// very primitive change listener
	onChange () {}
}

CognitoAuth.install = function ( Vue, options ) {
	Object.defineProperty( Vue.prototype, "$cognitoAuth", {
		get () { return this.$root._cognitoAuth; }
	} );

	Vue.mixin( {
		beforeCreate () {
			if ( this.$options.cognitoAuth ) {
				this._cognitoAuth = this.$options.cognitoAuth;
				this._cognitoAuth.configure( options );
			}
		}
	} );
};