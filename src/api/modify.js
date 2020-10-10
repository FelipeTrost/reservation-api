const express = require('express');

const TimeSlot = require('../models/TimeSlot');
const Table = require('../models/Table');

const auth_middleware = require('./auth_middleware');

const router = express.Router();
router.use(auth_middleware);

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
    const { tableId } = req.body;
    try {
        const table = await Table.findById(tableId);

        if(!table)
            throw new Error("No table found with the given id");

        res.json({
            success: true,
            table
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

router.get('/timeslot', async (req, res) => {
    const { timeslotId } = req.body;
    try {
        const timeslot = await TimeSlot.findById(timeslotId);

        if(!timeslot)
            throw new Error("No Timeslot found with the given id");

        res.json({
            success: true,
            timeslot
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


module.exports = router;
