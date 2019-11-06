const HtmlWebpackPlugin = require('html-webpack-plugin');
// const contextPath = 'D:\\Workspaces\\iesms-springbootapps-nbkngf\\iesms-springbootapps-webapps-nbkngf\\src\\main\\resources';
const contextPath = 'E:\\webpack';
module.exports = {
    entry: {
         // "PlanManage" : __dirname + "/src/PlanManage.js",
       "JalaSmartLineTable" : __dirname + "/src/JalaSmartLineTable.js",
       //  "HomePage" : __dirname + "/src/HomePage.js",
       //   "VideoMonitor" : __dirname + "/src/VideoMonitor.js",


    }, //已多次提及的唯一入口文件
    output: {
        path:  contextPath + "\\js",
        // path:  contextPath + "\\js",
        // path:  contextPath + "\\static\\module\\nbkngf",
       //path:  contextPath + "\\static\\module\\instmgmt",
        filename: "[name].js"
    },
    module:{
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "es2015", "react", "stage-0"
                        ],

                    }
                },
                exclude: /node_modules/
            },
            {
                test: /(\.css|\.less)$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                    },

                ]
            },
            {
                test: /(\.jpg|\.png)$/,
                use: [
                    {
                        loader: "url-loader"
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name][hash].[ext]",
                            outputPath: "fonts/"
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: './page',
        inline: true,
        port: 6005,
        proxy: {
            '/console/*': {
                target: 'http://127.0.0.1:60221/',
                //target: 'http://localhost:80/',
                secure: false
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname+"/index.tpl.html"
        })
    ]
}