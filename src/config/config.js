/* eslint-disable no-undef */
const getConfig = () => {
	let awsConfig = AWS_CONFIG_PROD;

	if ( !AWS_ONLINE ) {
		awsConfig = { ...awsConfig, ...AWS_CONFIG_DEV };
	}

	return awsConfig;
};
export default getConfig;