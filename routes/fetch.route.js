import express from 'express';
import { getCountryDataFromDB, getPackageDataFromDB, getCollectionDataFromDB } from '../controllers/fetch.controller.js'; // Controller to handle fetching data from MongoDB

const router = express.Router();

// Endpoint to fetch data from MongoDB
router.get('/collectionData', getCollectionDataFromDB);
router.get('/packageData', getPackageDataFromDB);
router.get('/countryData', getCountryDataFromDB);

export default router;
