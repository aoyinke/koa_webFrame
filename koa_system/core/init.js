const requireDirectory = require('require-directory')
const Router = require('koa-router')


class InitManager {
    static  initCore(app) {
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

        async function whenLoadModule(obj) {
            if (obj instanceof Router) {
                await InitManager.app.use(obj.routes())
            }
        }
    }

    static loadException() {
        const errors = require('./http-exception')
        global.errs = errors
    }

    static loadConfig() {
        const configPath = `${process.cwd()}/config/config.js`
        const config = require(configPath)
        global.config = config
    }
}


module.exports = InitManager