# Notion Clone | Note Taking App

Clone of Notion Note Taking App. This clone covers the core fundamental features of Notion and what it was designed for
**Status: In Progress** (This project is currently in Progress)

![Alt text](public/welcome-page.png)

## Technologies

- Next.js
- Convex (Backend 🪛)
- TypeScript
- TailwindCSS

## Features Covered

The system includes a real-time database for dynamic content updates, a Notion-style editor for versatile document creation, and support for both light and dark modes. Users can manage an infinite number of child documents, with options for trash and soft delete, as well as file upload, deletion, and replacement. Document icons update in real-time, and the interface features an expandable and collapsible sidebar. The platform is fully mobile-responsive, allows publishing notes to the web, and includes a landing page with a cover image for each document. Additionally, users can recover deleted files.

## How to run the project

- git clone **git@github.com:stevendaye/notion-clone.git**
- cd notion-clone
- npm i
- npx convex dev (in one terminal)
- npm run dev (in another terminal)

**NB**: Environment variables are required for Convex and Clerck. Have a look at **https://docs.convex.dev/home** and **https://clerk.com/docs**. Follow instructions to get yours.
