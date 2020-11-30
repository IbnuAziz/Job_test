const express = require ('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const shoppingRoutes = require('./api/routes/shoppings');

mongoose.connect("mongodb+srv://testv1:test@project-v1.iufrr.mongodb.net/Project-v1?retryWrites=true&w=majority",
    {
	    useNewUrlParser: true,
	    useUnifiedTopology: true 
	}
);

// const uri = "mongodb+srv://testv1:test@project-v1.iufrr.mongodb.net/Project-v1?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
// perform actions on the collection object
//   client.close();
// });


mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
	res.header("Acces-Control-Allow-Origin","*");
	res.header(
		"Acces-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if(req.method === 'OPTIONS'){
		res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});


app.use('/shopping', shoppingRoutes);

//Handling Error Message
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error:{
			message:error.message
		}
	});
});


module.exports = app;