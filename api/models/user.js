const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
    username : { type: String, required: true},
    password : { type: String, reqired: true},
    email : { 
        type: String, 
        reqired: true, 
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    phone : { type: String, reqired: true},
    country : { type: String, reqired: true},
    city : { type: String},
    postcode : { type: Number, reqired: true},
    name : { type: String, reqired: true},
    address : { type: String, reqired: true},
});

module.exports = mongoose.model('User', userSchema);
