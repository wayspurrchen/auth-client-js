
export default class ClientStorage {
    constructor(store) {
        this._store = store;
        if (!ClientStorage.enabled(this._store))
            throw Error('Storing data in localStorage unsupported.');
    }

    static enabled(test_store) {
        // Taken from: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/storage/localstorage.js
        const test_token = "test_token";
        try {
            test_store.setItem(test_token, test_token);
            test_store.getItem(test_token);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    get store() {
        return this._store;
    }

    setObject(key, value) {
        this._store.setItem(key, JSON.stringify(value));
    }

    getObject(key) {
        const value = this._store.getItem(key);
        return value && JSON.parse(value);
    }
}
