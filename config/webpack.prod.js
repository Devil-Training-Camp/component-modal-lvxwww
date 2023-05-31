const path = require("path");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//将css提取为单独文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//css压缩
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
//js压缩
const TerserWebpackPlugin = require("terser-webpack-plugin");
//图片压缩
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
//复制文件
const CopyPlugin = require("copy-webpack-plugin");

//统一处理样式loader
const getStyleLoaders = () => {
  return [
    MiniCssExtractPlugin.loader,
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
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/[name].[contenthash:10].js", //设置文件名
    chunkFilename: "static/js/[name].[contenthash:10.chunk.js", //模块和node等文件
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

    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:10].css",
      chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
    }),
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
  ],
  mode: "production",
  devtool: "source-map",
  optimization: {
    splitChunks: {
      //代码分割
      chunks: "all",
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`,
    },
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
};
