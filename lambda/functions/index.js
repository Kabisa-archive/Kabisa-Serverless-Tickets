const AWS = require( "aws-sdk" );
const aws_config = require( "../../src/config/aws_config.json" );

const dynamoConfig = "AWS_SESSION_TOKEN" in process.env ? {} : {
	region: "localhost",
	endpoint: "http://localhost:8000"
};


const ddb = new AWS.DynamoDB.DocumentClient( dynamoConfig );

const uuidV4 = require( "uuid/v4" );


exports.availability = ( event, context, callback ) => {

	getAvailability().then( ( result ) => {
		callback( null, {
			statusCode: 201,
			body: JSON.stringify( result ),
			headers: {
				"Access-Control-Allow-Origin": "*",
			}
		} );

	} );

};

exports.order = ( event, context, callback ) => {
	const id = uuidV4();
	const orderItems = event.body;
	const sub = event.cognitoPoolClaims.sub;

	const order = {
		OrderId: id,
		UserId: sub,
		OrderItems: orderItems
	};

	orderTickets( order )
		.catch( ( err ) => {
			console.error( "ERROR OCCURED" );
			console.error( err );
		} ).then( () => {
			callback( null, {
				statusCode: 201,
				body: JSON.stringify( {
					OrderId: id,
				} ),
				headers: {
					"Access-Control-Allow-Origin": "*"
				},
			} );
		} );
};

function orderTickets( order ) {
	return ddb.put( {
		TableName: aws_config.TicketOrderTableName,
		Item: order
	} ).promise();
}

function getAvailability() {
	console.log( aws_config.TicketAvailabilityTableName );
	return ddb.scan( { TableName: aws_config.TicketAvailabilityTableName } ).promise();
}
