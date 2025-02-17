
import { categories, platforms, tags, toolCategoryPlatform, tools, toolTags } from './schema'; // Adjust path if necessary
import { eq, and } from 'drizzle-orm';
import { db } from './db';



async function seedDatabase () {
  try {
    console.log( "🌱 Seeding database..." );

    // ------------------------------------------------------------------
    // 1. Predefined Categories, Platforms, and Tags (to avoid duplicates)
    // ------------------------------------------------------------------

    const predefinedCategories = [
      { name: "UI Design", description: "Tools for User Interface Design", imageUrl: "/images/categories/ui-design.png" },
      { name: "UX Research", description: "Tools for User Experience Research", imageUrl: "/images/categories/ux-research.png" },
      { name: "Prototyping", description: "Tools for Interactive Prototyping", imageUrl: "/images/categories/prototyping.png" },
      { name: "Graphic Design", description: "Tools for Visual Communication and Graphics", imageUrl: "/images/categories/graphic-design.png" },
      { name: "Code Editors", description: "Integrated Development Environments", imageUrl: "/images/categories/code-editors.png" },
      { name: "Frontend Frameworks", description: "Frameworks for building user interfaces", imageUrl: "/images/categories/frontend-frameworks.png" },
      { name: "Backend Frameworks", description: "Frameworks for server-side logic", imageUrl: "/images/categories/backend-frameworks.png" },
      { name: "Database", description: "Database management systems", imageUrl: "/images/categories/database.png" },
      { name: "Project Management", description: "Tools for team collaboration and task management", imageUrl: "/images/categories/project-management.png" },
      { name: "Collaboration", description: "General collaboration and communication tools", imageUrl: "/images/categories/collaboration.png" },
      { name: "Testing", description: "Software testing and QA tools", imageUrl: "/images/categories/testing.png" },
      { name: "Animation", description: "Tools for creating animations and motion graphics", imageUrl: "/images/categories/animation.png" },
      { name: "3D Modeling", description: "Tools for creating 3D models and scenes", imageUrl: "/images/categories/3d-modeling.png" },
      { name: "AI Tools", description: "Tools leveraging Artificial Intelligence", imageUrl: "/images/categories/ai-tools.png" },
      { name: "Marketing", description: "Marketing and SEO tools", imageUrl: "/images/categories/marketing.png" },
      { name: "Analytics", description: "Data analysis and visualization tools", imageUrl: "/images/categories/analytics.png" },
      { name: "Cloud Services", description: "Cloud computing platforms and services", imageUrl: "/images/categories/cloud-services.png" },
      { name: "Learning Platforms", description: "Online learning and course platforms", imageUrl: "/images/categories/learning-platforms.png" },
      { name: "Design Inspiration", description: "Platforms for design inspiration and resources", imageUrl: "/images/categories/design-inspiration.png" },
      { name: "Productivity", description: "Tools focused on boosting productivity", imageUrl: "/images/categories/productivity.png" },
    ];

    const predefinedPlatforms = [
      { name: "Web", description: "Web-based platforms", imageUrl: "/images/platforms/web.png" },
      { name: "Desktop", description: "Desktop applications", imageUrl: "/images/platforms/desktop.png" },
      { name: "Mobile (iOS)", description: "Mobile applications for iOS", imageUrl: "/images/platforms/ios.png" },
      { name: "Mobile (Android)", description: "Mobile applications for Android", imageUrl: "/images/platforms/android.png" },
      { name: "Cross-Platform", description: "Tools available on multiple platforms", imageUrl: "/images/platforms/cross-platform.png" },
      { name: "Browser Extension", description: "Browser extensions and plugins", imageUrl: "/images/platforms/browser-extension.png" },
      { name: "Command Line (CLI)", description: "Command-line interface tools", imageUrl: "/images/platforms/cli.png" },
      { name: "API", description: "Tools primarily accessed via API", imageUrl: "/images/platforms/api.png" },
    ];

    const predefinedTags = [
      { name: "Free" },
      { name: "Paid" },
      { name: "Open Source" },
      { name: "Collaboration-Focused" },
      { name: "Beginner-Friendly" },
      { name: "Advanced" },
      { name: "Cloud-Based" },
      { name: "Offline Available" },
      { name: "AI-Powered" },
      { name: "Prototyping-Specific" },
      { name: "Design Systems" },
      { name: "Code Generation" },
      { name: "Testing Automation" },
      { name: "Data Visualization" },
      { name: "SEO Optimized" },
    ];

    // ------------------------------------------------------------------
    // 2. Insert Categories, Platforms, Tags (if not already present)
    // ------------------------------------------------------------------

    console.log( "Inserting Categories..." );
    for ( const cat of predefinedCategories ) {
      const existingCategory = await db.query.categories.findFirst( {
        where: eq( categories.name, cat.name )
      } );
      if ( !existingCategory ) {
        await db.insert( categories ).values( cat );
      }
    }

    console.log( "Inserting Platforms..." );
    for ( const platform of predefinedPlatforms ) {
      const existingPlatform = await db.query.platforms.findFirst( {
        where: eq( platforms.name, platform.name )
      } );
      if ( !existingPlatform ) {
        await db.insert( platforms ).values( platform );
      }
    }

    console.log( "Inserting Tags..." );
    for ( const tag of predefinedTags ) {
      const existingTag = await db.query.tags.findFirst( {
        where: eq( tags.name, tag.name )
      } );
      if ( !existingTag ) {
        await db.insert( tags ).values( tag );
      }
    }

    // ------------------------------------------------------------------
    // 3. Tool Data - Array of Tools with Categories, Platforms, Tags
    // ------------------------------------------------------------------

    const toolData = [
      // **Tools - Example Seed Data (Expand to ~100)**
      {
        name: "Figma",
        description: "Collaborative web application for interface design.",
        imageUrl: "/images/tools/figma.png",
        thumbnailUrls: { small: "/images/tools/figma-small.png", medium: "/images/tools/figma-medium.png", large: "/images/tools/figma-large.png" },
        categoryNames: [ "UI Design", "Prototyping", "Collaboration" ],
        platformNames: [ "Web", "Desktop" ],
        tagNames: [ "Free", "Paid", "Collaboration-Focused", "Design Systems" ]
      },
      {
        name: "Adobe Photoshop",
        description: "Industry-standard raster graphics editor.",
        imageUrl: "/images/tools/photoshop.png",
        thumbnailUrls: { small: "/images/tools/photoshop-small.png", medium: "/images/tools/photoshop-medium.png", large: "/images/tools/photoshop-large.png" },
        categoryNames: [ "Graphic Design", "UI Design" ],
        platformNames: [ "Desktop" ],
        tagNames: [ "Paid", "Advanced" ]
      },
      {
        name: "Sketch",
        description: "Vector graphics editor for macOS, primarily for UI and UX design.",
        imageUrl: "/images/tools/sketch.png",
        thumbnailUrls: { small: "/images/tools/sketch-small.png", medium: "/images/tools/sketch-medium.png", large: "/images/tools/sketch-large.png" },
        categoryNames: [ "UI Design", "Prototyping" ],
        platformNames: [ "Desktop" ],
        tagNames: [ "Paid", "Design Systems" ]
      },
      {
        name: "Adobe Illustrator",
        description: "Vector graphics editor, primarily for logo design and illustration.",
        imageUrl: "/images/tools/illustrator.png",
        thumbnailUrls: { small: "/images/tools/illustrator-small.png", medium: "/images/tools/illustrator-medium.png", large: "/images/tools/illustrator-large.png" },
        categoryNames: [ "Graphic Design" ],
        platformNames: [ "Desktop" ],
        tagNames: [ "Paid", "Advanced" ]
      },
      {
        name: "Visual Studio Code",
        description: "Popular source code editor.",
        imageUrl: "/images/tools/vscode.png",
        thumbnailUrls: { small: "/images/tools/vscode-small.png", medium: "/images/tools/vscode-medium.png", large: "/images/tools/vscode-large.png" },
        categoryNames: [ "Code Editors", "Frontend Frameworks", "Backend Frameworks" ],
        platformNames: [ "Desktop", "Web", "Cross-Platform" ], // VS Code Web version also exists
        tagNames: [ "Free", "Open Source", "Code Generation" ]
      },
      {
        name: "Sublime Text",
        description: "Sophisticated text editor for code, markup and prose.",
        imageUrl: "/images/tools/sublime-text.png",
        thumbnailUrls: { small: "/images/tools/sublime-text-small.png", medium: "/images/tools/sublime-text-medium.png", large: "/images/tools/sublime-text-large.png" },
        categoryNames: [ "Code Editors" ],
        platformNames: [ "Desktop", "Cross-Platform" ],
        tagNames: [ "Paid", "Advanced" ]
      },
      {
        name: "WebStorm",
        description: "Powerful IDE for JavaScript and web development.",
        imageUrl: "/images/tools/webstorm.png",
        thumbnailUrls: { small: "/images/tools/webstorm-small.png", medium: "/images/tools/webstorm-medium.png", large: "/images/tools/webstorm-large.png" },
        categoryNames: [ "Code Editors", "Frontend Frameworks", "Backend Frameworks" ],
        platformNames: [ "Desktop", "Cross-Platform" ],
        tagNames: [ "Paid", "Advanced", "Code Generation" ]
      },
      {
        name: "React",
        description: "JavaScript library for building user interfaces.",
        imageUrl: "/images/tools/react.png",
        thumbnailUrls: { small: "/images/tools/react-small.png", medium: "/images/tools/react-medium.png", large: "/images/tools/react-large.png" },
        categoryNames: [ "Frontend Frameworks" ],
        platformNames: [ "Web", "Cross-Platform" ],
        tagNames: [ "Free", "Open Source", "Beginner-Friendly", "Advanced" ]
      },
      {
        name: "Angular",
        description: "Comprehensive framework for building client applications.",
        imageUrl: "/images/tools/angular.png",
        thumbnailUrls: { small: "/images/tools/angular-small.png", medium: "/images/tools/angular-medium.png", large: "/images/tools/angular-large.png" },
        categoryNames: [ "Frontend Frameworks" ],
        platformNames: [ "Web", "Cross-Platform" ],
        tagNames: [ "Free", "Open Source", "Advanced" ]
      },
      {
        name: "Vue.js",
        description: "Progressive JavaScript framework.",
        imageUrl: "/images/tools/vuejs.png",
        thumbnailUrls: { small: "/images/tools/vuejs-small.png", medium: "/images/tools/vuejs-medium.png", large: "/images/tools/vuejs-large.png" },
        categoryNames: [ "Frontend Frameworks" ],
        platformNames: [ "Web", "Cross-Platform" ],
        tagNames: [ "Free", "Open Source", "Beginner-Friendly", "Advanced" ]
      },
      {
        name: "Node.js",
        description: "JavaScript runtime built on Chrome's V8 JavaScript engine.",
        imageUrl: "/images/tools/nodejs.png",
        thumbnailUrls: { small: "/images/tools/nodejs-small.png", medium: "/images/tools/nodejs-medium.png", large: "/images/tools/nodejs-large.png" },
        categoryNames: [ "Backend Frameworks" ],
        platformNames: [ "Cross-Platform", "Web", "Command Line (CLI)" ],
        tagNames: [ "Free", "Open Source", "Beginner-Friendly", "Advanced" ]
      },
      {
        name: "Express.js",
        description: "Minimalist Node.js web application framework.",
        imageUrl: "/images/tools/expressjs.png",
        thumbnailUrls: { small: "/images/tools/expressjs-small.png", medium: "/images/tools/expressjs-medium.png", large: "/images/tools/expressjs-large.png" },
        categoryNames: [ "Backend Frameworks" ],
        platformNames: [ "Web", "Command Line (CLI)" ],
        tagNames: [ "Free", "Open Source", "Beginner-Friendly", "Advanced" ]
      },
      {
        name: "PostgreSQL",
        description: "Powerful, open source object-relational database system.",
        imageUrl: "/images/tools/postgresql.png",
        thumbnailUrls: { small: "/images/tools/postgresql-small.png", medium: "/images/tools/postgresql-medium.png", large: "/images/tools/postgresql-large.png" },
        categoryNames: [ "Database" ],
        platformNames: [ "Cross-Platform", "Cloud Services" ],
        tagNames: [ "Free", "Open Source", "Advanced", "Cloud-Based" ]
      },
      {
        name: "MongoDB",
        description: "Document database designed for ease of development and scaling.",
        imageUrl: "/images/tools/mongodb.png",
        thumbnailUrls: { small: "/images/tools/mongodb-small.png", medium: "/images/tools/mongodb-medium.png", large: "/images/tools/mongodb-large.png" },
        categoryNames: [ "Database" ],
        platformNames: [ "Cross-Platform", "Cloud Services" ],
        tagNames: [ "Free", "Open Source", "Beginner-Friendly", "Advanced", "Cloud-Based" ]
      },
      {
        name: "Jira",
        description: "Project tracking software for agile teams.",
        imageUrl: "/images/tools/jira.png",
        thumbnailUrls: { small: "/images/tools/jira-small.png", medium: "/images/tools/jira-medium.png", large: "/images/tools/jira-large.png" },
        categoryNames: [ "Project Management", "Collaboration" ],
        platformNames: [ "Web", "Desktop", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Paid", "Collaboration-Focused" ]
      },
      {
        name: "Trello",
        description: "Visual tool for project management and collaboration.",
        imageUrl: "/images/tools/trello.png",
        thumbnailUrls: { small: "/images/tools/trello-small.png", medium: "/images/tools/trello-medium.png", large: "/images/tools/trello-large.png" },
        categoryNames: [ "Project Management", "Collaboration" ],
        platformNames: [ "Web", "Desktop", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Free", "Paid", "Collaboration-Focused", "Beginner-Friendly" ]
      },
      {
        name: "Slack",
        description: "Business communication platform.",
        imageUrl: "/images/tools/slack.png",
        thumbnailUrls: { small: "/images/tools/slack-small.png", medium: "/images/tools/slack-medium.png", large: "/images/tools/slack-large.png" },
        categoryNames: [ "Collaboration" ],
        platformNames: [ "Web", "Desktop", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Paid", "Collaboration-Focused" ]
      },
      {
        name: "Discord",
        description: "Voice, video, and text communication service, also used by many teams.",
        imageUrl: "/images/tools/discord.png",
        thumbnailUrls: { small: "/images/tools/discord-small.png", medium: "/images/tools/discord-medium.png", large: "/images/tools/discord-large.png" },
        categoryNames: [ "Collaboration" ],
        platformNames: [ "Web", "Desktop", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Free", "Paid", "Collaboration-Focused" ]
      },
      {
        name: "Jest",
        description: "JavaScript testing framework.",
        imageUrl: "/images/tools/jest.png",
        thumbnailUrls: { small: "/images/tools/jest-small.png", medium: "/images/tools/jest-medium.png", large: "/images/tools/jest-large.png" },
        categoryNames: [ "Testing" ],
        platformNames: [ "Command Line (CLI)", "Web" ],
        tagNames: [ "Free", "Open Source", "Testing Automation" ]
      },
      {
        name: "Cypress",
        description: "End-to-end testing framework for web applications.",
        imageUrl: "/images/tools/cypress.png",
        thumbnailUrls: { small: "/images/tools/cypress-small.png", medium: "/images/tools/cypress-medium.png", large: "/images/tools/cypress-large.png" },
        categoryNames: [ "Testing" ],
        platformNames: [ "Desktop", "Web", "Command Line (CLI)" ],
        tagNames: [ "Free", "Paid", "Testing Automation" ]
      },
      {
        name: "Lottie",
        description: "Animation file format and player for web, mobile, and desktop.",
        imageUrl: "/images/tools/lottie.png",
        thumbnailUrls: { small: "/images/tools/lottie-small.png", medium: "/images/tools/lottie-medium.png", large: "/images/tools/lottie-large.png" },
        categoryNames: [ "Animation" ],
        platformNames: [ "Web", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Free", "Open Source" ]
      },
      {
        name: "Blender",
        description: "Free and open-source 3D creation suite.",
        imageUrl: "/images/tools/blender.png",
        thumbnailUrls: { small: "/images/tools/blender-small.png", medium: "/images/tools/blender-medium.png", large: "/images/tools/blender-large.png" },
        categoryNames: [ "3D Modeling", "Animation" ],
        platformNames: [ "Desktop", "Cross-Platform" ],
        tagNames: [ "Free", "Open Source", "Advanced", "3D Modeling" ]
      },
      {
        name: "Three.js",
        description: "JavaScript 3D library.",
        imageUrl: "/images/tools/threejs.png",
        thumbnailUrls: { small: "/images/tools/threejs-small.png", medium: "/images/tools/threejs-medium.png", large: "/images/tools/threejs-large.png" },
        categoryNames: [ "3D Modeling", "Animation", "Frontend Frameworks" ], // Can be used in frontend frameworks
        platformNames: [ "Web", "Cross-Platform" ],
        tagNames: [ "Free", "Open Source", "3D Modeling", "Web-Based" ]
      },
      {
        name: "ChatGPT",
        description: "Large language model chatbot.",
        imageUrl: "/images/tools/chatgpt.png",
        thumbnailUrls: { small: "/images/tools/chatgpt-small.png", medium: "/images/tools/chatgpt-medium.png", large: "/images/tools/chatgpt-large.png" },
        categoryNames: [ "AI Tools", "Productivity", "Collaboration" ], // Can boost productivity and aid collaboration in writing tasks
        platformNames: [ "Web", "API" ],
        tagNames: [ "Paid", "AI-Powered" ]
      },
      {
        name: "Google Analytics",
        description: "Web analytics service that tracks and reports website traffic.",
        imageUrl: "/images/tools/google-analytics.png",
        thumbnailUrls: { small: "/images/tools/google-analytics-small.png", medium: "/images/tools/google-analytics-medium.png", large: "/images/tools/google-analytics-large.png" },
        categoryNames: [ "Analytics", "Marketing" ],
        platformNames: [ "Web", "API" ],
        tagNames: [ "Free", "Paid", "Web-Based", "Data Visualization" ]
      },
      {
        name: "Tableau",
        description: "Interactive data visualization software.",
        imageUrl: "/images/tools/tableau.png",
        thumbnailUrls: { small: "/images/tools/tableau-small.png", medium: "/images/tools/tableau-medium.png", large: "/images/tools/tableau-large.png" },
        categoryNames: [ "Analytics", "Data Visualization" ],
        platformNames: [ "Desktop", "Web", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Paid", "Data Visualization", "Advanced" ]
      },
      {
        name: "Google Cloud Platform (GCP)",
        description: "Suite of cloud computing services.",
        imageUrl: "/images/tools/gcp.png",
        thumbnailUrls: { small: "/images/tools/gcp-small.png", medium: "/images/tools/gcp-medium.png", large: "/images/tools/gcp-large.png" },
        categoryNames: [ "Cloud Services", "Database", "Backend Frameworks", "Analytics" ], // GCP offers databases, backend services, analytics etc.
        platformNames: [ "Web", "API" ],
        tagNames: [ "Paid", "Cloud-Based", "Advanced" ]
      },
      {
        name: "Amazon Web Services (AWS)",
        description: "Comprehensive cloud platform.",
        imageUrl: "/images/tools/aws.png",
        thumbnailUrls: { small: "/images/tools/aws-small.png", medium: "/images/tools/aws-medium.png", large: "/images/tools/aws-large.png" },
        categoryNames: [ "Cloud Services", "Database", "Backend Frameworks", "Analytics" ], // AWS similar to GCP in service offerings
        platformNames: [ "Web", "API" ],
        tagNames: [ "Paid", "Cloud-Based", "Advanced" ]
      },
      {
        name: "Microsoft Azure",
        description: "Cloud computing service created by Microsoft.",
        imageUrl: "/images/tools/azure.png",
        thumbnailUrls: { small: "/images/tools/azure-small.png", medium: "/images/tools/azure-medium.png", large: "/images/tools/azure-large.png" },
        categoryNames: [ "Cloud Services", "Database", "Backend Frameworks", "Analytics" ], // Azure also competes with GCP and AWS
        platformNames: [ "Web", "API" ],
        tagNames: [ "Paid", "Cloud-Based", "Advanced" ]
      },
      {
        name: "Coursera",
        description: "Online learning platform.",
        imageUrl: "/images/tools/coursera.png",
        thumbnailUrls: { small: "/images/tools/coursera-small.png", medium: "/images/tools/coursera-medium.png", large: "/images/tools/coursera-large.png" },
        categoryNames: [ "Learning Platforms" ],
        platformNames: [ "Web", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Paid", "Web-Based" ]
      },
      {
        name: "Udemy",
        description: "Online learning and teaching marketplace.",
        imageUrl: "/images/tools/udemy.png",
        thumbnailUrls: { small: "/images/tools/udemy-small.png", medium: "/images/tools/udemy-medium.png", large: "/images/tools/udemy-large.png" },
        categoryNames: [ "Learning Platforms" ],
        platformNames: [ "Web", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Paid", "Web-Based" ]
      },
      {
        name: "Dribbble",
        description: "Platform for design inspiration and portfolio.",
        imageUrl: "/images/tools/dribbble.png",
        thumbnailUrls: { small: "/images/tools/dribbble-small.png", medium: "/images/tools/dribbble-medium.png", large: "/images/tools/dribbble-large.png" },
        categoryNames: [ "Design Inspiration", "UI Design", "Graphic Design" ], // Inspiration for UI and Graphic design both
        platformNames: [ "Web", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Free", "Paid", "Design Inspiration", "Web-Based" ]
      },
      {
        name: "Behance",
        description: "Adobe's platform for showcasing and discovering creative work.",
        imageUrl: "/images/tools/behance.png",
        thumbnailUrls: { small: "/images/tools/behance-small.png", medium: "/images/tools/behance-medium.png", large: "/images/tools/behance-large.png" },
        categoryNames: [ "Design Inspiration", "UI Design", "Graphic Design" ], // Inspiration for UI and Graphic design both
        platformNames: [ "Web", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Free", "Paid", "Design Inspiration", "Web-Based" ]
      },
      {
        name: "Notion",
        description: "All-in-one workspace - notes, wikis, tasks, and databases.",
        imageUrl: "/images/tools/notion.png",
        thumbnailUrls: { small: "/images/tools/notion-small.png", medium: "/images/tools/notion-medium.png", large: "/images/tools/notion-large.png" },
        categoryNames: [ "Productivity", "Project Management", "Collaboration" ],
        platformNames: [ "Web", "Desktop", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Free", "Paid", "Productivity", "Collaboration-Focused" ]
      },
      {
        name: "Todoist",
        description: "Task management app.",
        imageUrl: "/images/tools/todoist.png",
        thumbnailUrls: { small: "/images/tools/todoist-small.png", medium: "/images/tools/todoist-medium.png", large: "/images/tools/todoist-large.png" },
        categoryNames: [ "Productivity", "Project Management" ],
        platformNames: [ "Web", "Desktop", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Free", "Paid", "Productivity" ]
      },
      {
        name: "Google Search Console",
        description: "Web service by Google for webmasters.",
        imageUrl: "/images/tools/google-search-console.png",
        thumbnailUrls: { small: "/images/tools/google-search-console-small.png", medium: "/images/tools/google-search-console-medium.png", large: "/images/tools/google-search-console-large.png" },
        categoryNames: [ "Marketing", "Analytics" ],
        platformNames: [ "Web" ],
        tagNames: [ "Free", "Marketing", "Analytics", "SEO Optimized" ]
      },
      {
        name: "SEMrush",
        description: "Online visibility management and content marketing platform.",
        imageUrl: "/images/tools/semrush.png",
        thumbnailUrls: { small: "/images/tools/semrush-small.png", medium: "/images/tools/semrush-medium.png", large: "/images/tools/semrush-large.png" },
        categoryNames: [ "Marketing", "Analytics" ],
        platformNames: [ "Web" ],
        tagNames: [ "Paid", "Marketing", "Analytics", "SEO Optimized" ]
      },
      {
        name: "Ahrefs",
        description: "SEO toolset for growing search traffic.",
        imageUrl: "/images/tools/ahrefs.png",
        thumbnailUrls: { small: "/images/tools/ahrefs-small.png", medium: "/images/tools/ahrefs-medium.png", large: "/images/tools/ahrefs-large.png" },
        categoryNames: [ "Marketing", "Analytics" ],
        platformNames: [ "Web" ],
        tagNames: [ "Paid", "Marketing", "Analytics", "SEO Optimized" ]
      },
      {
        name: "Hotjar",
        description: "Behavior analytics service.",
        imageUrl: "/images/tools/hotjar.png",
        thumbnailUrls: { small: "/images/tools/hotjar-small.png", medium: "/images/tools/hotjar-medium.png", large: "/images/tools/hotjar-large.png" },
        categoryNames: [ "UX Research", "Analytics" ],
        platformNames: [ "Web" ],
        tagNames: [ "Paid", "Analytics", "UX Research" ]
      },
      {
        name: "Maze",
        description: "User testing platform for prototypes.",
        imageUrl: "/images/tools/maze.png",
        thumbnailUrls: { small: "/images/tools/maze-small.png", medium: "/images/tools/maze-medium.png", large: "/images/tools/maze-large.png" },
        categoryNames: [ "UX Research", "Prototyping" ],
        platformNames: [ "Web" ],
        tagNames: [ "Paid", "UX Research", "Prototyping-Specific" ]
      },
      {
        name: "Lookback",
        description: "User research platform for live interviews and testing.",
        imageUrl: "/images/tools/lookback.png",
        thumbnailUrls: { small: "/images/tools/lookback-small.png", medium: "/images/tools/lookback-medium.png", large: "/images/tools/lookback-large.png" },
        categoryNames: [ "UX Research", "Collaboration" ], // Collaboration in user research sessions
        platformNames: [ "Web", "Desktop", "Mobile (iOS)", "Mobile (Android)" ], // For participants joining from different devices
        tagNames: [ "Paid", "UX Research", "Collaboration-Focused" ]
      },
      {
        name: "Framer",
        description: "Interactive design and prototyping tool, also code-based.",
        imageUrl: "/images/tools/framer.png",
        thumbnailUrls: { small: "/images/tools/framer-small.png", medium: "/images/tools/framer-medium.png", large: "/images/tools/framer-large.png" },
        categoryNames: [ "Prototyping", "UI Design", "Code Editors" ], // Code component and design tool
        platformNames: [ "Web", "Desktop", "Cross-Platform" ], // Web version and desktop app
        tagNames: [ "Paid", "Prototyping-Specific", "Code Generation", "Advanced" ]
      },
      {
        name: "ProtoPie",
        description: "High-fidelity prototyping tool.",
        imageUrl: "/images/tools/protopie.png",
        thumbnailUrls: { small: "/images/tools/protopie-small.png", medium: "/images/tools/protopie-medium.png", large: "/images/tools/protopie-large.png" },
        categoryNames: [ "Prototyping" ],
        platformNames: [ "Desktop", "Mobile (iOS)", "Mobile (Android)" ], // Viewer apps on mobile, desktop editor
        tagNames: [ "Paid", "Prototyping-Specific", "Advanced" ]
      },
      {
        name: "Principle",
        description: "Animated interface design tool for macOS.",
        imageUrl: "/images/tools/principle.png",
        thumbnailUrls: { small: "/images/tools/principle-small.png", medium: "/images/tools/principle-medium.png", large: "/images/tools/principle-large.png" },
        categoryNames: [ "Animation", "Prototyping", "UI Design" ], // Animation focused prototyping tool
        platformNames: [ "Desktop", "Mobile (iOS)" ], // macOS editor, iOS viewer
        tagNames: [ "Paid", "Animation", "Prototyping-Specific" ]
      },
      {
        name: "Spline",
        description: "Collaborative 3D design tool for the web.",
        imageUrl: "/images/tools/spline.png",
        thumbnailUrls: { small: "/images/tools/spline-small.png", medium: "/images/tools/spline-medium.png", large: "/images/tools/spline-large.png" },
        categoryNames: [ "3D Modeling", "Animation", "UI Design" ], // 3D in UI, animation and 3D modeling tool
        platformNames: [ "Web", "Desktop" ], // Web based, desktop app too
        tagNames: [ "Free", "Paid", "3D Modeling", "Animation", "Web-Based", "Collaboration-Focused" ]
      },
      {
        name: "Cinema 4D",
        description: "Professional 3D modeling, animation, motion graphics and rendering software.",
        imageUrl: "/images/tools/cinema4d.png",
        thumbnailUrls: { small: "/images/tools/cinema4d-small.png", medium: "/images/tools/cinema4d-medium.png", large: "/images/tools/cinema4d-large.png" },
        categoryNames: [ "3D Modeling", "Animation" ],
        platformNames: [ "Desktop" ],
        tagNames: [ "Paid", "3D Modeling", "Animation", "Advanced" ]
      },
      {
        name: "Marvel",
        description: "Prototyping and collaboration platform.",
        imageUrl: "/images/tools/marvel.png",
        thumbnailUrls: { small: "/images/tools/marvel-small.png", medium: "/images/tools/marvel-medium.png", large: "/images/tools/marvel-large.png" },
        categoryNames: [ "Prototyping", "Collaboration", "UX Research" ], // Prototyping and user testing platform
        platformNames: [ "Web" ],
        tagNames: [ "Paid", "Prototyping-Specific", "Collaboration-Focused", "UX Research" ]
      },
      {
        name: "Origami Studio",
        description: "Free tool for designing modern interfaces, by Facebook.",
        imageUrl: "/images/tools/origami-studio.png",
        thumbnailUrls: { small: "/images/tools/origami-studio-small.png", medium: "/images/tools/origami-studio-medium.png", large: "/images/tools/origami-studio-large.png" },
        categoryNames: [ "Prototyping", "Animation" ], // Focused on prototyping and animation
        platformNames: [ "Desktop" ], // macOS only
        tagNames: [ "Free", "Prototyping-Specific", "Animation", "Advanced" ]
      },
      {
        name: "Mockplus",
        description: "Rapid prototyping tool.",
        imageUrl: "/images/tools/mockplus.png",
        thumbnailUrls: { small: "/images/tools/mockplus-small.png", medium: "/images/tools/mockplus-medium.png", large: "/images/tools/mockplus-large.png" },
        categoryNames: [ "Prototyping", "UI Design" ], // Quick prototyping tool, UI design aspects
        platformNames: [ "Desktop", "Web", "Mobile (iOS)", "Mobile (Android)" ], // Desktop and web editors, mobile viewer apps
        tagNames: [ "Paid", "Prototyping-Specific", "Beginner-Friendly" ]
      },
      {
        name: "MockFlow",
        description: "Online wireframing and prototyping suite.",
        imageUrl: "/images/tools/mockflow.png",
        thumbnailUrls: { small: "/images/tools/mockflow-small.png", medium: "/images/tools/mockflow-medium.png", large: "/images/tools/mockflow-large.png" },
        categoryNames: [ "Prototyping", "UI Design" ], // Wireframing and basic prototyping
        platformNames: [ "Web" ],
        tagNames: [ "Paid", "Prototyping-Specific", "Beginner-Friendly", "Collaboration-Focused" ]
      },
      {
        name: " Balsamiq",
        description: "Low-fidelity wireframing tool.",
        imageUrl: "/images/tools/balsamiq.png",
        thumbnailUrls: { small: "/images/tools/balsamiq-small.png", medium: "/images/tools/balsamiq-medium.png", large: "/images/tools/balsamiq-large.png" },
        categoryNames: [ "Prototyping", "UI Design" ], // Low-fidelity wireframing
        platformNames: [ "Desktop", "Web" ],
        tagNames: [ "Paid", "Prototyping-Specific", "Beginner-Friendly" ]
      },
      {
        name: "Axure RP",
        description: "Powerful prototyping tool for complex prototypes.",
        imageUrl: "/images/tools/axure-rp.png",
        thumbnailUrls: { small: "/images/tools/axure-rp-small.png", medium: "/images/tools/axure-rp-medium.png", large: "/images/tools/axure-rp-large.png" },
        categoryNames: [ "Prototyping", "UX Research" ], // Advanced prototyping, user testing features
        platformNames: [ "Desktop", "Web" ],
        tagNames: [ "Paid", "Prototyping-Specific", "Advanced", "UX Research" ]
      },
      {
        name: "Adobe XD",
        description: "Fast and powerful UI/UX design solution.",
        imageUrl: "/images/tools/adobe-xd.png",
        thumbnailUrls: { small: "/images/tools/adobe-xd-small.png", medium: "/images/tools/adobe-xd-medium.png", large: "/images/tools/adobe-xd-large.png" },
        categoryNames: [ "UI Design", "Prototyping", "Collaboration" ],
        platformNames: [ "Desktop", "Web", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Paid", "Design Systems", "Collaboration-Focused" ]
      },
      {
        name: "InVision Studio",
        description: "Advanced screen design and prototyping tool (no longer actively developed, but historically important).",
        imageUrl: "/images/tools/invision-studio.png",
        thumbnailUrls: { small: "/images/tools/invision-studio-small.png", medium: "/images/tools/invision-studio-medium.png", large: "/images/tools/invision-studio-large.png" },
        categoryNames: [ "Prototyping", "UI Design", "Collaboration" ], // Historical prototyping tool
        platformNames: [ "Desktop" ],
        tagNames: [ "Paid", "Prototyping-Specific", "Collaboration-Focused", "Design Systems" ]
      },
      // Add ~60-70 more tools here following the same structure ...
      {
        name: "Git",
        description: "Distributed version control system.",
        imageUrl: "/images/tools/git.png",
        thumbnailUrls: { small: "/images/tools/git-small.png", medium: "/images/tools/git-medium.png", large: "/images/tools/git-large.png" },
        categoryNames: [ "Code Editors", "Collaboration", "Project Management" ],
        platformNames: [ "Desktop", "Command Line (CLI)", "Cross-Platform" ],
        tagNames: [ "Free", "Open Source", "Collaboration-Focused", "Advanced" ]
      },
      {
        name: "GitHub",
        description: "Web-based platform for version control and collaboration using Git.",
        imageUrl: "/images/tools/github.png",
        thumbnailUrls: { small: "/images/tools/github-small.png", medium: "/images/tools/github-medium.png", large: "/images/tools/github-large.png" },
        categoryNames: [ "Code Editors", "Collaboration", "Project Management" ],
        platformNames: [ "Web", "Desktop", "Command Line (CLI)" ],
        tagNames: [ "Free", "Paid", "Collaboration-Focused", "Advanced", "Cloud-Based" ]
      },
      {
        name: "GitLab",
        description: "Web-based DevOps lifecycle tool.",
        imageUrl: "/images/tools/gitlab.png",
        thumbnailUrls: { small: "/images/tools/gitlab-small.png", medium: "/images/tools/gitlab-medium.png", large: "/images/tools/gitlab-large.png" },
        categoryNames: [ "Code Editors", "Collaboration", "Project Management" ],
        platformNames: [ "Web", "Desktop", "Command Line (CLI)" ],
        tagNames: [ "Free", "Paid", "Collaboration-Focused", "Advanced", "Cloud-Based" ]
      },
      {
        name: "Bitbucket",
        description: "Web-based version control repository hosting service.",
        imageUrl: "/images/tools/bitbucket.png",
        thumbnailUrls: { small: "/images/tools/bitbucket-small.png", medium: "/images/tools/bitbucket-medium.png", large: "/images/tools/bitbucket-large.png" },
        categoryNames: [ "Code Editors", "Collaboration", "Project Management" ],
        platformNames: [ "Web", "Desktop", "Command Line (CLI)" ],
        tagNames: [ "Free", "Paid", "Collaboration-Focused", "Advanced", "Cloud-Based" ]
      },
      {
        name: "Sourcetree",
        description: "Free Git GUI client.",
        imageUrl: "/images/tools/sourcetree.png",
        thumbnailUrls: { small: "/images/tools/sourcetree-small.png", medium: "/images/tools/sourcetree-medium.png", large: "/images/tools/sourcetree-large.png" },
        categoryNames: [ "Code Editors", "Collaboration" ],
        platformNames: [ "Desktop" ],
        tagNames: [ "Free", "Collaboration-Focused", "Beginner-Friendly" ]
      },
      {
        name: "GitHub Desktop",
        description: "Official desktop application for GitHub.",
        imageUrl: "/images/tools/github-desktop.png",
        thumbnailUrls: { small: "/images/tools/github-desktop-small.png", medium: "/images/tools/github-desktop-medium.png", large: "/images/tools/github-desktop-large.png" },
        categoryNames: [ "Code Editors", "Collaboration" ],
        platformNames: [ "Desktop" ],
        tagNames: [ "Free", "Collaboration-Focused", "Beginner-Friendly" ]
      },
      {
        name: "GitKraken",
        description: "Cross-platform Git client.",
        imageUrl: "/images/tools/gitkraken.png",
        thumbnailUrls: { small: "/images/tools/gitkraken-small.png", medium: "/images/tools/gitkraken-medium.png", large: "/images/tools/gitkraken-large.png" },
        categoryNames: [ "Code Editors", "Collaboration" ],
        platformNames: [ "Desktop", "Cross-Platform" ],
        tagNames: [ "Paid", "Collaboration-Focused", "Advanced" ]
      },
      {
        name: "Sourcegraph",
        description: "Code search and navigation tool.",
        imageUrl: "/images/tools/sourcegraph.png",
        thumbnailUrls: { small: "/images/tools/sourcegraph-small.png", medium: "/images/tools/sourcegraph-medium.png", large: "/images/tools/sourcegraph-large.png" },
        categoryNames: [ "Code Editors", "Collaboration", "Productivity" ],
        platformNames: [ "Web", "Desktop", "Cross-Platform" ],
        tagNames: [ "Free", "Paid", "Collaboration-Focused", "Productivity", "Advanced" ]
      },
      {
        name: "CodeSandbox",
        description: "Online code editor and prototyping tool.",
        imageUrl: "/images/tools/codesandbox.png",
        thumbnailUrls: { small: "/images/tools/codesandbox-small.png", medium: "/images/tools/codesandbox-medium.png", large: "/images/tools/codesandbox-large.png" },
        categoryNames: [ "Code Editors", "Frontend Frameworks", "Prototyping" ],
        platformNames: [ "Web" ],
        tagNames: [ "Free", "Paid", "Code Generation", "Prototyping-Specific", "Web-Based" ]
      },
      {
        name: "CodePen",
        description: "Online code editor and social development environment.",
        imageUrl: "/images/tools/codepen.png",
        thumbnailUrls: { small: "/images/tools/codepen-small.png", medium: "/images/tools/codepen-medium.png", large: "/images/tools/codepen-large.png" },
        categoryNames: [ "Code Editors", "Frontend Frameworks", "Design Inspiration" ],
        platformNames: [ "Web" ],
        tagNames: [ "Free", "Paid", "Code Generation", "Web-Based", "Design Inspiration" ]
      },
      {
        name: "JSFiddle",
        description: "Online code editor and sharing platform.",
        imageUrl: "/images/tools/jsfiddle.png",
        thumbnailUrls: { small: "/images/tools/jsfiddle-small.png", medium: "/images/tools/jsfiddle-medium.png", large: "/images/tools/jsfiddle-large.png" },
        categoryNames: [ "Code Editors", "Frontend Frameworks" ],
        platformNames: [ "Web" ],
        tagNames: [ "Free", "Code Generation", "Web-Based" ]
      },
      {
        name: "StackBlitz",
        description: "Online IDE for web development.",
        imageUrl: "/images/tools/stackblitz.png",
        thumbnailUrls: { small: "/images/tools/stackblitz-small.png", medium: "/images/tools/stackblitz-medium.png", large: "/images/tools/stackblitz-large.png" },
        categoryNames: [ "Code Editors", "Frontend Frameworks", "Backend Frameworks" ],
        platformNames: [ "Web" ],
        tagNames: [ "Free", "Paid", "Code Generation", "Web-Based" ]
      },
      {
        name: "Replit",
        description: "Online coding platform and IDE.",
        imageUrl: "/images/tools/replit.png",
        thumbnailUrls: { small: "/images/tools/replit-small.png", medium: "/images/tools/replit-medium.png", large: "/images/tools/replit-large.png" },
        categoryNames: [ "Code Editors", "Frontend Frameworks", "Backend Frameworks", "Learning Platforms" ],
        platformNames: [ "Web", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Free", "Paid", "Code Generation", "Web-Based", "Learning Platforms" ]
      },
      {
        name: "Codewars",
        description: "Coding practice platform for developers.",
        imageUrl: "/images/tools/codewars.png",
        thumbnailUrls: { small: "/images/tools/codewars-small.png", medium: "/images/tools/codewars-medium.png", large: "/images/tools/codewars-large.png" },
        categoryNames: [ "Learning Platforms", "Code Editors", "Testing" ],
        platformNames: [ "Web" ],
        tagNames: [ "Free", "Paid", "Learning Platforms", "Beginner-Friendly", "Advanced", "Testing" ]
      },
      {
        name: "HackerRank",
        description: "Tech company that focuses on competitive programming challenges.",
        imageUrl: "/images/tools/hackerrank.png",
        thumbnailUrls: { small: "/images/tools/hackerrank-small.png", medium: "/images/tools/hackerrank-medium.png", large: "/images/tools/hackerrank-large.png" },
        categoryNames: [ "Learning Platforms", "Code Editors", "Testing" ],
        platformNames: [ "Web" ],
        tagNames: [ "Free", "Paid", "Learning Platforms", "Beginner-Friendly", "Advanced", "Testing" ]
      },
      {
        name: "LeetCode",
        description: "Platform for coding interview preparation.",
        imageUrl: "/images/tools/leetcode.png",
        thumbnailUrls: { small: "/images/tools/leetcode-small.png", medium: "/images/tools/leetcode-medium.png", large: "/images/tools/leetcode-large.png" },
        categoryNames: [ "Learning Platforms", "Code Editors", "Testing" ],
        platformNames: [ "Web" ],
        tagNames: [ "Free", "Paid", "Learning Platforms", "Beginner-Friendly", "Advanced", "Testing" ]
      },
      {
        name: "Canva",
        description: "Online graphic design tool.",
        imageUrl: "/images/tools/canva.png",
        thumbnailUrls: { small: "/images/tools/canva-small.png", medium: "/images/tools/canva-medium.png", large: "/images/tools/canva-large.png" },
        categoryNames: [ "Graphic Design", "UI Design", "Marketing" ],
        platformNames: [ "Web", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Free", "Paid", "Beginner-Friendly", "Marketing", "Design Inspiration" ]
      },
      {
        name: "Piktochart",
        description: "Infographic and presentation maker.",
        imageUrl: "/images/tools/piktochart.png",
        thumbnailUrls: { small: "/images/tools/piktochart-small.png", medium: "/images/tools/piktochart-medium.png", large: "/images/tools/piktochart-large.png" },
        categoryNames: [ "Graphic Design", "Marketing", "Analytics" ],
        platformNames: [ "Web" ],
        tagNames: [ "Paid", "Beginner-Friendly", "Marketing", "Analytics", "Data Visualization" ]
      },
      {
        name: "Venngage",
        description: "Infographic and design platform.",
        imageUrl: "/images/tools/venngage.png",
        thumbnailUrls: { small: "/images/tools/venngage-small.png", medium: "/images/tools/venngage-medium.png", large: "/images/tools/venngage-large.png" },
        categoryNames: [ "Graphic Design", "Marketing", "Analytics" ],
        platformNames: [ "Web" ],
        tagNames: [ "Paid", "Beginner-Friendly", "Marketing", "Analytics", "Data Visualization" ]
      },
      {
        name: "Visme",
        description: "Visual content creation platform.",
        imageUrl: "/images/tools/visme.png",
        thumbnailUrls: { small: "/images/tools/visme-small.png", medium: "/images/tools/visme-medium.png", large: "/images/tools/visme-large.png" },
        categoryNames: [ "Graphic Design", "Marketing", "Analytics" ],
        platformNames: [ "Web" ],
        tagNames: [ "Paid", "Beginner-Friendly", "Marketing", "Analytics", "Data Visualization" ]
      },
      {
        name: "Google Slides",
        description: "Presentation program.",
        imageUrl: "/images/tools/google-slides.png",
        thumbnailUrls: { small: "/images/tools/google-slides-small.png", medium: "/images/tools/google-slides-medium.png", large: "/images/tools/google-slides-large.png" },
        categoryNames: [ "Graphic Design", "Collaboration", "Productivity" ],
        platformNames: [ "Web" ],
        tagNames: [ "Free", "Beginner-Friendly", "Collaboration-Focused", "Productivity" ]
      },
      {
        name: "Microsoft Powerpoint",
        description: "Presentation program.",
        imageUrl: "/images/tools/powerpoint.png",
        thumbnailUrls: { small: "/images/tools/powerpoint-small.png", medium: "/images/tools/powerpoint-medium.png", large: "/images/tools/powerpoint-large.png" },
        categoryNames: [ "Graphic Design", "Collaboration", "Productivity" ],
        platformNames: [ "Desktop", "Web", "Mobile (iOS)", "Mobile (Android)" ],
        tagNames: [ "Paid", "Beginner-Friendly", "Collaboration-Focused", "Productivity" ]
      },
      {
        name: "Keynote",
        description: "Presentation software application.",
        imageUrl: "/images/tools/keynote.png",
        thumbnailUrls: { small: "/images/tools/keynote-small.png", medium: "/images/tools/keynote-medium.png", large: "/images/tools/keynote-large.png" },
        categoryNames: [ "Graphic Design", "Collaboration", "Productivity" ],
        platformNames: [ "Desktop", "Mobile (iOS)", "Web" ],
        tagNames: [ "Paid", "Beginner-Friendly", "Collaboration-Focused", "Productivity" ]
      },
      {
        name: "Prezi",
        description: "Presentation software.",
        imageUrl: "/images/tools/prezi.png",
        thumbnailUrls: { small: "/images/tools/prezi-small.png", medium: "/images/tools/prezi-medium.png", large: "/images/tools/prezi-large.png" },
        categoryNames: [ "Graphic Design", "Collaboration", "Productivity", "Animation" ],
        platformNames: [ "Web", "Desktop" ],
        tagNames: [ "Paid", "Beginner-Friendly", "Collaboration-Focused", "Productivity", "Animation" ]
      },
      // ... Continue adding more tools to reach ~100. Aim for diversity across categories and platforms ...
      // ... (Examples - you'll need to expand this list significantly) ...
      // ... (Consider tools like: Sketchbook, Procreate, Figma FigJam, Miro, Mural, Google Jamboard, Asana, Monday.com, Slack Alternatives, Discord Alternatives, etc.) ...

    ];

    // ------------------------------------------------------------------
    // 4. Insert Tools and their Relationships
    // ------------------------------------------------------------------

    console.log( "Inserting Tools and Relationships..." );
    for ( const tool of toolData ) {
      const existingTool = await db.query.tools.findFirst( {
        where: eq( tools.name, tool.name )
      } );

      let createdTool;
      if ( !existingTool ) {
        createdTool = await db.insert( tools ).values( {
          name: tool.name,
          description: tool.description,
          imageUrl: tool.imageUrl,
          thumbnailUrls: tool.thumbnailUrls,
        } ).returning(); // Get the inserted tool back to access its ID
      } else {
        createdTool = [ existingTool ]; // Wrap existing tool in array to match .returning() format
      }

      if ( createdTool && createdTool[ 0 ] ) {
        const toolId = createdTool[ 0 ].id;

        // Insert Tool-Category Relationships
        if ( tool.categoryNames ) {
          for ( const categoryName of tool.categoryNames ) {
            const category = await db.query.categories.findFirst( {
              where: eq( categories.name, categoryName )
            } );
            if ( category ) {
              const existingTCP = await db.query.toolCategoryPlatform.findFirst( {
                where: and( eq( toolCategoryPlatform.toolId, toolId ), eq( toolCategoryPlatform.categoryId, category.id ) )
              } );
              if ( !existingTCP ) {
                await db.insert( toolCategoryPlatform ).values( {
                  toolId: toolId,
                  categoryId: category.id,
                  platformId: ( await db.query.platforms.findFirst( { where: eq( platforms.name, tool.platformNames?.[ 0 ] || 'Web' ) } ) )?.id || predefinedPlatforms[ 0 ].id // Default to first platform if no platformNames or platform not found. Adjust default as needed.
                } );
              }
              if ( tool.platformNames && tool.platformNames.length > 0 ) {
                for ( const platformName of tool.platformNames ) {
                  const platform = await db.query.platforms.findFirst( {
                    where: eq( platforms.name, platformName )
                  } );
                  if ( platform ) {
                    const existingTCPPlatform = await db.query.toolCategoryPlatform.findFirst( {
                      where: and( eq( toolCategoryPlatform.toolId, toolId ), eq( toolCategoryPlatform.categoryId, category.id ), eq( toolCategoryPlatform.platformId, platform.id ) )
                    } );
                    if ( !existingTCPPlatform ) {
                      await db.insert( toolCategoryPlatform ).values( {
                        toolId: toolId,
                        categoryId: category.id,
                        platformId: platform.id,
                      } );
                    }
                  }
                }
              }


            }
          }
        }

        // Insert Tool-Tag Relationships
        if ( tool.tagNames ) {
          for ( const tagName of tool.tagNames ) {
            const tag = await db.query.tags.findFirst( {
              where: eq( tags.name, tagName )
            } );
            if ( tag ) {
              const existingToolTag = await db.query.toolTags.findFirst( {
                where: and( eq( toolTags.toolId, toolId ), eq( toolTags.tagId, tag.id ) )
              } );
              if ( !existingToolTag ) {
                await db.insert( toolTags ).values( { toolId: toolId, tagId: tag.id } );
              }
            }
          }
        }
      }
    }

    console.log( "✅ Database seeding complete!" );
  } catch ( error ) {
    console.error( "Database seeding failed:", error );
  }
}

seedDatabase();
