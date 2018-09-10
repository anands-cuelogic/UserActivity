import UserModel from "../Model/UserModel";
import keys from "../../config/keys";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserActivityModel from "../../UsersActivity/Model/UserActivityModel";

let encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        });
    });
};

class UserController {

    createUser(req, res) {
        UserModel.findOne({
            email: req.body.email
        }).then(user => {
            if (user) {
                res.json("Email already taken");
            } else {
                let newUser = new UserModel({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                });
                console.log("New User " + newUser);
                encryptPassword(newUser.password)
                    .then((hash) => {
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => res.json(err));
                    });
            }
        });
    }

    login(req, res) {
        UserModel.findOne({
            email: req.body.email
        }).then(user => {
            if (!user) {
                res.status(404).json({
                    message: "User not found"
                });
            }
            //Check password
            bcrypt.compare(req.body.password, user.password).then(isMatch => {
                if (isMatch) {
                    //Create the payload
                    const payload = {
                        id: user.id,
                        email: user.email
                    };

                    //Sign Token
                    jwt.sign(
                        payload,
                        keys.secretOrKey, {
                            expiresIn: 36000
                        },
                        (err, token) => {
                            //Store the user info in UserActitvity collection
                            const newUserActitvity = new UserActivityModel({
                                userId: user._id,
                                IP: req.headers.host,
                                UA: req.headers["user-agent"],
                                date: new Date()
                            });

                            newUserActitvity
                                .save()
                                .then(userActivity => {
                                    console.log("logged user activity " + userActivity);
                                })
                                .catch(err => {
                                    console.log("Error in logging " + err);
                                });

                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        }
                    );
                } else {
                    res.status(400).json({
                        message: "Password is incorrect"
                    });
                }
            });
        });
    }

    searchUser(req, res) {
        console.log("USER " + req.params.email);
        UserModel.find({
                email: req.params.email
            })
            .then(user => {
                user.forEach(u => {
                    res.json({
                        Name: u.firstName + " " + u.lastName
                    });
                });
            })
            .catch(err => {
                res.json({
                    error: err
                });
            });
    }

    getAllUser(req, res) {
        let usersRes = [];
        UserModel.find().cache({
            key : 'users'
        })
            .then(user => {
                user.forEach(u => {
                    usersRes.push({
                        Name: u.firstName + " " + u.lastName,
                        CreatedAt: u.createdAt
                    });
                });
                res.json(usersRes);
            })
            .catch(err => {});
    }

    editUser(req, res) {
        UserModel.findOne({
                email: req.params.email
            })
            .then((user) => {
                if (user) {
                    if (req.body.firstName) user.firstName = req.body.firstName;
                    if (req.body.lastName) user.lastName = req.body.lastName;
                    if (req.body.email) user.email = req.body.email;
                    if (req.body.password) {
                        encryptPassword(req.body.password)
                            .then((hash) => {
                                user.password = hash;
                            });
                    }
                    user.save()
                        .then((updatedUser) => {
                            console.log('Updated user ' + updatedUser);
                            res.send(updatedUser);
                        });
                }
                else{
                    res.status(404).json({
                        message : 'User not found'
                    });
                }
            })
            .catch((err) => res.send(err));
    }
}

export default new UserController();