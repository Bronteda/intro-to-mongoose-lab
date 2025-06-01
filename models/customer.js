//mongoose package
const mongoose = require('mongoose');

//define the schema
const customerSchema = new mongoose.Schema({
    name:String,
    age:Number,
});

//compile the model
const Customer = mongoose.model('Customer', customerSchema);

//export to other files to be able to use schema
module.exports = Customer;