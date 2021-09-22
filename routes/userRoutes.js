const express = require('express');
const userController = require('./../controllers/userController');
const { getUser, updateUser, deleteUser } = userController;

const router = express.Router();
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
