const { Vehicle, Route, PickupPoint, VehicleAssignment, RouteStop } = require('./transportModels');

// ... (previous code)

// Route Stops (Mapping Routes to Pickup Points)
exports.getRouteStops = async (req, res) => {
    try {
        const stops = await RouteStop.find()
            .populate('route')
            .populate('stop');
        res.status(200).json(stops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createRouteStop = async (req, res) => {
    try {
        const stop = new RouteStop(req.body);
        await stop.save();
        res.status(201).json(stop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteRouteStop = async (req, res) => {
    try {
        await RouteStop.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Route stop removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Vehicles
exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createVehicle = async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Routes
exports.getRoutes = async (req, res) => {
    try {
        const routes = await Route.find();
        res.status(200).json(routes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createRoute = async (req, res) => {
    try {
        const route = new Route(req.body);
        await route.save();
        res.status(201).json(route);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateRoute = async (req, res) => {
    try {
        const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(route);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteRoute = async (req, res) => {
    try {
        await Route.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Route deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Pickup Points
exports.getPickupPoints = async (req, res) => {
    try {
        const points = await PickupPoint.find();
        res.status(200).json(points);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPickupPoint = async (req, res) => {
    try {
        const point = new PickupPoint(req.body);
        await point.save();
        res.status(201).json(point);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updatePickupPoint = async (req, res) => {
    try {
        const point = await PickupPoint.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(point);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePickupPoint = async (req, res) => {
    try {
        await PickupPoint.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Pickup point deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Vehicle Assignments
exports.getAssignments = async (req, res) => {
    try {
        const assignments = await VehicleAssignment.find();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createAssignment = async (req, res) => {
    try {
        const assignment = new VehicleAssignment(req.body);
        await assignment.save();
        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateAssignment = async (req, res) => {
    try {
        const assignment = await VehicleAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteAssignment = async (req, res) => {
    try {
        await VehicleAssignment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Assignment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
