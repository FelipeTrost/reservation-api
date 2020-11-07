const express = require('express');

const TimeSlot = require('../models/TimeSlot');
const Table = require('../models/Table');

const auth_middleware = require('./auth_middleware');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

const router = express.Router();

// PUBLIC ENDPOINTS

router.get('/timeslot', async (req, res) => {
    const { timeslotId } = req.query;
    try {
        let response;

        if(timeslotId)
            response = await TimeSlot.findById(timeslotId);
        else
            response = await TimeSlot.find();

        if(!response)
            throw new Error("No Timeslot found with the given id");

        res.json({
            success: true,
            response 
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false
        });
    }
});

// Setting up auth
// router.use(auth_middleware);

// TABLES

router.post('/table', async (req, res) => {
    const { tableIdentifier, combinable, available, capacity, description } = req.body;
    try {
        if(!tableIdentifier || !combinable || !capacity)
            throw new Error("Invalid data");

        const table = new Table();

        table.tableIdentifier = tableIdentifier;
        table.combinable = combinable;
        table.capacity = capacity;

        if(available) table.available = available
        if(description) table.description = description

        await table.save()

        res.json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false
        });
    }
});

router.put('/table', async (req, res) => {
    const { tableId, tableIdentifier, combinable, available, capacity, description } = req.body;
    try {
        const table = await Table.findById(tableId);

        if(!table)
            throw new Error("No table found with the given id");
        
        if(tableIdentifier) table.tableIdentifier = tableIdentifier;
        if(combinable) table.combinable = combinable;
        if(capacity) table.capacity = capacity;
        if(available) table.available = available
        if(description) table.description = description

        await table.save()

        res.json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false
        });
    }
});

router.get('/table', async (req, res) => {
    const { tableId } = req.query;
    try {
        let response;

        if(tableId)
            response = await Table.findById(tableId);
        else
            response = await Table.find();

        if(!response)
            throw new Error("No table found with the given id");

        res.json({
            success: true,
            response
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false
        });
    }
});

router.delete('/table', async (req, res) => {
    const { tableId } = req.body;
    try {
        const table = await Table.findById(tableId);

        if(!table)
            throw new Error("No table found with the given id");
        
        await table.deleteOne()

        res.json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false
        });
    }
});

// TIMESLOTS

router.post('/timeslot', async (req, res) => {
    const { start, end } = req.body;
    try {
        if(!start || !end)
            throw new Error("Invalid data");

        if(start >= end)
            throw new Error("Time range wrong");
        
        const timeslot = new TimeSlot();
        timeslot.start = start;
        timeslot.end = end;

        await timeslot.save()

        res.json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false
        });
    }
});

router.put('/timeslot', async (req, res) => {
    const { timeslotId, start, end } = req.body;
    try {
        if(!start || !end)
            throw new Error("Invalid data");

        if(start >= end)
            throw new Error("Time range wrong");

        const timeslot = await TimeSlot.findById(timeslotId);

        if(!timeslot)
            throw new Error("No Timeslot found with the given id");

        timeslot.start = start;
        timeslot.end = end;
        await timeslot.save()

        res.json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false
        });
    }
});


router.delete('/timeslot', async (req, res) => {
    const { timeslotId } = req.body;
    try {
        const timeslot = await TimeSlot.findById(timeslotId);

        if(!timeslot)
            throw new Error("No Timeslot found with the given id");

        await timeslot.deleteOne();

        res.json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false
        });
    }
});

// BOOKINGS

router.get('/booking', async (req, res) => {
    const { bookingId, year, month, day } = req.query;
    try {
        let response;
        console.log(bookingId);
        if(bookingId)
            response = await Booking.findById(bookingId).populate('tables').exec();
        else if (year && month && day)
            response = await Booking.find({
                year,
                month,
                day
            }).populate('tables').exec();
        else
            response = await Booking.find();

        if(!response)
            throw new Error("No Bookins found");

        res.json({
            success: true,
            response 
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false
        });
    }
});

router.get('/bookingcomplete', async (req, res) => {
    const { year, month, day } = req.query;

    
    try {
        const tables = await Table.find();
        const timeSlots = await TimeSlot.find();

        const populatedTables = []
        for(let table of tables){
            const bookings = await Booking.find({
                year,
                month,
                day,
                tables: {$all: [mongoose.Types.ObjectId(table.id)]}
            })
            .populate('timeslot')
            .exec();

            const sortedBookings = bookings.sort((bookingA, bookingB) => bookingA.timeslot.start - bookingB.timeslot.start);

            // Order the bookings into their respective timeslots
            const orderedBookings = bookings.reduce((acc, val) => {
                const timeSlotId = val.timeslot._id
                acc[timeSlotId] = val;

                return acc
            }, {})

            
            populatedTables.push({
                ...table._doc, 
                bookings: sortedBookings,
                orderedBookings
            });
        }

        res.json({
            success: true,
            response: {
                tables: populatedTables,
                timeSlots
            }
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false
        });
    }
});


module.exports = router;
