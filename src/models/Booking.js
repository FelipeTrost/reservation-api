var mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const BookingSchema = new mongoose.Schema({
	tables: {
		type: [{type: ObjectId, ref: 'Table'}],
		required: [true, "can't be blank"]
	},
	noOfPersons: {
		type: Number,
		required: [true, "can't be blank"],
	},
	year: {
		type: Number,
		required: [true, "can't be blank"],
	},
	month:{
		type: Number,
		required: [true, "can't be blank"],
	},
	day:{
		type: Number,
		required: [true, "can't be blank"],
	},
	time: {
		type: String,
		required: [true, "can't be blank"],
	},
	timeslot: {
		type: ObjectId, 
		ref: 'TimeSlot',
		required: [true, "can't be blank"]
    },
    timeslotLiteral: {
		type: String,
		required: [true, "can't be blank"]
	},
	email: {
		type: String,
		required: [true, "can't be blank"]
	},
	bookingStatus: {
		type: String,
		enum: ['pending', 'confirmed', 'canceled'],
		default: 'pending'
	},

});



var Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
