import CognitoIdentityServiceProvider from "aws-sdk/clients/cognitoidentityserviceprovider";
import cognitoAuth from "@/cognito";
import { config as Config } from "aws-sdk/global";
import { CognitoIdentityCredentials } from "aws-sdk/global";
import getConfig from "../config/config";

export default class CognitoAdmin {
	constructor() {
		this.config = getConfig();
	}

	getCognitoIdentityService = async () => {
		return new Promise( ( resolve ) => {
			cognitoAuth.getIdToken( ( error, jwtToken ) => {
				const identityid = this.config.IdentityPoolId;
				const logins = {};

				logins[ "cognito-idp." + this.config.Region + ".amazonaws.com/" + this.config.UserPoolId ] = jwtToken;

				Config.region = this.config.Region;
				Config.credentials = new CognitoIdentityCredentials( {
					IdentityPoolId: identityid,
					Logins: logins,
				} );

				const cognitoIdentityService = new CognitoIdentityServiceProvider();

				const params = {
					UserPoolId: this.config.UserPoolId
				};

				resolve( [ cognitoIdentityService, params ] );
			} );
		} );
	};

	createNewUser = async ( user ) => {
		return new Promise( ( resolve ) => {
			this.getCognitoIdentityService().then( ( [ cognitoIdentityService, params ] ) => {
				params = { ...params, ...{
					Username: user.Username,
					UserAttributes: [
						{
							Name: "email", /* required */
							Value: user.Email
						}
					]
				} };

				cognitoIdentityService.adminCreateUser( params, ( err, data ) => {
					if ( err ) resolve( Error( "Error creating user " + user.Username ) );
					else resolve( data );
				} );
			} );
		} );
	};

	deleteUser = async ( username ) => {
		return new Promise( ( resolve ) => {
			this.getCognitoIdentityService().then( ( [ cognitoIdentityService, params ] ) => {
				params.Username = username;

				cognitoIdentityService.adminDeleteUser( params, ( err, data ) => {
					if ( err ) resolve( Error( "Error deleting user " + username ) );
					else resolve( data );
				} );
			} );
		} );
	};

	updateAttribute = async ( username, attributeName, attributeValue ) => {
		return new Promise( ( resolve ) => {

			this.getCognitoIdentityService().then( ( [ cognitoIdentityService, params ] ) => {
				params.Username = username;
				params.UserAttributes = [ {
					Name: attributeName,
					Value: attributeValue
				} ];

				cognitoIdentityService.adminUpdateUserAttributes( params, ( err, data ) => {
					if ( err ) resolve( Error( "Error updating " + attributeName ) );
					else resolve( data );
				} );
			} );
		} );
	};

	listUsers = () => {

		return new Promise( ( resolve ) => {

			this.getCognitoIdentityService().then( ( [ cognitoIdentityService, params ] ) => {

				cognitoIdentityService.listUsers( params, async ( err, data ) => {
					if ( err ) {
						console.error( err );
						resolve( [] );
					}
					else resolve( data.Users );
				} );
			} );

		} );

	}
}