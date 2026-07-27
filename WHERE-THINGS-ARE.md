# Where Things Are

A plain-English map of your website. Almost everything lives in one file:
**src/routes/index.tsx**

To open any of these files, just find it in your code editor's file list on the left and click it.

## Homepage hero (the big intro text at the very top of the page)
File: **src/routes/index.tsx**
Look for the line that says `id="top"` (around line 267). This is the very first section people see.

## Header / Nav (the bar at the top with your name and menu links: About, Experience, Projects, Skills, Contact)
File: **src/routes/index.tsx**
Look for the line that starts with `<header` (around line 236). The menu links themselves are listed a bit higher up in a list called `nav`.

## About section
File: **src/routes/index.tsx**
Look for the line that says `id="about"` (around line 320).

## Projects section ("Things I've built")
File: **src/routes/index.tsx**
Look for the line that says `id="projects"` (around line 389). Just above that section, there's a list called `projects` — that's where each project card's title, description, tags, and link live. To add/edit a project, edit that list.

## Skills section
File: **src/routes/index.tsx**
Look for the line that says `id="skills"` (around line 451).

## Contact form
File: **src/routes/index.tsx**
Look for the line that says `id="contact"` (around line 492). This is the section with the form fields (name, email, message).

Note: when someone submits the contact form, it sends the message using a separate file:
**src/routes/api/contact.ts**
You'd only need to touch this file if you want to change how/where the email gets sent (it uses Resend).

## Footer (the bottom of the page)
File: **src/routes/index.tsx**
Look for the line that starts with `<footer` (around line 606).

## Colors / Theme (site-wide colors like the navy and teal accent color, light/dark mode)
File: **src/styles.css**
Look for lines starting with `--` like `--background`, `--primary`, `--accent` (around lines 32-43 for light mode, and around lines 108-119 for dark mode). These use a color format called "oklch" — you can tweak the numbers to shift the color, but it takes some trial and error.

## A couple of extra files worth knowing about
- **public/llms.txt** — a short plain-text summary of your site's pages, used by AI tools. Update this if you add/remove a whole page or major section.
- **src/components/portfolio-chat.tsx** — the little "Ask about Saphin" chat widget in the corner of the site, including its canned answers.
- **src/routes/__root.tsx** — page title, meta description, and social preview image (the "og:image") for search engines and link previews.
