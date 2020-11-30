const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Shopping = require('../models/shopping');

router.get('/', (req, res, next) =>{
	Shopping.find()
	.select('name createDate _id')
	.exec()
	.then(docs => {
		const response = {
			count: docs.length,
			shopping: docs.map(doc => {
				return{
					name: doc.name,
					price: doc.createDate,
					_id: doc._id,
					request:{
						type: 'GET',
						url: 'http://localhost:3000/shopping/' + doc._id
					}
				}
			})
		}
		// if(docs.length >= 0){
		res.status(200).json(response);

		// }else{
		// 	res.status(404).json({
		// 		message: 'No entry Found'
		// 	});
		// }

	})
	.catch(err=> {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});


router.post ('/', (req, res, next) => {
    const shopping = new Shopping({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		createDate: req.body.createDate
    });
    shopping
	.save()
	.then(result => {
		console.log(result);
		res.status(201).json({
		message: 'Created Shopping successfully',
		createdShopping: {
			name: result.name,
			createDate: result.createDate,
			_id: result._id,
			reqeust: {
				type: 'GET',
				url: `http://localhost:3000/shopping/${result._id}`
			}
		}
	});
	}).catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.get('/:shoppingId', (req, res, next) =>{
	const id = req.params.shoppingId;
	Shopping.findById(id)
	.select('name createDate _id')
	.exec()
	.then(doc =>{
		console.log(doc);
	if (doc){
		res.status(200).json({
			product: doc,
			reqeust: {
				type: 'GET',
				url: 'http://localhost:300/shopping'
			}
		});
	}else
		res.status(404).json({
			message:'No valid entry found for provided ID'
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({error: err});
	});
});

router.patch('/:shoppingId', (req, res, next) =>{
	const id = req.params.shoppingId;
	const updateOps = {};
	for (const ops of req.body){
		updateOps[ops.propName] = ops.value;
	}
	Shopping.update({ _id:id }, {$set: updateOps })
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Shopping updated!',
			reqeust: {
				type: 'GET',
				url: 'http://localhost:3000/shopping/' + id
			}
		});
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.delete('/:shoppingId', (req, res, next) =>{
	const id = req.params.shoppingId;
	Shopping.remove({_id: id})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'shopping deleted!',
			reqeust: {
				type: 'POST',
				url: 'http://localhost:3000/shopping',
				body:{ name: 'String', createDate: 'String' }
			}
		})
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error:err
		});
	});
});

module.exports = router;