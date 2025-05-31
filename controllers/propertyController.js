const Property = require('../models/property');
const Favorite = require('../models/favorite');
const { getCache, setCache, invalidateCache, generateCacheKey } = require('../utils/cacheHelpers');


const createProperty = async (req, res) => {
  try {
    const property = new Property({
      ...req.body,
      createdBy: req.user.id
    });
    await property.save();

    await invalidateCache('properties');

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error creating property', error });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const {
      state, city, minPrice, maxPrice, bedrooms, bathrooms,
      propertyType, area, furnishing, listingType, amenities,
      createdBy, tags, isVerified, minRating
    } = req.query;

    const filters = {};
    if (state) filters.state = state;
    if (city) filters.city = city;

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    if (bedrooms) filters.bedrooms = Number(bedrooms);
    if (bathrooms) filters.bathrooms = Number(bathrooms);
    if (propertyType) filters.type = propertyType;
    if (area) filters.areaSqFt = { $gte: Number(area) };
    if (furnishing) filters.furnished = furnishing;
    if (listingType) filters.listingType = listingType;
    if (createdBy) filters.createdBy = createdBy;
    if (isVerified !== undefined) filters.isVerified = isVerified === 'true';
    if (minRating) filters.rating = { $gte: Number(minRating) };

    if (amenities) filters.amenities = { $all: amenities.split(',') };
    if (tags) filters.tags = { $in: tags.split(',') };

    const cacheKey = generateCacheKey('properties', filters);
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ source: 'cache', data: cached });

    const properties = await Property.find(filters).sort({ createdAt: -1 });
    await setCache(cacheKey, properties);

    res.status(200).json({ source: 'db', data: properties });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const cacheKey = `property:${req.params.id}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json(cached);

    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    await setCache(cacheKey, property);
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving property', error });
  }
};


const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden: Not your property' });

    Object.assign(property, req.body);
    await property.save();

   
    await invalidateCache('properties');
    await invalidateCache(`property:${req.params.id}`);

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error updating property', error });
  }
};


const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden: Not your property' });

    await property.deleteOne();

    await invalidateCache('properties');
    await invalidateCache(`property:${req.params.id}`);

    res.status(200).json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
};


const addFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const exists = await Favorite.findOne({ userId: req.user.id, propertyId });
    if (exists) return res.status(400).json({ message: 'Already in favorites' });

    const favorite = new Favorite({ userId: req.user.id, propertyId });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to favorites', error });
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).populate('propertyId');
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites', error });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      userId: req.user.id,
      propertyId: req.params.propertyId
    });
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' });

    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite', error });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  addFavorite,
  getFavorites,
  removeFavorite
};
