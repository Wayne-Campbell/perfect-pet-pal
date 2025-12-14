const mongoose = require("mongoose");

const dogsSchema = new mongoose.Schema({
    id: {       //required for getting details of specific dog breed from API
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    life_span: {
        type: String,
        required: true,
    },
    temperament: {
        type: String,
        required: true,
    }
});

const Dog = mongoose.model("Dog", dogsSchema);
module.exports = Dog;