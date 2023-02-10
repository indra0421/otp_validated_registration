const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,

    },
    company: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        required: true
    },
    entry:{
        type: Date,

    },
    mobile: {
        type: Number,
        unique: true,
        // validate: {
        //     validator: function (v) {
        //         return /^\d{2}\d{10}$/.test(v);
        //     },
        //     message: props => `${props.value} is not a valid phone number!`
        // },
        required: [true, 'User phone number required']
},
    


})

module.exports = new mongoose.model("Register", employeeSchema);