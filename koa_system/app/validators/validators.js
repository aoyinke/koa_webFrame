const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const { User } = require('../models/user')
const { LoginType,societyType } = require('../lib/enum')
class PositiveIntegerValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', '需要正整数', { min: 1 }),
        ]
    }
}

class RegisterValidator extends LinValidator {
    constructor() {
        super()
        this.email = [
            new Rule('isEmail', '不符合email规范')
        ]
        this.password1 = [
            new Rule('isLength', '密码长度至少6位，至多32位', { min: 6, max: 32 }),
            new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
        ]
        this.password2 = this.password2
        this.nickname = [
            new Rule('isLength', '账号不符合规范', {
                min: 4,
                max: 32
            })
        ]
    }

    validatePassword(vals) {
        const psw1 = vals.body.password1
        const psw2 = vals.body.password2

        if (psw1 != psw2) {
            throw new Error('两次密码输入不一致')
        }
    }

    async validateEmail(vals) {
        const email = vals.body.email
        const user = await User.findOne({
            where: {
                email
            }
        })
        if (user) {
            throw new Error('用户已经存在')
        }
    }
}

class TokenValidator extends LinValidator {
    constructor() {
        super()
        this.account = [
            new Rule('isLength', '账号不符合规范', { min: 4, max: 32 })
        ]
        this.secret = [
            new Rule('isOptional'),
            new Rule('isLength', '密码长度不符合规范', { min: 6, max: 32 })
        ]

    }

    validateType(vals) {
        if (!vals.body.type) {
            throw new Error('type必须是参数')
        }
        if (!LoginType.isThisType(vals.body.type)) {
            throw new Error('type不符合规范')
        }
    }
}

class NotEmptyValidator extends LinValidator {
    constructor() {
        super()
        this.token = [
            new Rule('isLength', '不允许为空', {
                min: 1
            })
        ]
    }
}


function checkType(vals) {
    let type = vals.body.type || vals.path.type
    if (!type) {
        throw new Error('type是必须参数')
    }
    type = parseInt(type)

    if (!LoginType.isThisType(type)) {
        throw new Error('type参数不合法')
    }
}

function checkSocietyType(vals) {
    let type = vals.body.type || vals.path.type
    if (!type) {
        throw new Error('type是必须参数')
    }
    type = parseInt(type)

    if (!societyType.isThisType(type)) {
        throw new Error('type参数不合法')
    }
}

class AddCommentValidator extends PositiveIntegerValidator {
    constructor() {
        super()
        this.content = [
            new Rule('isLength', '不能为空', {
                min: 1
            })
        ]
    }
}


class LikeValidator extends PositiveIntegerValidator {
    constructor() {
        super()
        this.validateType = checkSocietyType
        // const checker = new Checker(ArtType)
        // this.validateType = checker.check.bind(checker)
    }
}

class GroupInfoValidator extends LinValidator{
    constructor(){
        super()
        
    }
}
class ActivityValidator extends LinValidator{
    constructor(){
        super()
        this.type = [
            
            new Rule('isLength', 'type是必填参数', { min: 1})
        ]
        this.category = [
            new Rule('isLength', 'category是必填参数', { min: 1})
        ]
    
    }
}
class GetActivityValidator extends LinValidator{
    constructor(){
        super()
        this.limit = [
            
            new Rule('isLength', 'limit是必填参数', { min: 1})
        ]
        this.offset = [
            new Rule('isLength', 'offset是必填参数', { min: 1})
        ]
    
    }
}
class UpdateUserInfoValidator extends LinValidator{
    constructor(){
        super()
        
    }
}
module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    TokenValidator,
    ActivityValidator,
    NotEmptyValidator,
    LikeValidator,
    AddCommentValidator,
    GroupInfoValidator,
    UpdateUserInfoValidator,
    GetActivityValidator
    
}