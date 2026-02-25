const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicleNumber: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    year: { type: String },
    registration: { type: String },
    chasis: { type: String },
    capacity: { type: String },
    driverName: { type: String },
    licence: { type: String },
    contact: { type: String },
    note: { type: String },
    photo: { type: String }
}, { timestamps: true });

const routeSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }
}, { timestamps: true });

const pickupPointSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    time: { type: String, required: true },
    type: { type: String, enum: ['Morning', 'Afternoon', 'Both'], default: 'Morning' }
}, { timestamps: true });

const vehicleAssignmentSchema = new mongoose.Schema({
    route: { type: String, required: true },
    vehicles: [{ type: String }]
}, { timestamps: true });

const routeStopSchema = new mongoose.Schema({
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportRoute', required: true },
    stop: { type: mongoose.Schema.Types.ObjectId, ref: 'PickupPoint', required: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = {
    Vehicle: mongoose.model('Vehicle', vehicleSchema),
    Route: mongoose.model('TransportRoute', routeSchema),
    PickupPoint: mongoose.model('PickupPoint', pickupPointSchema),
    VehicleAssignment: mongoose.model('VehicleAssignment', vehicleAssignmentSchema),
    RouteStop: mongoose.model('RouteStop', routeStopSchema)
};
