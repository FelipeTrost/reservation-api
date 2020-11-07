const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "can't be blank"]
	},
	username: {
		type: String,
		required: [true, "can't be blank"]
	},
	password: {
		type: String,
		required: [true, "can't be blank"],
	},
	refreshTokenVersion: {
		type: Number,
		default: 0
	}
});



var User = mongoose.model('User', UserSchema);

module.exports = User;
