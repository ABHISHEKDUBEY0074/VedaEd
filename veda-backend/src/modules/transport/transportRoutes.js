const express = require('express');
const router = express.Router();
const transportController = require('./transportControllers');

// Vehicles
router.get('/vehicles', transportController.getVehicles);
router.post('/vehicles', transportController.createVehicle);
router.put('/vehicles/:id', transportController.updateVehicle);
router.delete('/vehicles/:id', transportController.deleteVehicle);

// Routes
router.get('/routes', transportController.getRoutes);
router.post('/routes', transportController.createRoute);
router.put('/routes/:id', transportController.updateRoute);
router.delete('/routes/:id', transportController.deleteRoute);

// Pickup Points
router.get('/pickup-points', transportController.getPickupPoints);
router.post('/pickup-points', transportController.createPickupPoint);
router.put('/pickup-points/:id', transportController.updatePickupPoint);
router.delete('/pickup-points/:id', transportController.deletePickupPoint);

// Assignments
router.get('/assignments', transportController.getAssignments);
router.post('/assignments', transportController.createAssignment);
router.put('/assignments/:id', transportController.updateAssignment);
router.delete('/assignments/:id', transportController.deleteAssignment);

// Route Stops
router.get('/route-stops', transportController.getRouteStops);
router.post('/route-stops', transportController.createRouteStop);
router.delete('/route-stops/:id', transportController.deleteRouteStop);

module.exports = router;
