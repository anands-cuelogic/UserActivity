import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

//Load UserController
import UserController from './Controller/UserController';
import {
    Agent
} from 'https';

//const app = express();
const router = express.Router();

router.get('/', passport.authenticate('jwt', {
        session: false
    }), UserController.getAllUser)
    .post('/', UserController.createUser)
    .post('/login', UserController.login)
    .get('/search/:email', passport.authenticate('jwt', {
        session: false
    }), UserController.searchUser);

export default router;