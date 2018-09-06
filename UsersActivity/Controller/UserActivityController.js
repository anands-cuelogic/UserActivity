require('dotenv').config();

import UserActivityModel from '../Model/UserActivityModel';
import moment from 'moment';
class UserActivityController {

    getActivityDetail(req, res) {
        const startDate = moment().subtract(process.env.DAYS, 'd').toDate();
        let loggedUsers = [];

        UserActivityModel.find()
            .populate('userId')
            .then((userActivity) => {
                userActivity.forEach((u) => {
                    if (moment(u.createdAt).isAfter(startDate)) {
                        loggedUsers.push({
                            firstName: u.userId.firstName,
                            lastName: u.userId.lastName,
                            email: u.userId.email
                        });
                    }
                });
                res.send(loggedUsers);
            })
            .catch();
    }
};

export default new UserActivityController();