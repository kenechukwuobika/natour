const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');
const Booking = require('../../models/bookingModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/export-tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/export-users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/export-reviews.json`, 'utf-8'));
const bookings = JSON.parse(fs.readFileSync(`${__dirname}/export-bookings.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = catchAsync(async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    await Booking.create(bookings);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
});

// DELETE ALL DATA FROM DB
const deleteData = catchAsync(async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    await Booking.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
});

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
