require('dotenv').config();

import UserActivityModel from '../Model/UserActivityModel';
import UserModel from '../../User/Model/UserModel';
import moment, { ISO_8601 } from 'moment';
import { start } from 'repl';

class UserActivityController{

    getActivityDetail(req, res){
        const startDate = moment().subtract(5,'d').toDate();
        let loggedUsers = [];

       UserActivityModel.find()
         .populate('userId')
         .then((userActivity) => {
             userActivity.forEach( (u) => {
                 if(moment(u.createdAt).isAfter(startDate)){
                    loggedUsers.push({
                        firstName : u.userId.firstName,
                        lastName : u.userId.lastName,
                        email : u.userId.email
                    });
                 }
             });
             res.send(loggedUsers);
         })
         .catch();
    }
};

export default new UserActivityController();