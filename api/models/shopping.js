const mongoose = require('mongoose');

const shoppingSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {type: String, required: true},
	createDate: {type: String, required: true},
	shoppingImage : { type: String, reqired: true}
});

module.exports = mongoose.model('Shopping', shoppingSchema);