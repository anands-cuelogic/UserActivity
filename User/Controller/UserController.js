import UserModel from '../Model/UserModel';
import keys from '../../config/keys';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserActivityModel from '../../UsersActivity/Model/UserActivityModel';
import moment from 'moment';

class UserController {

    createUser(req, res) {
        UserModel.findOne({
            email: req.body.email
        }).then((user) => {
            if (user) {
                res.json('Email already taken');
            } else {

                let newUser = new UserModel({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                });
                console.log('New User ' + newUser);
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => res.json(err));
                    });
                });
            }
        });
    }

    login(req, res) {
        console.log("req.body====>" + JSON.stringify(req.body));
        UserModel.findOne({
            email: req.body.email
        }).then((user) => {
            if (!user) {
                res.status(404).json({
                    message: 'User not found'
                });
            }
            //Check password
            bcrypt.compare(req.body.password, user.password).then((isMatch) => {
                if (isMatch) {
                    //Create the payload
                    const payload = {
                        id: user.id,
                        email: user.email
                    };

                    //Sign Token
                    jwt.sign(payload, keys.secretOrKey, {
                        expiresIn: 36000
                    }, (err, token) => {

                        //Store the user info in UserActitvity collection
                        const newUserActitvity = new UserActivityModel({
                            userId: user.id,
                            IP: req.headers['host'],
                            UA: req.headers['user-agent'],
                            date: new Date()
                        });

                        newUserActitvity.save()
                            .then((userActivity) => {
                                console.log('logged user activity ' + userActivity);
                            })
                            .catch((err) => {
                                console.log('Error in logging ' + err);
                            });

                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    });
                } else {
                    res.status(400).json({
                        message: 'Password is incorrect'
                    });
                }
            });
        });
    }

    searchUser(req, res) {
        console.log('USER ' + req.params.email);
        UserModel.find({
                email: req.params.email
            })
            .then((user) => {
                user.forEach(u => {
                    res.json({
                        Name: u.firstName + ' ' + u.lastName
                    });
                });
            })
            .catch((err) => {
                res.json({
                    error: err
                });
            });
    }

    getAllUser(req, res) {
        UserModel.find().then((user) => {
            user.forEach(u => {
                res.json({
                    Name: u.first + ' ' + u.lastName,
                    CreatedAt: u.CreatedAt
                });
            });
        }).catch((err) => {

        });
    }
}

export default new UserController();