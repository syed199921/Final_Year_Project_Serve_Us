const express = require('express');
const router = express.Router();
const {
    addInventoryItem,
    updateInventoryItem,
    removeInventoryItem,
    viewInventory,
    checkLowStock,
} = require('../controllers/inventory_controller');

// Add a new inventory item
router.post('/add_item', addInventoryItem);

// Update inventory item
router.post('/update_item', updateInventoryItem);

// View all inventory items
router.post('/view_items', viewInventory);

// Remove an inventory item
router.post('/remove_item', removeInventoryItem);

// Check low-stock items
router.post('/check-low-stock', checkLowStock);

module.exports = router;