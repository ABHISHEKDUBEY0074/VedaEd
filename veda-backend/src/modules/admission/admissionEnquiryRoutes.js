const express = require('express');
const router = express.Router();
const admissionEnquiryController = require('./admissionEnquiryController');

router.post('/', admissionEnquiryController.createEnquiry);
router.get('/', admissionEnquiryController.getEnquiries);
router.put('/:id', admissionEnquiryController.updateEnquiry);
router.delete('/:id', admissionEnquiryController.deleteEnquiry);

module.exports = router;
