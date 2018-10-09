const AWS = require( "aws-sdk" );

const cognitoIdentityService = new AWS.CognitoIdentityServiceProvider();

exports.addUserToGroup = ( event, context ) => {
	const params = {
		GroupName: "User", /* required */
		UserPoolId: event.userPoolId, /* required */
		Username: event.userName /* required */
	};

	cognitoIdentityService.adminAddUserToGroup( params, ( err, ) => {
		if ( err ) console.error( err, err.stack ); // an error occurred

		context.done( null, event );

	} );

};
