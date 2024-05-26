const mongoose = require('mongoose');
const Appointment = require('./models/appointment'); // Import your Mongoose model

// Define test data
const testData = [
  { time: 1, day: 'Monday', tutor: 'Tutor A', student: 'Student X', state: 'Scheduled' },
  { time: 2, day: 'Tuesday', tutor: 'Tutor B', student: 'Student Y', state: 'Cancelled' },
  // Add more test data as needed
];
const url = process.env.MONGODB_URI || "mongodb://localhost:27017"

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
    // Create a BulkWriteOp instance
  try{
    const bulkOp = Appointment.collection.initializeUnorderedBulkOp();

    // Add insert operations for test data
    testData.forEach(appointment => {
      bulkOp.insert(appointment);
    });
    
    // Execute bulk insert
    bulkOp.execute()
      .then(result => {
        console.log(`${result.nInserted} documents inserted successfully.`);
        mongoose.disconnect(); // Disconnect after bulk insert
      })
      .catch(error => {
        console.error('Error inserting documents:', error);
        mongoose.disconnect(); // Disconnect on error
      });
  } catch(e) {
    console.log(e)
  }

  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


