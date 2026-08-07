import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

const INSTRUCTOR_EMAIL = 'ghulammohiyudin11@gmail.com';
const INSTRUCTOR_PASSWORD = '12345678gmd';
const INSTRUCTOR_NAME = 'Ghulam Mohiyudin';

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Design',
  'Business',
  'Marketing',
  'Photography',
  'Music',
  'Other',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const TOPICS = [
  'JavaScript Essentials',
  'Advanced React Patterns',
  'Node.js API Development',
  'Python for Data Analysis',
  'Machine Learning Basics',
  'Flutter App Development',
  'iOS Development with Swift',
  'Android with Kotlin',
  'UI/UX Design Principles',
  'Figma for Product Design',
  'Business Strategy 101',
  'Financial Accounting Basics',
  'Digital Marketing Mastery',
  'SEO & Content Marketing',
  'Portrait Photography',
  'Landscape Photography',
  'Music Theory Fundamentals',
  'Guitar for Beginners',
  'Cloud Computing with AWS',
  'DevOps & CI/CD Pipelines',
  'Docker & Kubernetes',
  'SQL & Database Design',
  'Cybersecurity Fundamentals',
  'Ethical Hacking Basics',
  'Data Structures & Algorithms',
  'System Design Interview Prep',
  'Project Management Essentials',
  'Public Speaking Skills',
  'Entrepreneurship Basics',
  'Graphic Design with Illustrator',
];

async function seedInstructorCourses() {
  await connectDB();

  console.log('Ensuring instructor account...');
  let instructor = await User.findOne({ email: INSTRUCTOR_EMAIL });
  if (!instructor) {
    instructor = await User.create({
      name: INSTRUCTOR_NAME,
      email: INSTRUCTOR_EMAIL,
      password: INSTRUCTOR_PASSWORD,
      role: 'instructor',
      bio: 'Instructor account seeded with course catalog.',
    });
    console.log(`Created instructor: ${instructor.email}`);
  } else {
    instructor.role = 'instructor';
    await instructor.save();
    console.log(`Reusing existing instructor: ${instructor.email}`);
  }

  console.log('Creating 30 courses...');
  const courses = TOPICS.map((topic, i) => ({
    title: topic,
    description: `A comprehensive course covering ${topic.toLowerCase()}, with hands-on lessons and real-world projects.`,
    category: CATEGORIES[i % CATEGORIES.length],
    level: LEVELS[i % LEVELS.length],
    price: [0, 19.99, 29.99, 39.99, 49.99, 59.99][i % 6],
    instructor: instructor._id,
    published: true,
    rating: Number((4 + (i % 10) / 10).toFixed(1)),
    lessons: [
      {
        title: `Introduction to ${topic}`,
        content: `Overview and goals of ${topic}.`,
        duration: 20 + (i % 5) * 5,
        order: 0,
      },
      {
        title: `Core Concepts of ${topic}`,
        content: `Deep dive into the core concepts behind ${topic}.`,
        duration: 30 + (i % 5) * 5,
        order: 1,
      },
    ],
  }));

  const created = await Course.insertMany(courses);
  console.log(`Created ${created.length} courses for instructor ${instructor.email}.`);

  console.log('\nSeed complete!');
  console.log('----------------------------------------');
  console.log(`Instructor login: ${INSTRUCTOR_EMAIL} / ${INSTRUCTOR_PASSWORD}`);
  console.log('----------------------------------------');

  await mongoose.connection.close();
  process.exit(0);
}

seedInstructorCourses().catch((err) => {
  console.error(err);
  process.exit(1);
});
