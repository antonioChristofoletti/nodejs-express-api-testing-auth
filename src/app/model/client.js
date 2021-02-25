module.exports = class Client {
    constructor({id, name}) {
        this._id = id
        this._name = name
    }

    set id(id) {
        this._id = id
    }

    get id() {
        return this._id
    }

    set name(name) {
        this._name = name
    }

    get name() {
        return this._name
    }
}