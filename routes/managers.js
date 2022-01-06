const express = require('express');
const router = express.Router();
const catchAsync           = require('../utils/catchAsync');
const managerController = require('../controllers/managers');
const { isLoggedIn, isAuthor, validateManager }       = require('../utils/middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// ================================================================== //
// ====================== Routes ==================================== //
// ================================================================== //
router.route('/managers')
      .get(catchAsync(managerController.index))
      .post(isLoggedIn, upload.array('image'), validateManager, catchAsync(managerController.postManager));
// GET /managers/new - Get create new manager form
router.get('/managers/new', isLoggedIn, managerController.getNewForm);

router.route('/managers/:id')
      .get(catchAsync(managerController.getManager))
      .put(isLoggedIn, isAuthor, upload.array('image'), validateManager, catchAsync(managerController.putManagers))
      .delete(isLoggedIn, isAuthor, catchAsync(managerController.deleteManager));

// GET /managers - View all managers
// router.get('/managers', catchAsync(managerController.index));

// POST /managers - Create new manager
// Stops API calls from posting new managers without correct data
// router.post('/managers', validateManager, catchAsync(managerController.postManager));

// GET /managers/:id - View specific manager
// router.get('/managers/:id', catchAsync(managerController.getManager));

// PUT /managers/:id - Update specific manager
// router.put('/managers/:id', isLoggedIn, isAuthor, validateManager, catchAsync(managerController.putManagers)); 

// DELETE /managers/:id - Delete specific manager
// router.delete('/managers/:id', isLoggedIn, isAuthor, catchAsync(managerController.deleteManager));

// GET /managers/:id/edit - Get update manager form
router.get('/managers/:id/edit', isLoggedIn, isAuthor, catchAsync(managerController.getEditForm));



// ================================================================== //
// ====================== Exports =================================== //
// ================================================================== //

module.exports = router;
