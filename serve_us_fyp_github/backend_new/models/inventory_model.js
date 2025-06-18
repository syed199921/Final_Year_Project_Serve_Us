const mongoose = require('mongoose');


const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        enum: ['Tool', 'Spare Part'],
    },
    quantity: {
        type: Number,
    
    },
    low_stock_threshold: {
        type: Number,

    },
});

// Export the model
module.exports = mongoose.model('InventoryItem', inventorySchema);