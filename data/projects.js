// 作品资料：通常只需要修改这个文件。每件作品包含鱼的资料及按顺序显示的信息卡。
// 图片地址从网站根目录开始；image 为 null 表示纯文字卡。
window.PORTFOLIO_PROJECTS = [
  {
    id: "project-01",
    title: "Light of wind",
    category: "Interactive installation",
    color: "#648cae",
    fish: {
      sourceY: 18,
      sourceHeight: 125,
      facing: -1,
    },
    slides: [
      {
        section: "01 / OVERVIEW",
        title: "Light of wind",
        text: "An exploration of bio-based textiles and interactive installation.",
        image: {
          src: "/assets/images/light-of-wind/daylight.jpg",
          alt: "A translucent golden lantern suspended among trees in daylight",
          caption: "Light of wind — in daylight",
        },
      },
      {
        section: "02 / INTRODUCTION",
        title: "Wind into light",
        text: "My first experiment combining bio-based textiles with an interactive installation. The lantern responds to wind direction and speed, adjusting the brightness and pulsing frequency of its light.",
        image: null,
      },
      {
        section: "03 / MATERIALS",
        title: "Bio-based textiles",
        text: "",
        image: {
          src: "/assets/images/light-of-wind/materials.jpg",
          alt: "Golden and green bio-based textile lanterns hanging from ropes with colorful material samples",
          caption: "Material textures and suspended forms",
        },
      },
      {
        section: "04 / LIGHT",
        title: "After dark",
        text: "Wind direction and speed become changes in brightness and rhythm.",
        image: {
          src: "/assets/images/light-of-wind/illuminated.jpg",
          alt: "Blue and amber light shining through the textured lantern surfaces",
          caption: "The lanterns illuminated",
        },
      },
    ],
  },
  {
    id: "project-02",
    title: "Amaurot",
    category: "Physical making",
    color: "#648cae",
    fish: {
      sourceY: 145,
      sourceHeight: 110,
      facing: -1,
    },
    slides: [
      {
        section: "01 / OVERVIEW",
        title: "Amaurot",
        text: "A music box inspired by Final Fantasy XIV.",
        image: {
          src: "/assets/images/projects/amaurot/1.jpg",
          alt: "Amaurot music box",
          caption: "Amaurot — music box",
        },
      },
      {
        section: "02 / INTRODUCTION",
        title: "A world in motion",
        text: "Inspired by Final Fantasy XIV, I created a music box from acrylic and wood. At its core is a coaxial gear mechanism that rotates in opposite directions.",
        image: null,
      },
      {
        section: "03 / GALLERY",
        title: "Amaurot",
        text: "",
        image: {
          src: "/assets/images/projects/amaurot/2.jpg",
          alt: "Amaurot music box, second view",
          caption: "View 02 / 04",
        },
      },
      {
        section: "04 / GALLERY",
        title: "Amaurot",
        text: "",
        image: {
          src: "/assets/images/projects/amaurot/3.jpg",
          alt: "Amaurot music box, third view",
          caption: "View 03 / 04",
        },
      },
      {
        section: "05 / GALLERY",
        title: "Amaurot",
        text: "",
        image: {
          src: "/assets/images/projects/amaurot/4.jpg",
          alt: "Amaurot music box, fourth view",
          caption: "View 04 / 04",
        },
      },
    ],
  },
  {
    id: "project-03",
    title: "website sandbox",
    category: "Creative coding",
    color: "#639c94",
    fish: {
      sourceY: 258,
      sourceHeight: 110,
      facing: 1,
    },
    slides: [
      {
        section: "01 / OVERVIEW",
        title: "website sandbox",
        text: "A collaborative, map-based sandbox built with Three.js.",
        image: {
          src: "/assets/images/projects/website-sandbox/1.png",
          alt: "Screenshot of website sandbox",
          caption: "website sandbox — shared world",
        },
      },
      {
        section: "02 / INTRODUCTION",
        title: "Build together",
        text: "Using Three.js, I built a browser-based sandbox on a map where multiple players can create together in real time. Players use a brush to place different types of resource blocks, as well as chickens that can move around.",
        image: null,
      },
      {
        section: "03 / GALLERY",
        title: "website sandbox",
        text: "",
        image: {
          src: "/assets/images/projects/website-sandbox/2.png",
          alt: "website sandbox screenshot, second view",
          caption: "View 02 / 04",
        },
      },
      {
        section: "04 / GALLERY",
        title: "website sandbox",
        text: "",
        image: {
          src: "/assets/images/projects/website-sandbox/3.png",
          alt: "website sandbox screenshot, third view",
          caption: "View 03 / 04",
        },
      },
      {
        section: "05 / GALLERY",
        title: "website sandbox",
        text: "",
        image: {
          src: "/assets/images/projects/website-sandbox/4.png",
          alt: "website sandbox screenshot, fourth view",
          caption: "View 04 / 04",
        },
      },
    ],
  },
  {
    id: "project-04",
    title: "Garden of Words",
    category: "Creative coding",
    color: "#639c94",
    fish: {
      sourceY: 370,
      sourceHeight: 90,
      facing: -1,
    },
    slides: [
      {
        section: "01 / OVERVIEW",
        title: "Garden of Words",
        text: "Every flower holds a piece of language.",
        image: {
          src: "/assets/images/projects/garden-of-words/1.png",
          alt: "Garden of Words project screenshot",
          caption: "Garden of Words",
        },
      },
      {
        section: "02 / INTRODUCTION",
        title: "Words into flowers",
        text: "Inspired by the language of flowers, I convert the text entered by users into numbers, then use those numbers to randomly select flowers from a color-based library. Each flower carries the words within it.",
        image: null,
      },
      {
        section: "03 / GALLERY",
        title: "Garden of Words",
        text: "",
        image: {
          src: "/assets/images/projects/garden-of-words/2.png",
          alt: "Garden of Words, second screenshot",
          caption: "A garden grown from words",
        },
      },
      {
        section: "04 / PROCESS",
        title: "Behind the flowers",
        text: "",
        image: {
          src: "/assets/images/projects/garden-of-words/3.png",
          alt: "Garden of Words source code, first process image",
          caption: "Process — code / 01",
        },
      },
      {
        section: "05 / PROCESS",
        title: "Behind the flowers",
        text: "",
        image: {
          src: "/assets/images/projects/garden-of-words/4.png",
          alt: "Garden of Words source code, second process image",
          caption: "Process — code / 02",
        },
      },
    ],
  },
  {
    id: "project-05",
    title: "Blue",
    category: "Animation",
    color: "#ad8196",
    fish: {
      sourceY: 480,
      sourceHeight: 114,
      facing: -1,
    },
    slides: [
      {
        section: "01 / OVERVIEW",
        title: "Blue",
        text: "A story of finding inner freedom.",
        image: {
          src: "/assets/images/projects/blue/1.png",
          alt: "Image from the animation Blue",
          caption: "Blue — animation",
        },
      },
      {
        section: "02 / INTRODUCTION",
        title: "Freedom within",
        text: "Blue tells the story of a young girl whose leg injury limits her freedom of movement. Through a series of realizations, she ultimately finds freedom within herself. The animation combines frame-by-frame hand drawing, collage, and skeletal animation.",
        image: null,
      },
    ],
  },
];
