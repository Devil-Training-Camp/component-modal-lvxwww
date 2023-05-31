const path = require("path");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

//统一处理样式loader
const getStyleLoaders = () => {
  return [
    "style-loader",
    "css-loader",
    {
      loader: "postcss-loader", //css的兼容性出，需要在package.json指定兼容的浏览器 browserslist
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"], //使用预设
        },
      },
    },
  ];
};

module.exports = {
  entry: "./src/main.js",
  output: {
    path: undefined,
    filename: "static/js/[name].js", //设置文件名
    chunkFilename: "static/js/[name].chunk.js", //模块和node等文件
    assetModuleFilename: "static/media/[hash:10][ext][query]",
  },
  module: {
    rules: [
      //处理css
      {
        test: /\.css$/,
        use: [...getStyleLoaders()],
      },
      //处理less
      {
        test: /\.less$/,
        use: [...getStyleLoaders(), "less-loader"],
      },
      //处理sass,scss
      {
        test: /\.s[ac]ss$/,
        use: [...getStyleLoaders(), "sass-loader"],
      },
      //处理stylus
      {
        test: /\.styl$/,
        use: [...getStyleLoaders(), "stylus-loader"],
      },
      //处理图片
      {
        test: /\.(jpe?g|png|gif|webp|svg)/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, //10kb，小于就转为base64
          },
        },
      },
      //处理图标资源
      {
        test: /\.(woff2?|ttf)/,
        type: "asset/resource",
      },
      //处理js （1.eslint 2.babel）
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, "../node_modules"),
        loader: "babel-loader",
        options: {
          cacheDirectory: true, //使用缓存
          cacheCompression: false,
          plugins: [require.resolve("react-refresh/babel")], //解决js热更新的问题
        },
      },
    ],
  },

  plugins: [
    new EslintWebpackPlugin({
      //eslint的设置，需要配合.eslinttrc.js（配置eslint的规则）
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", //忽略处理
      cache: true,
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
    }),
    //处理html (创建出一个新的html并自动引入js)
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
    }),
    //解决js热更新的问题
    new ReactRefreshWebpackPlugin(),
  ],
  mode: "development",
  devtool: "cheap-module-source-map",
  optimization: {
    splitChunks: {
      //代码分割
      chunks: "all",
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
  },
  devServer: {
    host: "localhost",
    port: 3000,
    open: true,
    hot: true, //开启HMR。不支持js文件的热更新  js利用react-refresh 和@pmmmwh/react-refresh-webpack-plugin
    historyApiFallback: true, //解决前端路由刷新404
  },
};
