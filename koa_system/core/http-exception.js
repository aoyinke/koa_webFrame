
class HttpException extends Error{
    constructor(msg='服务器异常',errorCode=10000, code=400){
        super()
        this.errorCode = errorCode
        this.code = code
        this.msg = msg
    }
}

class ParameterException extends HttpException{
    constructor(msg, errorCode){
        super()
        this.code = 400
        this.msg = msg || '参数错误'
        this.errorCode = errorCode || 10000
    }
}

class Success extends HttpException{
    constructor(msg, errorCode){
        super()
        this.code = 201
        this.msg = msg || 'ok'
        this.errorCode = errorCode || 0
    }
}

class NotFound extends HttpException{
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '资源未找到'
        this.errorCode = errorCode || 10000
        this.code = 404
    }
}

class AuthFailed  extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '授权失败'
        this.errorCode = errorCode || 10004
        this.code = 401
    }
}

class Forbbiden extends HttpException{
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '禁止访问'
        this.errorCode = errorCode || 10006
        this.code = 403
    }
}

class LikeError extends HttpException {
    constructor(msg, error_code) {
        super()
        this.code = 400
        this.msg = "你已经点赞过"
        this.error_code = 60001
    }
}

class DislikeError extends HttpException {
    constructor(msg, error_code) {
        super()
        this.code = 400
        this.msg = "你已取消点赞"
        this.error_code = 60002
    }
}

class SubmitError extends HttpException{
    constructor(msg, error_code) {
        super()
        this.code = 400
        this.msg = "你已经递交过申请"
        this.error_code = 60003
    }
}

class GroupRegisterError extends HttpException{
    constructor(msg, error_code) {
        super()
        this.code = 400
        this.msg = "该社团已经被注册过"
        this.error_code = 60004
    }
}
class SaveError extends HttpException{
    constructor(msg, error_code) {
        super()
        this.code = 400
        this.msg = "该动态已经收藏过"
        this.error_code = 60005
    }
}

class CancelSaveError extends HttpException{
    constructor(msg, error_code) {
        super()
        this.code = 400
        this.msg = "你已取消收藏"
        this.error_code = 60006
    }
}

class NeedFavorError extends HttpException{
    constructor(msg, error_code) {
        super()
        this.code = 400
        this.msg = "你已支持该需求"
        this.error_code = 60007
    }
}

class CancelFavorError extends HttpException{
    constructor(msg, error_code) {
        super()
        this.code = 400
        this.msg = "你已取消支持该需求"
        this.error_code = 60008
    }
}

class CoverImgError extends HttpException{
    constructor(msg, error_code) {
        super()
        this.code = 400
        this.msg = "已删除该图片"
        this.error_code = 60009
    }
}

module.exports = {
    HttpException,
    ParameterException,
    Success,
    NotFound,
    AuthFailed,
    Forbbiden,
    LikeError,
    DislikeError,
    SubmitError,
    GroupRegisterError,
    SaveError,
    CancelSaveError,
    NeedFavorError,
    CancelFavorError,
    CoverImgError
}