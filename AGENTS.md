# AGENTS.md
This file is provided for the benefit of OpenAI Codex.

## Project Goal
Create a purely client-side HTML/CSS/JS, web-hosted frontend which enables the user to add and edit family members.
* The user can add, edit, and delete people.
* Relationships between people can be selected.
* The uer can "Save" and "Open" a .json file with the table information.

The project will be hosted on github.io.

## Project Details

### User Details to Track
When the user adds a person, they should be able to direclty enter:
* First Names
* Lsat Names
* Birthdate (YYYY, YYYY-MM, or YYYY-MM-DD format)
* Death (YYYY, YYYY-MM, or YYYY-MM-DD format)
* Birth location
* Death location
* Gender

Once the person is added, their record should be given a numeric integer ID number. 

### Editing details
Once the user is added the user can edit the person to select the parent and partner. The parent and partner should be selectable by pull-down menu showing:
* ID number
* Last names
* First names
* Date of Birth
* Date of Death

## Repository Layout
* Place all web-facing files in the /web/ folder.

### Web Folder Structure
* /web/index.html - Main page
* /web/style.css - Custom CSS
* /web/app.js - App JS
* /web/app-<module>.js - Independent components as-needed

## To Deploy
A GitHub automatin is implemented to automatically host the /web/ folder. 

## Technical Standards
* All user interfaces must meet WCAG 2.1 AA.
* Implement with HTML or CSS features before implementing with JavaScript

## User Experience
* Use a neutral color theme
* Primary action buttons should have light text on dark background
* Secondary action buttons should have dark text on light background
* Use Tailwind as a user interface, theaming and component system
* Use both icons and labels for items a user will interact with
