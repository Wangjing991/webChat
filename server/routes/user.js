import express from 'express'
import UserModel from '../models/user.js'
import IDModel from '../models/id.js'

const router = express.Router();

router.get('/login', async ( req, res, next ) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        console.log(JSON.stringify(req.query), 'login')
        if ( !username || !password ) {
            res.send({
                status: 0,
                message: '用户名和密码不能为空'
            })
            return
        }

        const userInfo = await UserModel.findOne({ name: username, password })
        console.log(JSON.stringify(userInfo), 'login')
        if ( !userInfo ) {
            res.send({
                status: 0,
                message: '登录失败'
            })
            return
        }

        res.send({
            status: 200,
            message: '登录成功',
            user_info: {
                name: username,
                id: userInfo.id,
                avatar: userInfo.avatar
            }
        })
    } catch ( err ) {
        console.log('登录失败', err);
        res.send({
            status: 0,
            message: '登录失败',
        })
    }
})

router.get('/register', async ( req, res, next ) => {
    try {
        const username = req.query.username;
        const password = req.query.password;
        console.log(JSON.stringify(req.query), 'login')
        if ( !username || !password ) {
            res.send({
                status: 0,
                message: '用户名和密码不能为空'
            })
            return
        }

        const userInfo = await UserModel.findOne({ name: username })
        console.log(userInfo, 'userInfo')
        if ( userInfo ) {
            res.send({
                status: 0,
                message: '用户名已经注册'
            })
            return
        }

        const ID = await IDModel.findOne()
        ID.user_id++;
        await ID.save()
        const avatar = Math.ceil(Math.random() * 20) + '.jpg'
        await UserModel.create({
            name: username,
            id: ID.user_id,
            password,
            avatar,
        })
        req.session.user_id = ID.user_id;
        res.send({
            status: 200,
            message: '注册成功',
            user_info: {
                name: username,
                id: ID.user_id,
                avatar,
            }
        })
    } catch ( err ) {
        console.log('注册失败', err);
        res.send({
            status: 0,
            message: '注册失败',
        })
    }
})

router.get('/info', async ( req, res, next ) => {
    const session_user_id = req.session.user_id;
    const query_user_id = req.query.user_id;
    const user_id = session_user_id || query_user_id;
    if ( !user_id ) {
        console.log('用户未登陆')
        res.send({
            status: 0,
            message: '用户未登陆'
        })
        return
    }
    try {
        const userData = await UserModel.findOne({ id: user_id }, '-_id');
        if ( userData ) {
            res.send({
                status: 200,
                user_info: userData
            })
        } else {
            console.log('未找到当前用户')
            res.send({
                status: 0,
                message: '未找到当前用户'
            })
        }
    } catch ( err ) {
        console.log('获取用户信息失败', err)
        res.send({
            status: 0,
            message: '获取用户信息失败'
        })
    }
})


router.get('/all', async ( req, res, next ) => {
    const { limit = 20, offset = 0 } = req.query;
    try {
        const users = await UserModel.find({}, '-_id -__v').skip(Number(offset)).limit(Number(limit));
        res.send({
            status: 200,
            users,
        })
    } catch ( err ) {
        console.log('获取用户列表失败', err);
        res.send({
            type: 'ERROR_TO_GET_USER_LIST',
            message: '获取用户列表失败'
        })
    }
})

export default router