const express = require('express');
const TimeSlot = require('../models/TimeSlot');
const Table = require('../models/Table');
const Booking = require('../models/Booking');

const router = express.Router();

// nOpersons, date, timeSlot, email
router.post('/', async (req, res) => {
  try {
    const {nOpersons, date, timeSlotId, email, check} = req.body;

    // -------------------------
    //  VALIDATE INPUT
    if(!nOpersons || !date || !timeSlotId || (!email && !check))
      throw new Error("Invalid request");

    const timeSlot = await TimeSlot.findById(timeSlotId);
    if(!timeSlot)
      throw new Error("No time slot found");

    if(nOpersons <= 0)
      throw new Error("Invalid number of persons");

    const {year, month, day, time} = date;

    // Year, month, day
    const checkDate = new Date(year, month, day);
    if(checkDate.getFullYear() != year || checkDate.getMonth() != month || checkDate.getDate() != day)
      throw new Error("Bad date");

    // time in format 1800 (18:00)
    const timeString = time.toString();
    const hour = parseInt(timeString.substr(0,2));
    const minutes = parseInt(timeString.substr(2));
    console.log(hour, minutes, timeString);
    // Check for valid time
    if(
      timeString.length != 4 ||
      hour < 0 || hour >= 24 || minutes < 0 || minutes >= 60 
      )
      throw new Error("Invalid Time");
    
    if(parseInt(timeString) < timeSlot.start || parseInt(timeString) > timeSlot.end)
      throw new Error("Time out of range");
      
    // -------------------------------
    // FIND AVAILABLE TABLES
    
    // Find tables that are booked the same day in the same timeSlot
    const occupiedTables = await Booking.find({
      year,
      month,
      day,
      timeslot: timeSlotId
    })

    let occupiedTableIds = occupiedTables.map(booking => booking.tables );
    occupiedTableIds = occupiedTableIds.flat()
    
    // find all tables that aren't booked
    const possibleTables = await Table.find({ 
      _id: {$nin: occupiedTableIds},
      available: true
    })

    // selecting tables
    let selectedTables = [];
    let peopleLeft = nOpersons;

    // First we see if we can sit them in one table
    for (const table of possibleTables) {
      if(table.capacity >= nOpersons){
        selectedTables.push(table._id)
        peopleLeft = 0
      }
    }

    // Combinations of tables
    let index = 0;
    while(peopleLeft > 0 && index < possibleTables.length){
      const table = possibleTables[index]
      
      if(table.combinable){
        selectedTables.push(table._id);
        peopleLeft -= table.capacity
      }

      index++
    }

    if(selectedTables.length == 0 || peopleLeft > 0)
      // Instead of throwing we just respond here
      // throw new Error("No availability for this combination");
      return res.json({
        success: false,
        booked: false,
        available: false
      })

    //Save booking only if we aren't checking
    if(!check){
      const booking = new Booking();
      booking.tables = selectedTables;
      booking.noOfPersons = nOpersons;
      booking.year = year;
      booking.month = month;
      booking.day = day;
      booking.time = timeString;
      booking.timeslot = timeSlot._id;
      booking.timeslotLiteral = `${timeSlot.start.toString()}-${timeSlot.end.toString()}`
      booking.email = email;
      
      await booking.save();
    }

    res.json({
      success: true,
      booked: check == false,
      available: true
    })
  } catch (error) {
    console.error(error)
    res.json({
      success: false,
      booked: false,
    })
  }
})

module.exports = router;
