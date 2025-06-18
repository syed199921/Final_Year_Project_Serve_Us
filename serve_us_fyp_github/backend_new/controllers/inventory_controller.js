const InventoryItem = require('../models/inventory_model');

const Technician = require('../models/technician_model'); // Import Technician model

// Add a new inventory item for a specific technician
const addInventoryItem = async (req, res) => {
    const { technicianId, name, description, category, quantity, low_stock_threshold } = req.body;

    try {
        // Check if the technician exists
        const technician = await Technician.findById(technicianId).populate('inventory');
        if (!technician) {
            return res.status(404).json({ message: "Technician not found" });
        }

        // Create a new inventory item
        const newItem = new InventoryItem({
            name,
            description,
            category,
            quantity,
            low_stock_threshold,
        });

        // Save the inventory item
        await newItem.save();

        // Add the inventory item to the technician's inventory
        technician.inventory.push(newItem._id);
        await technician.save();

        // Populate the updated inventory list
        const updatedTechnician = await Technician.findById(technicianId).populate('inventory');

        return res.status(201).json({
            message: "Inventory item added successfully",
            inventory: updatedTechnician.inventory, // Return the full inventory details
        });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Update inventory item
const updateInventoryItem = async (req, res) => {
    const { technicianId, itemId, name, description, category, quantity, low_stock_threshold } = req.body;
    console.log(req.body);
    try {
        // Check if the technician exists
        const technician = await Technician.findById(technicianId).populate('inventory');
        if (!technician) {
            return res.status(404).json({ message: "Technician not found" });
        }

        

        // // Find the inventory item
        const item = technician.inventory.find((item) =>item._id.toString() === itemId);
        if (!item) {
            return res.status(404).json({ message: "Inventory item not found" });
        }

    

        console.log(item);
        // Update the inventory item fields
        item.name = name;
        item.description = description;
        item.category = category;
        item.quantity = quantity;
        item.low_stock_threshold = low_stock_threshold;
        await item.save();

        console.log(item);

        // Return the updated inventory
        const updatedTechnician = await Technician.findById(technicianId).populate('inventory');
        return res.status(200).json({
            message: "Inventory item updated successfully",
            inventory: updatedTechnician.inventory,
        });
    } catch (error) {
        return res.status(500).json({ error: "Request rejected!" });
    }
};


// View all inventory items for a specific technician
const viewInventory = async (req, res) => {
    const { technicianId } = req.body;

    try {
        // Find the technician and populate their inventory
        const technician = await Technician.findById(technicianId).populate('inventory');
        if (!technician) {
            return res.status(404).json({ message: "Technician not found" });
        }

        return res.status(200).json({ inventory: technician.inventory });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Remove an inventory item
const removeInventoryItem = async (req, res) => {
    const { technicianId, itemId } = req.body;

    try {
        // Check if the technician exists
        const technician = await Technician.findById(technicianId).populate('inventory');
        if (!technician) {
            return res.status(404).json({ message: "Technician not found" });
        }

        // Find the inventory item
        const itemIndex = technician.inventory.findIndex((invItem) => invItem._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Inventory item not found" });
        }

        // Remove the item from the technician's inventory
        const [removedItem] = technician.inventory.splice(itemIndex, 1);
        await technician.save();

        // Remove the item from the InventoryItem collection
        await InventoryItem.findByIdAndDelete(itemId);

        // Return the updated inventory
        const updatedTechnician = await Technician.findById(technicianId).populate('inventory');
        return res.status(200).json({
            message: "Inventory item removed successfully",
            inventory: updatedTechnician.inventory,
        });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};

// Check low-stock items for a specific technician
const checkLowStock = async (req, res) => {
    const { technicianId } = req.body;

    try {
        // Find the technician and populate their inventory
        const technician = await Technician.findById(technicianId).populate('inventory');
        if (!technician) {
            return res.status(404).json({ message: "Technician not found" });
        }

        // Filter low-stock items
        const lowStockItems = technician.inventory.filter(
            (item) => item.quantity < item.low_stock_threshold
        );

        return res.status(200).json({ lowStockItems });
    } catch (error) {
        return res.status(500).json({ error: error.toString() });
    }
};


module.exports = {
    addInventoryItem,
    removeInventoryItem,
    updateInventoryItem,
    viewInventory,
    checkLowStock,
};