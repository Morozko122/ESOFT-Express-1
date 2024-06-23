const express  = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers')

router.get('/users/', controllers.getAllUsers);
router.get('/users/sorted/', controllers.getUsersSorted);
router.get('/users/:id/', controllers.getUser);
router.post('/users/', controllers.addNewUser);
router.put('/users/:id/', controllers.updateUserInfoById);
router.delete('/users/:id/', controllers.deleteUserById);

router.get('/users/age/:age/', controllers.getUsersOlderThenGiven);
router.get('/users/domain/:domain/', controllers.getUsersByEmailDomain);

module.exports = router;