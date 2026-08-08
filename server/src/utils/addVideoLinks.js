import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Course from '../models/Course.js';

const INSTRUCTOR_EMAIL = 'ghulammohiyudin11@gmail.com';

const VIDEO_URLS = {
  'JavaScript Essentials': 'https://www.youtube.com/watch?v=nu_pCVPKzTk',
  'Advanced React Patterns': 'https://www.youtube.com/watch?v=rCCDnDXPr5M',
  'Node.js API Development': 'https://www.youtube.com/watch?v=d2Z40twFohc',
  'Python for Data Analysis': 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
  'Machine Learning Basics': 'https://www.youtube.com/watch?v=JDcZBzb46ts',
  'Flutter App Development': 'https://www.youtube.com/watch?v=GLSG_Wh_YWc',
  'iOS Development with Swift': 'https://www.youtube.com/watch?v=6wJDIE2yjHY',
  'Android with Kotlin': 'https://www.youtube.com/watch?v=pTJJsmejUOQ',
  'UI/UX Design Principles': 'https://www.youtube.com/watch?v=JGLfyTDgfDc',
  'Figma for Product Design': 'https://www.youtube.com/watch?v=P5epIoOJnzU',
  'Business Strategy 101': 'https://www.youtube.com/watch?v=NFroa8muTQI',
  'Financial Accounting Basics': 'https://www.youtube.com/watch?v=nDg7ZX-CvaY',
  'Digital Marketing Mastery': 'https://www.youtube.com/watch?v=mLe7qWYwRU4',
  'SEO & Content Marketing': 'https://www.youtube.com/watch?v=vFfV2E6jo6A',
  'Portrait Photography': 'https://www.youtube.com/watch?v=yhAmMUi2NmM',
  'Landscape Photography': 'https://www.youtube.com/watch?v=UXdb3rj5SnY',
  'Music Theory Fundamentals': 'https://www.youtube.com/watch?v=EYZk-WU1CYA',
  'Guitar for Beginners': 'https://www.youtube.com/watch?v=6V4SRq1SaMI',
  'Cloud Computing with AWS': 'https://www.youtube.com/watch?v=Tq0vZU7Hp_M',
  'DevOps & CI/CD Pipelines': 'https://www.youtube.com/watch?v=Tq0vZU7Hp_M',
  'Docker & Kubernetes': 'https://www.youtube.com/watch?v=jMWvUL5743M',
  'SQL & Database Design': 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
  'Cybersecurity Fundamentals': 'https://www.youtube.com/watch?v=hxXbvu9J5Pg',
  'Ethical Hacking Basics': 'https://www.youtube.com/watch?v=DykazjWRrAc',
  'Data Structures & Algorithms': 'https://www.youtube.com/watch?v=d2Z40twFohc',
  'System Design Interview Prep': 'https://www.youtube.com/watch?v=d2Z40twFohc',
  'Project Management Essentials': 'https://www.youtube.com/watch?v=NFroa8muTQI',
  'Public Speaking Skills': 'https://www.youtube.com/watch?v=xQuKdFNK7tk',
  'Entrepreneurship Basics': 'https://www.youtube.com/watch?v=9VlvbpXwLJs',
  'Graphic Design with Illustrator': 'https://www.youtube.com/watch?v=R--xoP7jGkw',
};

async function addVideoLinks() {
  await connectDB();

  const instructor = await User.findOne({ email: INSTRUCTOR_EMAIL });
  if (!instructor) {
    console.log('Instructor not found.');
    process.exit(1);
  }

  const courses = await Course.find({ instructor: instructor._id });
  console.log(`Found ${courses.length} course(s).`);

  let updated = 0;
  for (const course of courses) {
    const url = VIDEO_URLS[course.title];
    if (!url) continue;
    let changed = false;
    for (const lesson of course.lessons) {
      if (!lesson.videoUrl) {
        lesson.videoUrl = url;
        changed = true;
      }
    }
    if (changed) {
      await course.save();
      updated += 1;
    }
  }

  console.log(`Updated video links on ${updated} course(s).`);
  await mongoose.connection.close();
  process.exit(0);
}

addVideoLinks().catch((err) => {
  console.error(err);
  process.exit(1);
});
