const Shopping = require('../models/shopping');
const mongoose = require('mongoose');

exports.shoppings_get_all =  (req, res, next) =>{
	Shopping.find()
	.select('name createDate _id shoppingImage')
	.exec()
	.then(docs => {
		const response = {
			count: docs.length,
			shopping: docs.map(doc => {
				return{
					name: doc.name,
					price: doc.createDate,
					shoppingImage: doc.shoppingImage,
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
}

exports.shoppings_create = (req, res, next) => {
    const shopping = new Shopping({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		createDate: req.body.createDate,
		shoppingImage: req.file.path
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
}

exports.shoppings_get_byId = (req, res, next) =>{
	const id = req.params.shoppingId;
	Shopping.findById(id)
	.select('name createDate _id shoppingImage')
	.exec()
	.then(doc =>{
		console.log("From Database", doc);
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
}

exports.shoppings_update = (req, res, next) =>{
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
}

exports.shoppings_delete = (req, res, next) =>{
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
}