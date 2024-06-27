import capy1 from '../public/capy1.avif';
import capy2 from '../public/capy2.jpeg';
import capy3 from '../public/capy3.jpeg';
import capy4 from '../public/capy4.jpg';
import capy5 from '../public/capy5.jpg';
import capy6 from '../public/capy6.jpg';
import capy7 from '../public/capy7.webp';
import capy8 from '../public/capy8.jpeg';
import capy9 from '../public/capy9.jpeg';

const images = [capy1, capy2, capy3, capy4, capy5, capy6, capy7, capy8, capy9];

const getRandomImage = () => {
  return images[Math.floor(Math.random() * images.length)];
};

const messages = [
  'Just chilling in the water, living my **best capybara life**.',
  "Munching on some *delicious grass*. It's the simple things, you know? #CapybaraBliss",
  'Hanging out with my capybara crew. __Squad goals!__',
  'Took a nice long nap in the sun today. *Zzz...*',
  'Feeling cute, might go for a swim later. #CapybaraCuteness 😊',
  'Just a capybara, standing in front of a human, asking for treats. 🥺 *Please?*',
  'Capybaras: the **chill masters** of the animal kingdom.',
  'Living that ~~fast-paced~~ slow-paced capybara lifestyle. No rush, no worries.',
  "Grass, water, and good vibes. That's the *capybara way*.",
  'Just a friendly reminder that **capybaras are the best**. #CapybaraPride',
  'Spreading capybara love, one smile at a time. 😊 *Happiness is contagious!*',
  "Napping is an art form, and I'm the master. #SleepyCapybara 😴",
  'Life is better with a **capybara by your side**.',
  'Grass: the key to a *happy capybara life*. 🌿',
  'Just keep swimming, just keep swimming. 🏊‍♂️ ~~Walking~~ Swimming is good exercise!',
  'Capybaras: making the world a *chiller place*, one day at a time. #CapybaraMission',
  '**Embrace your inner capybara**. Be chill, be kind, be awesome.',
  'Capybara life is the best life. *Change my mind.*',
  'Eating, sleeping, swimming, repeating. The ~~boring~~ capybara way of life.',
  'Stay chill, my friends. Love, your favorite capybara. ✌️ *Peace out!*',
];

const getRandomMessage = () => {
  return messages[Math.floor(Math.random() * messages.length)];
};

const usernames = [
  'CapybaraChillin',
  'GrassNibbler',
  'SwimmingCapy',
  'CapySunbather',
  'CapySquad',
  'NappingCapy',
  'CuteCapybara',
  'TreatPlzCapy',
  'ChillCapyMaster',
  'SlowLifeCapy',
  'GrassVibesCapy',
  'CapySmiles',
  'SleepyCapy',
  'CapyCompanion',
  'HappyGrassCapy',
  'SwimCapySwim',
  'ChillCapybara',
  'InnerCapy',
  'CapyDebater',
  'CapyLifeGoals',
];

const getRandomUsername = () => {
  return usernames[Math.floor(Math.random() * usernames.length)];
};

const getRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const getRandomEntry = () => {
  const id = getRandomId();
  return {
    message: getRandomMessage(),
    img: { src: getRandomImage(), alt: `image of ${id}` },
    username: `@${getRandomUsername()}`,
    id,
  };
};
