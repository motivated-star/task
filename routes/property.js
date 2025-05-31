const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');
const propertyController = require('../controllers/propertyController');

// PROPERTY CRUD
router.post('/', authenticateUser, propertyController.createProperty);
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.put('/:id', authenticateUser, propertyController.updateProperty);
router.delete('/:id', authenticateUser, propertyController.deleteProperty);

// FAVORITES
router.get('/favorites', authenticateUser, propertyController.getFavorites);
router.post('/favorites', authenticateUser, propertyController.addFavorite);
router.delete('/favorites/:propertyId', authenticateUser, propertyController.removeFavorite);


module.exports = router;


