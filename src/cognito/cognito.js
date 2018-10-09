import { CognitoIdentityCredentials } from "aws-sdk/global";
import { config as Config } from "aws-sdk/global";
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";
import getConfig from "../config/config";

export default class CognitoAuth {
	constructor () {
	}

	configure ( ) {
		const awsConfig = getConfig();

		const config = {
			region: awsConfig.Region,
			UserPoolId: awsConfig.UserPoolId,
			ClientId: awsConfig.UserPoolClientId
		};

		if ( typeof config !== "object" || Array.isArray( config ) ) {
			throw new Error( "[CognitoAuth error] valid option object required" );
		}
		// used to inject an alternate pool if required for testing
		if ( config.userPool ) {
			this.userPool = config.userPool;
		} else {
			this.userPool = new CognitoUserPool( {
				UserPoolId: config.UserPoolId,
				ClientId: config.ClientId
			} );

		}
		Config.region = config.region;
		Config.credentials = new CognitoIdentityCredentials( {
			IdentityPoolId: config.IdentityPoolId
		} );

		window.userPool = this.userPool;

		this.config = config;
	}

	isAuthenticated ( cb ) {
		const cognitoUser = this.getCurrentUser();

		if ( cognitoUser !== null ) {
			cognitoUser.getSession( ( err, session ) => {

				if ( err || session === null || !session.isValid() ) {
					console.error( "NULL" );
					return cb( err, false );
				}
				window.store.commit( "userSession", session );
				window.store.commit( "token", this.getDecodedTokenPayload() );

				return cb( null, true );
			} );
		} else {
			cb( null, false );
		}
	}

	signup ( username, email, pass, cb ) {
		const attributeList = [
			new CognitoUserAttribute( {
				Name: "email",
				Value: email
			} )
		];

		this.userPool.signUp( username, pass, attributeList, null, cb );
	}

	confirmRegistration ( username, code, cb ) {
		const cognitoUser = new CognitoUser( {
			Username: username,
			Pool: this.userPool
		} );
		cognitoUser.confirmRegistration( code, true, cb );
	}

	resendCode ( username, code, cb ) {
		const cognitoUser = new CognitoUser( {
			Username: username,
			Pool: this.userPool
		} );
		cognitoUser.resendConfirmationCode( cb );
	}

	forgotPassword ( username, cb ) {
		const cognitoUser = new CognitoUser( {
			Username: username,
			Pool: this.userPool
		} );

		cognitoUser.forgotPassword( {
			onSuccess: ( result ) => {
				cb( null, result );
			},
			onFailure: function ( err ) {
				cb( err );
			},
			inputVerificationCode () {
				// cb(Error('Verification code not implemented.'))
				cb();
			}
		} );
	}

	confirmPassword ( username, code, password, cb ) {
		const cognitoUser = new CognitoUser( {
			Username: username,
			Pool: this.userPool
		} );

		cognitoUser.confirmPassword( code, password, {
			onSuccess: ( result ) => {
				cb( null, result );
			},
			onFailure: function ( err ) {
				cb( err );
			}
		} );
	}

	changePassword ( oldPassword, newPassword, cb ) {
		const cognitoUser = this.getCurrentUser();

		cognitoUser.getSession( ( err ) => {
			if ( err ) {
				return cb( err, false );
			}
			cognitoUser.changePassword( oldPassword, newPassword, cb );
		} );
	}

	signin ( username, pass, newPassword, cb ) {


		const authenticationDetails = new AuthenticationDetails( {
			Username: username,
			Password: pass
		} );
		const cognitoUser = new CognitoUser( {
			Username: username,
			Pool: this.userPool
		} );

		cognitoUser.authenticateUser( authenticationDetails, {
			onSuccess: ( result ) => {
				const logins = {};
				const jwtToken = result.getIdToken().getJwtToken();

				logins["cognito-idp." + this.config.region + ".amazonaws.com/" + this.config.UserPoolId] = jwtToken;

				Config.credentials = new CognitoIdentityCredentials( {
					IdentityPoolId: this.config.UserPoolId,
					Logins: logins
				} );

				this.onChange( true );
				cb( null, result );
			},
			onFailure: ( err ) => {
				cb( err );
			},
			newPasswordRequired: function() {
				if ( newPassword ) {
					cognitoUser.completeNewPasswordChallenge( newPassword, {}, this );
					cb( null, "Success", false );
				}

				cb( null, null, true );
			}
		} );
	}

	/**
   * Logout of your cognito session.
   */
	logout () {
		this.getCurrentUser().signOut();
		this.onChange( false );
	}

	/**
   * Resolves the current token based on a user session. If there
   * is no session it returns null.
   * @param {*} cb callback
   */
	getIdToken ( cb ) {
		if ( this.getCurrentUser() === null ) {
			return cb( null, null );
		}
		this.getCurrentUser().getSession( ( err, session ) => {
			if ( err ) return cb( err );
			if ( session.isValid() ) {
				return cb( null, session.getIdToken().getJwtToken() );
			}
			cb( Error( "Session is invalid" ) );
		} );
	}

	getDecodedTokenPayload = () => {
		if ( this.getCurrentUser() === null ) {
			return Error( "Session is invalid" );
		}
		return this.getCurrentUser().getSession( ( err, session ) => {
			if ( err ) return Error( err );
			if ( session.isValid() ) {
				return session.getIdToken().decodePayload();
			}
			return Error( "Session is invalid" );
		} );
	};

	getCurrentUser () {
		return this.userPool.getCurrentUser();
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