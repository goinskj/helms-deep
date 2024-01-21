// Require the Mongoose package
const mongoose = require('mongoose')
const playSchema = require('./play.js')


// Create a schema to define the properties of the teams collection
const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mascott: { type: String, required: true },
    photo: { type: String },
    city: { type: String, required: true },
    state: { type: String, maxLength: 2, required: true },
    isFeatured: { type: Boolean, default: false },
    dateAdded: { type: Date, default: Date.now },
    // the play array can only accept objects that match the criteria specified
    // in the playSchema. In other words, the play array can only accept plays
	plays: [playSchema]
});

// Export the schema as a Monogoose model. 
// The Mongoose model will be accessed in `models/index.js`
module.exports = mongoose.model('Team', teamSchema)