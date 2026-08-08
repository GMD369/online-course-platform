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

// A relevant free YouTube tutorial for each topic, used as the lesson video link.
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

// A real, topic-relevant image for each course (Wikimedia Commons — freely licensed, stable hotlinks).
const THUMBNAILS = {
  'JavaScript Essentials': 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Html-source-code.png',
  'Advanced React Patterns': 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
  'Node.js API Development': 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg',
  'Python for Data Analysis': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Colored_neural_network.svg',
  'Machine Learning Basics': 'https://upload.wikimedia.org/wikipedia/commons/9/99/Neural_network_example.svg',
  'Flutter App Development': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Flutter_logo.svg',
  'iOS Development with Swift': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Swift_logo.svg',
  'Android with Kotlin': 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Android_Studio_Medium_Phone_emulator.png',
  'UI/UX Design Principles': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Penpot_interface.webp',
  'Figma for Product Design': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
  'Business Strategy 101': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Heading_to_business_meeting_(7645640942).jpg',
  'Financial Accounting Basics': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Analyzing_Financial_Data_(5099605109).jpg',
  'Digital Marketing Mastery': 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Social_Media_Marketing_Mix_(28208489145).jpg',
  'SEO & Content Marketing': 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Content-marketing-cycle.jpg',
  'Portrait Photography': 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Joey_L_Photographer_Self_Portrait.jpg',
  'Landscape Photography': 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Cloudy_mountain_scenery_(Unsplash).jpg',
  'Music Theory Fundamentals': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Sheet_music_and_Gongche_notation_of_Gong_Jinou.jpg',
  'Guitar for Beginners': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Acoustic_guitar_parts.png',
  'Cloud Computing with AWS': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
  'DevOps & CI/CD Pipelines': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Continuous_Delivery_process_diagram.svg',
  'Docker & Kubernetes': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_(container_engine)_logo.svg',
  'SQL & Database Design': 'https://upload.wikimedia.org/wikipedia/commons/b/b7/SQL_Server.svg',
  'Cybersecurity Fundamentals': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Cybersecurity.png',
  'Ethical Hacking Basics': 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Anonymous_Hacker.png',
  'Data Structures & Algorithms': 'https://upload.wikimedia.org/wikipedia/commons/d/da/Binary_search_tree.svg',
  'System Design Interview Prep': 'https://upload.wikimedia.org/wikipedia/commons/0/05/Devops-toolchain.svg',
  'Project Management Essentials': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Gantt-chart.png',
  'Public Speaking Skills': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Speaking_To_An_Empty_Audience_-_Public_Speaking.jpg',
  'Entrepreneurship Basics': "https://upload.wikimedia.org/wikipedia/commons/8/83/Entrepreneurs'_Organization.jpg",
  'Graphic Design with Illustrator': 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg',
};

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
  const courses = TOPICS.map((topic, i) => {
    return {
      title: topic,
      description: `A comprehensive course covering ${topic.toLowerCase()}, with hands-on lessons and real-world projects.`,
      category: CATEGORIES[i % CATEGORIES.length],
      level: LEVELS[i % LEVELS.length],
      price: [0, 19.99, 29.99, 39.99, 49.99, 59.99][i % 6],
      thumbnail: THUMBNAILS[topic] || '',
      instructor: instructor._id,
      published: true,
      rating: Number((4 + (i % 10) / 10).toFixed(1)),
      lessons: [
        {
          title: `Introduction to ${topic}`,
          content: `Overview and goals of ${topic}.`,
          videoUrl: VIDEO_URLS[topic] || '',
          duration: 20 + (i % 5) * 5,
          order: 0,
        },
        {
          title: `Core Concepts of ${topic}`,
          content: `Deep dive into the core concepts behind ${topic}.`,
          videoUrl: VIDEO_URLS[topic] || '',
          duration: 30 + (i % 5) * 5,
          order: 1,
        },
      ],
    };
  });

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
