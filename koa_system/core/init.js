const requireDirectory = require('require-directory')
const Router = require('koa-router')


class InitManager {
    static initCore(app) {
        InitManager.app = app
        InitManager.initLoadRouters()
        InitManager.loadException()
        InitManager.loadConfig()
    }

    static initLoadRouters() {
        //path config
        const apiDirectory = `${process.cwd()}/app/api`
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule
        })

        function whenLoadModule(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
    }

    static loadException() {
        const errsPath = `${process.cwd()}/middlewares/exception.js`
        const errs = require('./http-exception')
        global.errs = errs
    }

    static loadConfig() {
        const configPath = `${process.cwd()}/config/config.js`
        const config = require(configPath)
        global.config = config
    }
}


module.exports = InitManager