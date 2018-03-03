const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wordSchema = Schema(
    {
        word:String
    }
);

module.exports = mongoose.model('Word', wordSchema);
