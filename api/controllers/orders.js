const mongoose = require('mongoose');
const Order = require('../models/order');
const Shopping = require('../models/shopping');

exports.orders_get_all = (req, res, next) =>{
	Order.find()
	.select('product quantity quality _id')
    .populate('product','name')
    .exec()
	.then(docs => {
		res.status(200).json({
			count: docs.length,
			orders: docs.map(doc =>{
				return {
					_id: doc._id,
					product: doc.product,
                    quantity: doc.quantity,
                    quality: doc.quality,
					reqeust: {
						type: 'GET',
						url: 'http://localhost:3000/orders/' +doc._id
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
};

exports.orders_create_order = (req, res, next) =>{
	Shopping.findById(req.body.shoppingId)
		.then(shopping => {
			if(!shopping){
				return res.status(404).json({
					message: "Product not found"
				})
			}
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				quantity: req.body.quantity,
                product: req.body.shoppingId,
                quality: req.body.quality
			});
			return order.save()
		})
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: 'Order Stored',
				createdOrder: {
					_id: result._id,
					product: result.product,
                    quantity: result.quantity,
                    quality: result.quality
				},
				reqeust: {
					type: 'GET',
					url: 'http://localhost:3000/orders/' + result._id
				}
			})
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}

exports.orders_get_byId = (req, res, next) =>{
	Order.findById(req.params.orderId)
	.select('product _id quantity quality')
	.populate('product')
	.exec()
	.then(order =>{
		if(!order){
			return res.status(404).json({
				message: 'Order not found / was deleted by Admin'
			});
		}
		res.status(200).json({
			order: order,
			reqeust: {
				type: 'GET',
				url: 'http://localhost:3000/orders'
			}
		})
	})
	.catch(err =>{
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
}

exports.orders_delete_order = (req, res, next) => {
	Order.remove({_id: req.params.orderId})
	.exec()
	.then(result => {
		res.status(200).json({
			message: 'Order deleted',
			reqeust: {
				type: 'POST',
				url: 'http://localhost:3000/orders',
				body: {productId: 'ID', quantity: 'Number', quality: 'String'}
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