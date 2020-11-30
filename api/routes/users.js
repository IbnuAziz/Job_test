const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

mongoose.set('useCreateIndex', true);

const User = require('../models/user');

router.get('/', (req, res, next) =>{
	User.find()
	.select('username email password _id')
    .exec()
	.then(docs => {
		res.status(200).json({
			count: docs.length,
			users: docs.map(doc =>{
				return {
					_id: doc._id,
					username: doc.username,
                    email: doc.email,
                    password: doc.password,
					reqeust: {
						type: 'GET',
						url: 'http://localhost:3000/users/' +doc._id
					}
				}
			})
		});
	})
	.catch(err =>{
		res.status(500).json({
			error: err
		});
	});
});

router.post('/signup', (req, res, next) => {
    User.find({ email:req.body.email })
    .exec()
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({       //409 adalah confilct status dan 422 unproccessible entity status
                message: 'Email sudah digunakan'
            });
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username : req.body.username,
                        password : hash,
                        email : req.body.email,
                        phone : req.body.phone,
                        country: req.body.country,
                        city : req.body.city,
                        postcode : req.body.postcode,
                        name : req.body.name,
                        address : req.body.address,
                    });
                    user
                    .save()
                    .then(result =>{
                        console.log(result);
                        res.status(201).json({
                            message: 'User Berhasil Dibuat!'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
                }
            })
        }
    })
});

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth Failed!'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: 'Auth Failed!'
                });
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message: 'Auth Successfull',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth Failed!'
            });
        });
    })
    .catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User Berhasil di Delete'
        });
    })
    .catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

module.exports = router;