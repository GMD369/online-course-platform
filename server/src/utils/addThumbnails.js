import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

const INSTRUCTOR_EMAIL = 'ghulammohiyudin11@gmail.com';

async function addThumbnails() {
  await connectDB();

  const instructor = await User.findOne({ email: INSTRUCTOR_EMAIL });
  if (!instructor) {
    console.log('Instructor not found.');
    process.exit(1);
  }

  const courses = await Course.find({ instructor: instructor._id, thumbnail: '' });
  console.log(`Found ${courses.length} course(s) without a thumbnail.`);

  for (const course of courses) {
    const slug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    course.thumbnail = `https://picsum.photos/seed/${slug}/640/360`;
    await course.save();
  }

  console.log(`Updated ${courses.length} course(s) with thumbnails.`);
  await mongoose.connection.close();
  process.exit(0);
}

addThumbnails().catch((err) => {
  console.error(err);
  process.exit(1);
});
