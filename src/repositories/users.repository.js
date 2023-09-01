export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    };

    getUser = async (email) => {
        const result = await this.dao.getUser(email);
        return result;
    };

    getUserById = async (id) => {
        const result = await this.dao.getUserById(id);
        return result; 
    };
    
    getAllUser = async (filter) => {
        const result = await this.dao.getAllUser(filter);
        return result;
    };

    addUser = async (user) => {
        const result = await this.dao.addUser(user);
        return result;
    };

    updateUser = async (id, user) => {
        const result = await this.dao.updateUser(id, user);
        return result;
    }

    updateUserPush = async (id, user) => {
        const result = await this.dao.updateUserPush(id, user);
        return result;
    }

    deleteUserById = async (id) => {
        const result = await this.dao.deleteUserById(id);
        return result;
    };
    
    deleteAllUser = async (filter) => {
        const result = await this.dao.deleteAllUser(filter);
        return result;
    };

};