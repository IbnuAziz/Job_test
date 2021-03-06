const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	product: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopping', required: true},
    quantity: { type: Number, default: 1},
    quality : { type : String, required: true}
});

module.exports = mongoose.model('Order', orderSchema);
