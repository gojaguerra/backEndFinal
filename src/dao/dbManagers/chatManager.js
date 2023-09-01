import { messageModel } from "../models/messageModel.js";

export default class MessageManager {

    constructor() {
        console.log('Working chats with DB');
    };

    addMessage = async (message) => {
        const result = await messageModel.create(message);
        return result;
    };

};