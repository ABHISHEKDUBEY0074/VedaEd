const express = require('express');
const router = express.Router();
const visitorBookController = require('./visitorBookController');

router.post('/', visitorBookController.createVisitor);
router.get('/', visitorBookController.getVisitors);
router.put('/:id', visitorBookController.updateVisitor);
router.delete('/:id', visitorBookController.deleteVisitor);

module.exports = router;
