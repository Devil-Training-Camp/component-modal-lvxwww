const path = require("path");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
//将css提取为单独文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//css压缩
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
//js压缩
const TerserWebpackPlugin = require("terser-webpack-plugin");
//图片压缩
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
//复制文件
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

//统一处理样式loader
const getStyleLoaders = () => {
  return [
    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
    {
      loader: "css-loader",
      options: {
        modules: {
          localIdentName: "[local]--[hash:base64:5]",
        },
      },
    },
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
    path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
    filename: isProduction ? "static/js/[name].[contenthash:10].js" : "static/js/[name].js", //设置文件名
    chunkFilename: isProduction ? "static/js/[name].[contenthash:10].chunk.js" : "static/js/[name].chunk.js", //模块和node等文件
    assetModuleFilename: "static/media/[hash:10][ext][query]",
    clean: true, //清除上次的打包文件
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
        use: [
          ...getStyleLoaders(),
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                modifyVars: { "@primary-color": "red" }, //修改antd的主题色
                javascriptEnabled: true,
              },
            },
          },
        ],
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
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      //处理js （1.eslint 2.babel）
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, "../node_modules"),
        loader: "babel-loader",
        options: {
          cacheDirectory: true, //使用缓存
          cacheCompression: false,
          plugins: [!isProduction && require.resolve("react-refresh/babel")].filter(Boolean),
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
      template: path.resolve(__dirname, "../public/index.html"),
    }),

    isProduction &&
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:10].css",
        chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
      }),
    isProduction &&
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "../public"),
            to: path.resolve(__dirname, "../dist"),
            toType: "dir",
            noErrorOnMissing: true, // 不生成错误
            globOptions: {
              // 忽略文件
              ignore: ["**/index.html"],
            },
            info: {
              // 跳过terser压缩js
              minimized: true,
            },
          },
        ],
      }),
    !isProduction && new ReactRefreshWebpackPlugin(), //解决js热更新的问题
  ].filter(Boolean),
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  optimization: {
    splitChunks: {
      //代码分割
      chunks: "all",
      cacheGroups: {
        // layouts通常是admin项目的主体布局组件，所有路由组件都要使用的
        // 可以单独打包，从而复用
        // 如果项目中没有，请删除
        layouts: {
          name: "layouts",
          test: path.resolve(__dirname, "../src/layouts"),
          priority: 40,
        },
        // 如果项目中使用antd，此时将所有node_modules打包在一起，那么打包输出文件会比较大。
        // 所以我们将node_modules中比较大的模块单独打包，从而并行加载速度更好
        // 如果项目中没有，请删除
        antd: {
          name: "chunk-antd",
          test: /[\\/]node_modules[\\/]antd(.*)/,
          priority: 30,
        },
        // 将react相关的库单独打包，减少node_modules的chunk体积。
        react: {
          name: "react",
          test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
          chunks: "initial",
          priority: 20,
        },
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10, // 权重最低，优先考虑前面内容
          chunks: "initial",
        },
      },
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
    // 是否需要进行压缩
    minimizer: isProduction,
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
      // new ImageMinimizerPlugin({
      //   minimizer: {
      //     implementation: ImageMinimizerPlugin.imageminGenerate,
      //     options: {
      //       plugins: [
      //         ["gifsicle", { interlaced: true }],
      //         ["jpegtran", { progressive: true }],
      //         ["optipng", { optimizationLevel: 5 }],
      //         [
      //           "svgo",
      //           {
      //             plugins: [
      //               "preset-default",
      //               "prefixIds",
      //               {
      //                 name: "sortAttrs",
      //                 params: {
      //                   xmlnsOrder: "alphabetical",
      //                 },
      //               },
      //             ],
      //           },
      //         ],
      //       ],
      //     },
      //   },
      // })
    ],
  },
  //
  resolve: {
    //自动补全文件扩展名
    extensions: [".tsx", ".jsx", ".ts", ".js", ".json"],
  },
  devServer: {
    host: "localhost",
    port: 3000,
    open: true,
    hot: true, //开启HMR。不支持js文件的热更新  js利用react-refresh 和@pmmmwh/react-refresh-webpack-plugin
    historyApiFallback: true, //解决前端路由刷新404
  },
};
