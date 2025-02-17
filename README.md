# Discovery5

Only source for many sources. This project is for designers and developers to find the sources for their work, productivity etc....

API Tracking Sheet: (<https://docs.google.com/spreadsheets/d/1ZXrV4rfh6gRWfo0UsQnCbY8EwBQRPluwjBGjzcN7Wh8/edit?usp=sharing>)

---

## **Why Discovery5?**

Yes, there are many tools like this, but **Discovery5** stands out because:

1. **Simplicity**: It’s designed to be **minimal and modular**, avoiding unnecessary complexity.
2. **No Gimmicks**: No ads (except for one or two sponsors) and no bloated features.
3. **Modern Interface**: A clean, intuitive, and customizable UI tailored for today’s users.
4. **Open Source**: Anyone can contribute, making it a community-driven project.

---

### **Key Features**

- **Modular Design**: Pick and choose only the features you need.
- **Customisable**: Adapt the tool to fit your workflow.
- **Transparent**: Open-source with a focus on community collaboration.

---

### **Join Us**

If you’re looking for a simpler, modern, and open-source alternative, **Discovery5** is for you. Contribute, customize, and make it your own!

---

# Roadmap for Discovery5

## - Phase 1: Planning & Validation

- [x] Define Discovery5
  - Identify the purpose, target audience, and key goals of the project.
- [x] Wireframe Key User Flows
  - Sketch out the main workflows, including authentication, search, and course management.
- [x] Validate with Friends
  - Present the idea to friends and gather feedback for refinement.

---

## - Phase 2: Design System & Landing Page

- [ ] Create a Scalable Design System in Figma and share (creating...)
- [x] Design and Build the Landing Page
- [x] Waitlist Page Integration
  - Integrate the waitlist page with PocketBase for collecting user emails.
- [x] Test Waitlist Functionality
- [x] Make the Waitlist Public [Click here](https://www.prootv.pro)

---

## - Phase 3: Core Feature Development

- [ ] Tech Stack Decisions
  - Finalise decisions on authentication (e.g., Clerk, OpenAuth, or custom), backend (Node.js or Deno), and database(not sure yet).
- [x] Database Ideation and Design
  - Brainstorm and Design schema for the database
- [x] Build Database
  - Build the database using the designed schema
- [x] Build Authentication Flow
- [ ] Design Core Interfaces
  - Build interfaces for Home, Authentication, Search, Explore, Add/Request Form, Trending, User Personal Collection etc.
- [ ] Code Core Interfaces
- [ ] Design and Code the SuperAdmin Panel
  - An admin interface for managing users, tools, and requests.

---

## - Phase 4: Backend Integration

- [ ] Set Up APIs
  - Build backend APIs to support frontend functionality, Node.js (or Deno) and a database like PostgreSQL or Neon.
- [ ] Connect Frontend to Backend
- [ ] Implement Basic Search
  - Add search functionality for finding tools

---

## - Phase 5: Testing & Iteration

- [ ] Manual Testing
- [ ] Invite Beta Testers
  - Share the app with beta users and gather detailed feedback.
- [ ] Iterate Based on Feedback
  - Refine features and fix issues reported during beta testing.

---

## - Phase 6: Launch Prep

- [ ] Optimise Performance with experienced developers help
- [ ] Set Up Monitoring
  - Implement monitoring tools to track app performance and user activity.
- [ ] Launch Publicly
  - Release the application for public use guessing March 31st.

---

# Tech Stacks

Here’s a **simple table** summarizing the **final tools** and **alternative options** for your project. I’ve categorized them based on your preferences and goals:

| **Category**        | **Final Tool**            | **Alternative Options**                      | **Notes**                                                                |
| ------------------- | ------------------------- | -------------------------------------------- | ------------------------------------------------------------------------ |
| **Frontend**        | React + Vite + TypeScript | Next.js, SvelteKit                           | Vite is faster for development; Next.js offers SSR/SEO benefits.         |
| **UI Library**      | Radix Primitives          | Shadcn UI, Chakra UI, Mantine                | Radix is headless; pair with Tailwind for custom styling.                |
| **CSS Framework**   | Tailwind CSS              | Styled Components, Emotion, SCSS             | Tailwind is designer-friendly and integrates well with Radix.            |
| **Authentication**  | Auth.js (NextAuth.js)     | Clerk, Firebase Auth, Supabase Auth          | Auth.js is flexible and supports OAuth providers (GitHub, Google, etc.). |
| **Database**        | PostgreSQL (self-hosted)  | Supabase, Firebase Firestore, Turso          | PostgreSQL is relational; Supabase adds real-time features.              |
| **Backend**         | Node.js + Express         | NestJS, Fastify, Serverless (Vercel/Netlify) | Node.js is lightweight; NestJS adds structure for larger apps.           |
| **Analytics**       | Sentry                    | LogRocket, Plausible, Vercel Analytics       | Sentry is great for error tracking; Plausible is privacy-focused.        |
| **Admin Dashboard** | Custom (Radix + Tailwind) | Tremor, Refine, Mantine Admin                | Build your own for full control; use prebuilt tools for speed.           |
| **Deployment**      | Vercel                    | Netlify, Render, Fly.io                      | Vercel integrates seamlessly with React/Vite and offers serverless APIs. |
| **Component Docs**  | Storybook                 | Docz, Docusaurus                             | Storybook is the industry standard for documenting components.           |
| **Real-Time**       | Ably                      | Pusher, Socket.IO                            | Ably is scalable and easy to integrate; Socket.IO is self-hostable.      |

# Features

I will update this on Sunday 26th January 2025.

# ChangeLog

## January 24, 2024

- **Database Migration**: Switched from PocketBase to NeonDB with DrizzleORM

  - Better type safety with DrizzleORM
  - Easy and free tier is avaliable

- **Analytics Integration**: Added Vercel Analytics
  - Temporary solution for basic usage tracking
  - Zero-configuration setup
  - Note: Will migrate to Sentry once MVP is ready for enhanced error tracking and monitoring

## January 28, 2024

- **Database Design**: ERD representation of the Project's DB

## January 29, 2024

- **Database Schema**: Updated DB schema with new tables and relationships

## January 30, 2024

- Trasnfer Frontend in separate directory
- Create Backend directory - techstack Fastify + TypeScript

## February 4, 2024

- Express, JWT auth setup
- Basic CRUD API plan

## Februrary 7, 2024

- JWT auth setup complete
- Working Login Interface (shit ui btw)
- Access Token + Refresh Token setup
- seprate branch for waitlist

## February 16, 2025

- Add new tables (recycle bin, user tool bin, user collection bin) with schema
- Changed isApproved to toolApprovalStatus (Bool -> Enum)
- Seed the database with predefined categories, platforms, and tags

## February 17, 2025

- Simple API Guidelines
- Platform API
- API Helpers
- API Response Types
- API Error Handling
- Pagination, Sorting, Filtering
- Spreadsheet Maintaince for API development and tracking (<https://docs.google.com/spreadsheets/d/1ZXrV4rfh6gRWfo0UsQnCbY8EwBQRPluwjBGjzcN7Wh8/edit?usp=sharing>)
