module.exports = class User {
    constructor({id, user, email, password}) {
        this._id = id
        this._user = user
        this._email = email
        this._passHash = password
    }

    get id() {
        return this._id
    }

    get user() {
        return this._user
    }

    get email() {
        return this._email
    }
    
    set passHash(passHash) {
        this._passHash = passHash
    }

    get passHash() {
        return this._passHash
    }
}