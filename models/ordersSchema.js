const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: { type: String},
    url: { type: String },
    title: { type: Object },
    price: { type: Object },
    quantity: { type: String },
    user :{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

const order = mongoose.model('orders', orderSchema);
module.exports = order;
