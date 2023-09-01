import { userModel } from "../models/users.Model.js";

export default class UserManager {

    constructor() {
        console.log('Working user with DB');
    };

    addUser = async (user) => {
        const result = await userModel.create(user);
        return result;
    }

    getUser = async (email) => {
        const user = await userModel.findOne( email );
        return user;
    }

    getUserById = async (id) => {
        const user = await userModel.findOne( id );
        return user; 
    };

    getAllUser = async (filter) => {
        const user = await userModel.find(filter).lean();
        return user; 
    };
    
    updateUser = async (id, user) => {
        const result = await userModel.updateOne({_id: id}, { $set: user });
        return result;
    };

    updateUserPush = async (id, dataPush) => {
        const result = await userModel.updateOne({_id: id}, {$push: dataPush});
        return result;
    };

    deleteUserById = async (id) => {
        const result = await userModel.deleteOne({_id: id});
        return result;
    };
    
    deleteAllUser = async (filter) => {
        const result = await userModel.deleteMany(filter);
        return result;
    };

};