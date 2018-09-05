import express from 'express';
import passport from 'passport';

//Load UserController
import UserController from './Controller/UserController';

//const app = express();
const router = express.Router();

router.get('/', passport.authenticate('jwt', {
        session: false
    }), UserController.getAllUser)
    .post('/', UserController.createUser)
    .post('/login', UserController.login)
    .get('/search/:email', passport.authenticate('jwt', {
        session: false
    }), UserController.searchUser)
    .put('/edit/:email', passport.authenticate('jwt', {
        session: false
    }), UserController.editUser);

export default router;