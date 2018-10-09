
const path = require( "path" );
const utils = require( "./utils" );
const webpack = require( "webpack" );
const config = require( "../config" );
const merge = require( "webpack-merge" );
const baseWebpackConfig = require( "./webpack.base.conf" );
const CopyWebpackPlugin = require( "copy-webpack-plugin" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const OptimizeCSSPlugin = require( "optimize-css-assets-webpack-plugin" );
const UglifyJsPlugin = require( "uglifyjs-webpack-plugin" );

const env = require( "../config/prod.env" );

// noinspection WebpackConfigHighlighting
const webpackConfig = merge( baseWebpackConfig, {
	module: {
		rules: utils.styleLoaders( {
			sourceMap: config.build.productionSourceMap,
			extract: true,
			usePostCSS: true
		} )
	},
	mode: "production",
	optimization: {
		splitChunks: {
			chunks: "all",
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all"
				}
			}
		}
	},
	devtool: config.build.productionSourceMap ? config.build.devtool : false,
	output: {
		path: config.build.assetsRoot,
		filename: utils.assetsPath( "js/[name].[chunkhash].js" ),
		chunkFilename: utils.assetsPath( "js/[name].[chunkhash].js" )
	},
	plugins: [
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin( {
			AWS_ONLINE: true,
			"process.env": env
		} ),
		new UglifyJsPlugin( {
			uglifyOptions: {
				compress: {
					warnings: false
				}
			},
			sourceMap: config.build.productionSourceMap,
			parallel: true
		} ),
		// extract css into its own file
		new MiniCssExtractPlugin( {
			filename: utils.assetsPath( "css/[name].[contenthash].css" ),
			allChunks: true,
		} ),
		// Compress extracted CSS. We are using this plugin so that possible
		// duplicated CSS from different components can be deduped.
		new OptimizeCSSPlugin( {
			cssProcessorOptions: config.build.productionSourceMap
				? { safe: true, map: { inline: false } }
				: { safe: true }
		} ),
		// generate dist index.html with correct asset hash for caching.
		// you can customize output by editing /index.html
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin( {
			filename: config.build.index,
			template: "index.html",
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
				// more options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
			// necessary to consistently work with multiple chunks via CommonsChunkPlugin
			chunksSortMode: "dependency"
		} ),
		// keep module.id stable when vendor modules does not change
		new webpack.HashedModuleIdsPlugin(),
		// enable scope hoisting
		new webpack.optimize.ModuleConcatenationPlugin(),

		// copy custom static assets
		new CopyWebpackPlugin( [
			{
				from: path.resolve( __dirname, "../static" ),
				to: config.build.assetsSubDirectory,
				ignore: [ ".*" ]
			}
		] )
	]
} );

if ( config.build.productionGzip ) {
	const CompressionWebpackPlugin = require( "compression-webpack-plugin" );

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin( {
			asset: "[path]",
			algorithm: "gzip",
			test: new RegExp(
				"\\.(" +
                config.build.productionGzipExtensions.join( "|" ) +
                ")$"
			),
			threshold: -1,
			minRatio: 100
		} )
	);
}

if ( config.build.bundleAnalyzerReport ) {
	const BundleAnalyzerPlugin = require( "webpack-bundle-analyzer" ).BundleAnalyzerPlugin;
	webpackConfig.plugins.push( new BundleAnalyzerPlugin() );
}

module.exports = webpackConfig;
