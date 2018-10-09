
const utils = require( "./utils" );
const webpack = require( "webpack" );
const config = require( "../config" );
const merge = require( "webpack-merge" );
const path = require( "path" );
const baseWebpackConfig = require( "./webpack.base.conf" );
const CopyWebpackPlugin = require( "copy-webpack-plugin" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const FriendlyErrorsPlugin = require( "friendly-errors-webpack-plugin" );
const portfinder = require( "portfinder" );
const aws_config_dev = require( "../src/config/aws_config.dev.json" );

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number( process.env.PORT );

const findParam = ( param ) => {
	let result = "";
	process.argv.forEach( ( argv )=>{
		if ( argv.indexOf( "--" + param ) === -1 ) return;
		result = argv.split( "=" )[1];
	} );
	return  result;
};

const aws_online = findParam( "aws_online" ) === "true";

const devWebpackConfig = merge( baseWebpackConfig, {
	module: {
		rules: utils.styleLoaders( { sourceMap: config.dev.cssSourceMap, usePostCSS: true } )
	},
	mode: "development",
	// cheap-module-eval-source-map is faster for development
	devtool: config.dev.devtool,

	// these devServer options should be customized in /config/index.js
	devServer: {
		clientLogLevel: "warning",
		historyApiFallback: {
			rewrites: [
				{ from: /.*/, to: path.posix.join( config.dev.assetsPublicPath, "index.html" ) },
			],
		},
		hot: true,
		contentBase: false, // since we use CopyWebpackPlugin.
		compress: true,
		host: HOST || config.dev.host,
		port: PORT || config.dev.port,
		open: config.dev.autoOpenBrowser,
		overlay: config.dev.errorOverlay
			? { warnings: false, errors: true }
			: false,
		publicPath: config.dev.assetsPublicPath,
		proxy: config.dev.proxyTable,
		quiet: true, // necessary for FriendlyErrorsPlugin
		watchOptions: {
			poll: config.dev.poll,
		}
	},
	plugins: [
		new webpack.DefinePlugin( {
			AWS_ONLINE: aws_online,
			AWS_CONFIG_DEV: JSON.stringify( aws_config_dev )
		} ),
		new webpack.DefinePlugin( {
			"process.env": require( "../config/dev.env" )
		} ),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		// https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin( {
			filename: "index.html",
			template: "index.html",
			inject: true
		} ),
		// copy custom static assets
		new CopyWebpackPlugin( [
			{
				from: path.resolve( __dirname, "../static" ),
				to: config.dev.assetsSubDirectory,
				ignore: [ ".*" ]
			}
		] )
	],
	optimization: {
		namedModules: true,
		splitChunks: {
			chunks: "all"
		}
	}
} );

module.exports = new Promise( ( resolve, reject ) => {
	portfinder.basePort = process.env.PORT || config.dev.port;
	portfinder.getPort( ( err, port ) => {
		if ( err ) {
			reject( err );
		} else {
			// publish the new Port, necessary for e2e tests
			process.env.PORT = port;
			// add port to devServer config
			devWebpackConfig.devServer.port = port;

			// Add FriendlyErrorsPlugin
			devWebpackConfig.plugins.push( new FriendlyErrorsPlugin( {
				compilationSuccessInfo: {
					messages: [ `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}` ],
				},
				onErrors: config.dev.notifyOnErrors
					? utils.createNotifierCallback()
					: undefined
			} ) );

			resolve( devWebpackConfig );
		}
	} );
} );
