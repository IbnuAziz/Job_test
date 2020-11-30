const express = require('express');
const router = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null,  './uploads/');
	},
	filename: function(req, file, cb){
		cb(null, file.originalname);
	}
});

const fileFilter = (req, file, cb) =>{
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		cb(null, true);
	}else{
		cb(null, false);
	}
}

const upload = multer({
	storage: storage, 
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});


const checkAuth = require('../middleware/check-auth');
const ShoopingController = require('../controllers/shoppings');

router.get('/', ShoopingController.shoppings_get_all);

router.post ('/', checkAuth, upload.single('shoppingImage'), ShoopingController.shoppings_create);

router.get('/:shoppingId', ShoopingController.shoppings_get_byId);

router.patch('/:shoppingId', checkAuth, ShoopingController.shoppings_update);

router.delete('/:shoppingId', checkAuth, ShoopingController.shoppings_delete);

module.exports = router;