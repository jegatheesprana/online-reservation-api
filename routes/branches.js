const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

router.get('/', branchController.getBranches);
router.post('/', branchController.createBranch);
router.delete('/:id', branchController.deleteBranch);

module.exports = router;