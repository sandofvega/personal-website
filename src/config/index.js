module.exports = {
  siteTitle: 'Sand Of Vega | Web Developer',
  siteDescription:
    'Brittany Chiang is a software engineer based in Boston, MA who specializes in developing (and occasionally designing) exceptional, high-quality websites and applications.',
  siteKeywords:
    'Brittany Chiang, Brittany, Chiang, bchiang7, software engineer, front-end engineer, web developer, javascript, northeastern',
  siteUrl: 'https://sandofvega.com',
  siteLanguage: 'en_US',
  googleAnalyticsID: 'UA-111323376-1',
  googleVerification: 'DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk',
  name: 'Brittany Chiang',
  location: 'Dhaka, Bangladesh',
  email: 'sandofvega@gmail.com',
  github: 'https://github.com/sandofvega',
  twitterHandle: '@sandofvega',
  socialMedia: [
    {
      name: 'Github',
      url: 'https://github.com/sandofvega',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/sandofvega',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/sandofvega',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/sandofvega',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Work',
      url: '/#projects',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  navHeight: 100,
  greenColor: '#64ffda',
  navyColor: '#0a192f',
  darkNavyColor: '#020c1b',

  srConfig: (delay = 200) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.25,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
