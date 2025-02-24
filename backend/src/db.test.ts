




import { db } from "@/db/db";
import { categories, platforms, toolCategoryPlatform, tools } from "@/db/schema";
import { eq } from "drizzle-orm";



// Get all the categories ids
// get all the platforms ids



// Generate 25 tools
// assign each tool a random category and platform (NONE categories and platforms are possible)

// insert the tools into the database

// create 10  categories
// Some are some are single constraint and some are NONE constraint(NONE)
const categoriesArray = [
  {
    name: "Colors",
    constraint: "NONE",
  },
  {
    name: "UI/UX",
    constraint: "NONE",
  },
  {
    name: "Designer Books",
    constraint: "SINGLE",
  },
  {
    name: "Designer Movies",
    constraint: "SINGLE",
  },
  {
    name: "Developer Books",
    constraint: "NONE",
  },
  {
    name: "Developer Movies",
    constraint: "NONE",
  },
  {
    name: "AI Tools",
    constraint: "NONE",
  },
  {
    name: "Productivity",
    constraint: "NONE",
  },
  {
    name: "Writing",
    constraint: "SINGLE",
  },
  {
    name: "Code Generation",
    constraint: "NONE",
  },
  {
    name: "Design Systems",
    constraint: "SINGLE",
  },
  {
    name: "Prototyping",
    constraint: "NONE",
  },
  {
    name: "Version Control",
    constraint: "NONE",
  },
  {
    name: "Project Management",
    constraint: "SINGLE",
  },
  {
    name: "Collaboration",
    constraint: "NONE",
  },
  {
    name: "Learning Resources",
    constraint: "NONE",
  },
  {
    name: "Performance Tools",
    constraint: "SINGLE",
  },
  {
    name: "Security",
    constraint: "NONE",
  },
  {
    name: "Testing",
    constraint: "NONE",
  },
  {
    name: "Deployment",
    constraint: "SINGLE",
  },
  {
    name: "Monitoring",
    constraint: "NONE",
  }
];

// tools
const toolsArray = [
  { name: "Figma" },
  { name: "Canva" },
  { name: "Adobe XD" },
  { name: "Sketch" },
  { name: "InVision" },
  { name: "Framer" },
  { name: "Cursor" },
  { name: "Raycast" },
  { name: "Visual Studio Code" },
  { name: "GitHub Copilot" },
  { name: "ChatGPT" },
  { name: "Linear" },
  { name: "Notion" },
  { name: "Trello" },
  { name: "Slack" },
  { name: "Zoom" },
  { name: "MDN Web Docs" },
  { name: "freeCodeCamp" },
  { name: "Udemy" },
  { name: "Jest" },
  { name: "Cypress" },
  { name: "Vercel" },
  { name: "Sentry" },
  { name: "New Relic" },
  { name: "Photoshop" },
  { name: "Illustrator" },
  { name: "Premiere Pro" },
  { name: "After Effects" },
  { name: "Audition" },
  { name: "Lightroom" },
  { name: "Excalidraw" },
  { name: "Dribbble" },
  { name: "Behance" },
  { name: "DeviantArt" },
  { name: "ArtStation" },
  { name: "Pinterest" },
  { name: "Reddit" },
  { name: "Twitter" },

];


export const seedCategories = async () => {
  const categoriesIds = await db.select( { id: categories.id, name: categories.name } ).from( categories );
  const platformsIds = await db.select( { id: platforms.id, name: platforms.name } ).from( platforms );

  console.log( "categoriesIds", categoriesIds );
  console.log( "platformsIds", platformsIds );

  // seed the categories
  console.log( "Bro I am seeding the categories" );
  const catResult = await db.insert( categories ).values(
    categoriesArray.map( ( cat ) => (
      {
        name: cat.name,
        imageUrl: "TESTURL",
        platformConstraint: cat.constraint as "NONE" | "SINGLE",
        description: "TESTDESCRIPTION",
      }
    )
    )
  );

  console.log( "Bro! Seeded the categories", catResult );



};


// seedCategories();

export const seedTools = async () => {
  const categoriesIds = await db.select( { id: categories.id } ).from( categories );
  const platformsIds = await db.select( { id: platforms.id } ).from( platforms );

  // write get catgroey and plaform id from name from db
  const getCategoryId = async ( name: string ) => {
    const category = await db.select( { id: categories.id } ).from( categories ).where( eq( categories.name, name ) );
    return category[ 0 ].id;
  };
  const getPlatformId = async ( name: string ) => {
    const platform = await db.select( { id: platforms.id } ).from( platforms ).where( eq( platforms.name, name ) );
    return platform[ 0 ].id;
  };




};
