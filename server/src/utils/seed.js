import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import mongoose from 'mongoose';

async function seed() {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([User.deleteMany({}), Course.deleteMany({}), Enrollment.deleteMany({})]);

  console.log('Creating users...');
  const admin = await User.create({
    name: 'Alex Admin',
    email: 'admin@example.com',
    password: 'Admin1234',
    role: 'admin',
  });

  const instructor = await User.create({
    name: 'Priya Instructor',
    email: 'instructor@example.com',
    password: 'Instructor1234',
    role: 'instructor',
    bio: 'Full-stack developer and educator with 8 years of teaching experience.',
  });

  const instructor2 = await User.create({
    name: 'Sam Mentor',
    email: 'mentor@example.com',
    password: 'Mentor1234',
    role: 'instructor',
    bio: 'Data scientist and career mentor.',
  });

  const student = await User.create({
    name: 'Jordan Student',
    email: 'student@example.com',
    password: 'Student1234',
    role: 'student',
  });

  console.log('Creating courses...');
  const courses = await Course.create([
    {
      title: 'Complete Web Development Bootcamp',
      description:
        'Learn HTML, CSS, JavaScript, React, and Node.js from scratch and build real-world projects.',
      category: 'Web Development',
      level: 'Beginner',
      price: 49.99,
      instructor: instructor._id,
      published: true,
      enrollmentCount: 0,
      rating: 4.7,
      lessons: [
        { title: 'Introduction to HTML', content: 'Basics of HTML structure and tags.', duration: 25, order: 0 },
        { title: 'Styling with CSS', content: 'Selectors, layout, and flexbox.', duration: 40, order: 1 },
        { title: 'JavaScript Fundamentals', content: 'Variables, functions, and DOM.', duration: 55, order: 2 },
      ],
    },
    {
      title: 'React for Beginners',
      description: 'A hands-on guide to building modern user interfaces with React.',
      category: 'Web Development',
      level: 'Intermediate',
      price: 39.99,
      instructor: instructor._id,
      published: true,
      rating: 4.5,
      lessons: [
        { title: 'Components & Props', content: 'Building reusable components.', duration: 30, order: 0 },
        { title: 'State & Hooks', content: 'useState, useEffect and custom hooks.', duration: 45, order: 1 },
      ],
    },
    {
      title: 'Data Science with Python',
      description: 'Master data analysis, visualization, and machine learning fundamentals using Python.',
      category: 'Data Science',
      level: 'Intermediate',
      price: 59.99,
      instructor: instructor2._id,
      published: true,
      rating: 4.8,
      lessons: [
        { title: 'NumPy & Pandas', content: 'Working with arrays and dataframes.', duration: 50, order: 0 },
        { title: 'Data Visualization', content: 'Matplotlib and Seaborn.', duration: 35, order: 1 },
      ],
    },
    {
      title: 'Digital Marketing Essentials',
      description: 'Learn SEO, social media marketing, and paid advertising strategies for growing a business.',
      category: 'Marketing',
      level: 'Beginner',
      price: 0,
      instructor: instructor2._id,
      published: true,
      rating: 4.2,
      lessons: [{ title: 'Introduction to SEO', content: 'How search engines rank content.', duration: 20, order: 0 }],
    },
    {
      title: 'UI/UX Design Fundamentals',
      description: 'Design beautiful, user-friendly interfaces using modern design principles and Figma.',
      category: 'Design',
      level: 'Beginner',
      price: 29.99,
      instructor: instructor._id,
      published: true,
      rating: 4.6,
      lessons: [{ title: 'Design Principles', content: 'Color, typography, and spacing.', duration: 30, order: 0 }],
    },
    {
      title: 'Advanced Node.js & Express (Draft)',
      description: 'Deep dive into building scalable backend systems with Node.js.',
      category: 'Web Development',
      level: 'Advanced',
      price: 69.99,
      instructor: instructor._id,
      published: false,
      lessons: [],
    },
  ]);

  console.log('Enrolling sample student...');
  const enrollment = await Enrollment.create({
    student: student._id,
    course: courses[0]._id,
    progress: 33,
    completedLessons: [courses[0].lessons[0]._id],
    paymentStatus: 'paid',
    amountPaid: courses[0].price,
    paymentReference: 'MOCK-SEEDDATA-0001',
  });
  courses[0].enrollmentCount += 1;
  await courses[0].save();

  console.log('\nSeed complete!');
  console.log('----------------------------------------');
  console.log('Admin login:      admin@example.com / Admin1234');
  console.log('Instructor login: instructor@example.com / Instructor1234');
  console.log('Instructor login: mentor@example.com / Mentor1234');
  console.log('Student login:    student@example.com / Student1234');
  console.log('----------------------------------------');

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
