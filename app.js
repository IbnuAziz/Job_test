const express = require ('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const shoppingRoutes = require('./api/routes/shoppings');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');


mongoose.connect("mongodb+srv://testv1:" +
	process.env.MONGO_ATLAS_PW +
	"@project-v1.iufrr.mongodb.net/Project-v1?retryWrites=true&w=majority",
    {
	    useNewUrlParser: true,
	    useUnifiedTopology: true 
	}
);

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); // make uploads folder publicly access
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


app.use('/shoppings', shoppingRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

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