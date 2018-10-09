const webpack = require( "webpack" );
const path = require( "path" );
const utils = require( "./utils" );
const config = require( "../config" );
const VueLoaderPlugin = require( "vue-loader/lib/plugin" );
const vueLoaderConfig = require( "./vue-loader.conf" );
const Visualizer = require( "webpack-visualizer-plugin" );
const FriendlyErrorsWebpackPlugin = require( "friendly-errors-webpack-plugin" );
const aws_config_prod = require( "../src/config/aws_config.json" );

function resolve ( dir ) {
	return path.join( __dirname, "..", dir );
}

module.exports = {
	context: path.resolve( __dirname, "../" ),
	entry: {
		app: "./src/main.js"
	},
	plugins: [
		new webpack.DefinePlugin( {
			AWS_CONFIG_PROD: JSON.stringify( aws_config_prod )
		} ),
		new FriendlyErrorsWebpackPlugin(),
		new VueLoaderPlugin(),
		new Visualizer( { filename: "./../build/visualizer/statistics.html" } )
	],
	output: {
		path: config.build.assetsRoot,
		filename: "[name].js",
		publicPath: process.env.NODE_ENV === "production"
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPath
	},
	resolve: {
		extensions: [ ".js", ".vue", ".json" ],
		alias: {
			"vue$": "vue/dist/vue.esm.js",
			"@": resolve( "src" ),
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
				include: [ resolve( "src" ), resolve( "test" ), resolve( "node_modules/webpack-dev-server/client" ) ]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: utils.assetsPath( "img/[name].[hash:7].[ext]" )
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: utils.assetsPath( "media/[name].[hash:7].[ext]" )
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: "url-loader",
				options: {
					limit: 10000,
					name: utils.assetsPath( "fonts/[name].[hash:7].[ext]" )
				}
			}
		]
	},
	node: {
		// prevent webpack from injecting useless setImmediate polyfill because Vue
		// source contains it (although only uses it if it's native).
		setImmediate: false,
		// prevent webpack from injecting mocks to Node native modules
		// that does not make sense for the client
		dgram: "empty",
		fs: "empty",
		net: "empty",
		tls: "empty",
		child_process: "empty"
	}
};
