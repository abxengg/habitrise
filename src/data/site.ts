// ---------------------------------------------------------------------------
// All editable site content lives here. Change copy, prices or links in this
// file and every section updates; no need to touch the components.
// ---------------------------------------------------------------------------

export const site = {
  name: 'HabitRise',
  title: 'HabitRise | Build the System — The 21-Day 6 AM Habit Challenge',
  description:
    "Build the habits that change your life. Join India's most disciplined morning accountability community and master the 6 AM routine in 21 days.",
  tagline: 'Build the system',
};

export const pricing = {
  price: 699,
  regular: 999,
  joinUrl: 'https://habitrise.in/join', // existing UPI registration flow
  includes: [
    '21 days of LIVE 6 AM sessions',
    'Exclusive HabitRise community on Skool',
    'Daily accountability tracking',
    'The S.A.V.E.R.S methodology framework',
    'Direct Q&A with the founder',
    'Lifetime access to session recordings',
    'Custom habit tracking templates',
  ],
};

export const contact = {
  email: 'manimitit@gmail.com',
  whatsapp: 'https://wa.me/918695866684',
};

export const socials = {
  linkedin: 'https://www.linkedin.com/in/manikandan-pmp',
  instagram: 'https://www.instagram.com/habitrise.in',
  youtube: 'https://youtube.com/@manikandanrs21',
  facebook: 'https://www.facebook.com/share/199ULRgvBw/',
};

export const nav = [
  { href: '/#program', label: 'The Program' },
  { href: '/#community', label: 'Community' },
  { href: '/#founder', label: 'Founder' },
  { href: '/#stories', label: 'Success Stories' },
  { href: '/#faq', label: 'FAQ' },
];

export const stats = [
  { value: 5000, decimals: 0, suffix: '+', label: 'Lives transformed' },
  { value: 4.9, decimals: 1, suffix: '/5', label: 'Average rating' },
  { value: 12, decimals: 0, suffix: '+', label: 'Years of leadership experience' },
  { value: 21, decimals: 0, suffix: '', label: 'Days to a new habit' },
];

export const audiences = [
  { icon: 'cap', title: 'Students', text: 'Build the discipline to ace exams and prepare for a high-performance career.' },
  { icon: 'briefcase', title: 'Professionals', text: 'Break through career plateaus by mastering your morning routine and focus.' },
  { icon: 'trend', title: 'Entrepreneurs', text: 'Develop the leadership habits required to scale your business and manage stress.' },
  { icon: 'compass', title: 'Career Builders', text: 'Transition into new roles with confidence, clarity and relentless consistency.' },
] as const;

export const beforeAfter = {
  before: [
    'Scrolling till 2 AM, waking up already behind',
    'Goals that restart every Monday',
    'Busy all day, intentional never',
    'Courses bought, never finished',
  ],
  after: [
    'Up at 6 AM — often before the alarm',
    'A clear purpose and a written plan',
    'Mornings that belong to you, not your inbox',
    'A community that notices when you show up',
  ],
};

export const savers = [
  { letter: 'S', title: 'Silence', text: 'Start before the world demands your attention. Sit still. Breathe. Your mind clears and your day begins with intention.' },
  { letter: 'A', title: 'Affirmations', text: 'Speak powerful statements about who you are becoming — present tense, with emotion. Repetition rewires the subconscious.' },
  { letter: 'V', title: 'Visualisation', text: 'Close your eyes. See your goal already achieved. Feel it. Your brain builds pathways toward what you repeatedly see.' },
  { letter: 'E', title: 'Exercise', text: 'Move your body before the day begins. Walk, stretch or train. Active body, active mind. Energy compounds daily.' },
  { letter: 'R', title: 'Reading', text: '10 pages a day is 12 books a year. Readers are leaders. Every page is an investment in your future self.' },
  { letter: 'S', title: 'Scribing', text: 'Write your wins, lessons and goals every day. Clarity comes from writing. Track your progress and watch yourself grow.' },
];

export const weeks = [
  {
    num: '01', days: 'Days 1–7', title: 'Foundation',
    text: 'Discover your purpose, own your life and design your future from the ground up.',
    lessons: ['Find your purpose — IKIGAI', 'Own your life 100%', 'Map your life (7 areas)', 'Bucket list creation', 'Vision board building', 'Affirmations system', 'Visualisation practice'],
  },
  {
    num: '02', days: 'Days 8–14', title: 'Build the System',
    text: 'Destroy fear, eliminate procrastination and install a daily power routine.',
    lessons: ['Conquer fear forever', 'Defeat procrastination', 'Declutter your life', 'Shift to positivity', 'No more excuses', 'The S.A.V.E.R.S morning routine', 'Full integration day'],
  },
  {
    num: '03', days: 'Days 15–21', title: 'Complete Transformation',
    text: 'Master focus, communication and uniqueness — and celebrate your new self.',
    lessons: ['Focus & deep work', 'Daily learning system', 'Failure as feedback', 'Communication mastery', 'Exercise & health', 'Own your uniqueness', 'The new you 🎉'],
  },
];

export const founder = {
  name: 'Manikandan Rajendran',
  role: 'Founder, HabitRise · Habit Coach · PMP-certified Delivery Lead',
  photo: '/img/founder-portrait.webp',
  quote: '“Leadership begins with self-mastery. The highest performers I\'ve met all share one thing: a non-negotiable morning.”',
  bio: [
    "I'm a Delivery Lead at Mindgate Solutions, a habit coach, career & personal counsellor, content creator and an active Toastmaster — with a B.E. in CSE, an M.E. in IT, and currently pursuing my PhD in Artificial Intelligence.",
    "Over the last 5+ years I've trained 5,000+ students across Tamil Nadu, mentored 15+ entrepreneurs, and built the HabitRise system — a 21-day program that turns confusion into clarity, procrastination into discipline, and existence into purpose.",
  ],
  credentials: ['PMP Certified', '12+ Years in IT', 'PhD Scholar · AI', 'Toastmaster', '15+ Entrepreneurs Mentored', 'Book Reader'],
  journey: [
    { title: 'Corporate Leadership', text: '10+ years managing high-stakes enterprise projects as a PMP-certified delivery lead.' },
    { title: 'The Awakening', text: 'Noticed the pattern behind every high performer — and discovered the power of the 6 AM routine.' },
    { title: 'The HabitRise Movement', text: 'A system, a community and 5,000+ lives transformed across India.' },
  ],
  // Long-form story for /about. TODO: have the client review and personalise.
  story: [
    { heading: 'The ladder', paras: [
      "I spent years climbing the corporate ladder, only to realise that true growth doesn't happen in the boardroom — it happens in the hours before the world wakes up.",
      "As a PMP-certified delivery lead with over a decade in IT, I've worked alongside some of the highest performers I know. Different roles, different backgrounds — but the same pattern: a relentless, non-negotiable morning.",
    ]},
    { heading: 'The awakening', paras: [
      "When I started guarding my own mornings — silence, affirmations, visualisation, exercise, reading and scribing before 7 AM — everything else got easier. My work sharpened. My studies moved forward. I finally had time for the things I kept saying mattered.",
      "I began sharing the routine with students and young professionals, first in classrooms and workshops, then online. The results were too consistent to ignore.",
    ]},
    { heading: 'The movement', paras: [
      "HabitRise wasn't created to be another coaching programme. It's a movement for people who are tired of restarting every Monday and ready to build a new identity.",
      "We don't just talk about goals. We wake up at 6 AM, together, every single day for 21 days — and we execute.",
    ]},
  ],
  coaching: [
    { title: 'Morning routines & discipline', text: 'Installing the S.A.V.E.R.S routine and making it stick past the first week.' },
    { title: 'Career & personal counselling', text: 'Clarity on direction for students, graduates and professionals switching tracks.' },
    { title: 'Entrepreneur mentoring', text: 'Focus, execution habits and accountability for founders — 15+ mentored so far.' },
    { title: 'Talks & workshops', text: 'Sessions for colleges and teams on habits, purpose and leadership.' },
  ],
  education: ['B.E. Computer Science & Engineering', 'M.E. Information Technology', 'PhD scholar · Artificial Intelligence (ongoing)', 'PMP® certification'],
};

// TODO before launch: confirm with the client that these are real members
// (copied from the current habitrise.in). Replace with verified stories.
export const testimonials = [
  { name: 'Praveen Kumar', role: 'Engineering Student · Coimbatore', color: '#121212', result: 'CGPA 6.8 → 8.4', quote: 'I used to scroll till 2 AM and wake up at noon. After 21 days with HabitRise, I wake at 6 AM without an alarm. My CGPA went from 6.8 to 8.4 in one semester.' },
  { name: 'Divya Ramesh', role: 'Software Professional · Chennai', color: '#b8741a', result: 'Daily 6 AM routine locked in', quote: 'The accountability is what changed everything. Knowing the group was showing up at 6 AM made me show up too. The SAVERS routine is now non-negotiable for me.' },
  { name: 'Arjun Nair', role: 'Early-Stage Founder · Bangalore', color: '#5c4a3a', result: 'Reclaimed mornings for deep work', quote: 'As a founder I thought I had discipline. HabitRise showed me the difference between being busy and being intentional. My mornings now belong to me, not my inbox.' },
  { name: 'Sneha Patel', role: 'School Teacher · Madurai', color: '#8a5a1f', result: 'Launched a long-delayed project', quote: 'I was stuck in procrastination for years. The visualisation and scribing habits gave me clarity I had never felt. I finally started the side project I kept postponing.' },
  { name: 'Karthik Subramanian', role: 'Final-Year Student · Trichy', color: '#3a3a3a', result: 'Completed all 21 days', quote: 'The community kept me going on days I wanted to quit. By day 21 the habits felt automatic. This is the most practical self-improvement system I have tried.' },
  { name: 'Meera Iyer', role: 'Marketing Manager · Hyderabad', color: '#cf8a1f', result: 'First program ever finished', quote: 'I have bought many courses that I never finished. HabitRise is the first one where the daily live sessions actually made me complete it. Worth every rupee.' },
];

export const faqs = [
  { q: 'What time are the live sessions?', a: 'Every day at 6:00 AM IST for all 21 days. Starting before the world wakes up is the whole point.' },
  { q: 'Who can join?', a: 'Anyone aged 12 and above — students, working professionals, entrepreneurs and career switchers all go through the same system together.' },
  { q: 'How do I pay?', a: 'Payment is via UPI (GPay, PhonePe, Paytm or any UPI app). After paying, submit your UTR / transaction ID on the registration page. Payments are verified manually within 24 hours.' },
  { q: 'When do I get access to the community?', a: "Once your payment is verified you'll receive an email with your Skool community link within 24–48 hours." },
  { q: 'What is S.A.V.E.R.S?', a: "Six morning habits — Silence, Affirmations, Visualisation, Exercise, Reading and Scribing. You'll learn each one during the program and install the full routine by Day 13." },
];

export const initials = (name: string) =>
  name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
