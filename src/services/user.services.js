import { usersRepository } from '../repositories/index.js';

const getUser = async (email) => {
    const user = await usersRepository.getUser(email);
    return user;
};

const getUserById = async (id) => {
    const user = await usersRepository.getUserById(id);
    return user;
};

const getAllUser = async (filter) => {
    const user = await usersRepository.getAllUser(filter);
    return user;
};

const addUser = async (user) => {
    const result = await usersRepository.addUser(user);
    return result;
};

const updateUser = async (id, user) => {
    const result = await usersRepository.updateUser(id, user);
    return result;
};

const updateUserPush = async (id, user) => {
    const result = await usersRepository.updateUserPush(id, user);
    return result;
};

const deleteUserById = async (id) => {
    const result = await usersRepository.deleteUserById(id);
    return result;
};

const deleteAllUser = async (filter) => {
    const result = await usersRepository.deleteAllUser(filter);
    return result;
};

export {
    getUser,
    getUserById,
    getAllUser,
    addUser,
    updateUser,
    updateUserPush,
    deleteUserById,
    deleteAllUser
};