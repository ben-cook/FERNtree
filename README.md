
# FERNtree

<p align="left">
  <img src="https://github.com/ben-cook/FERNtree/blob/main/src/components/logoBlack.svg"  width="300" >
</p>

FERNtree is a personal CRM which can be used by anyone looking to manage their contacts.

FERNtree was made as part of COMP30022 IT Project @ Unimelb. It is currently live at https://ferntree.web.app.

Tutor: Thomas Bowes (t.bowes@unimelb.edu.au)
Client: Gaoli Yi


## Table of contents
* [Team Members](#team-members)
* [Quick Start Guide](#quick-start)
* [Documentation](#documentation)
* [Requirements](#requirements)
* [Front End Technologies](#front-end-technologies)
* [Back End Technologies](#back-end-technologies)
* [Testing](#testing)
* [Licensing](#licensing)

<a name="team-members"></a>
## Team Members
| Name | Role | GitHub Profile |
| :---         |     :---:      |          ---: |
| Wen Yee Ang  | SCRUM Master     |  https://github.com/wenyee-ang |
| Ivy Brain    | Fullstack Developer      |  https://github.com/ivybrain |
| Ben Cook    | Frontend Lead      |  https://github.com/ben-cook |
| Julie Zenou  | Design & UI Lead      |  https://github.com/Joooolie |
| Liam Harding  | Backend Lead      |  https://github.com/kinderdropout |

<a name="quick-start"></a>
## Quick Start Guide

To run FERNtree locally, clone this repository and install dependencies with `yarn`.
Then, run the app with `yarn start`.
For more information about the dependencies used in this project, refer to [package.json](https://github.com/ben-cook/FERNtree/blob/main/package.json).

<a name="documentation"></a>
## Documentation

All project documentation for Ferntree is stored here: https://ferntree.atlassian.net/wiki/spaces/IPF/overview

<a name="requirements"></a>
## Requirements

We completed all main requirements requested by our client, including creating a web application that allows a user to use basic CRM functionality such as:
- Create an account and login.
- Create and edit a user profile.
- Add and edit contacts.
- View contacts, altogether and individually.
- Search for contacts.

Beyond this, we also completed several additional requirements that we proposed to the client (and which were subsequently approved) to improve the utility of the application. These included:
- To create and assign user-defined contact ‘categories’, allowing contact records to hold more specific information.
- To assign ‘tags’ to individual contacts, allowing smaller, miscellaneous information to be stored.
- To allow filtering on both tags and categories on top of the basic search functionality.
- Dark mode.
- Ability to switch to List View, and sort contacts in a list, on the main page.

A summary of completed requirements can be found here:
https://ferntree.atlassian.net/wiki/spaces/IPF/pages/1409429/Summary+of+Requirements


<a name="front-end-technologies"></a>
## Front End Technologies

### Typescript 
- We found great value in using Typescript instead of Javascript in our project for the type-safety and the ability to catch bugs at compile time and in the CI pipeline.

### React
- React is our chosen JavaScript library for building our CRM Web App for this project. 

### Material UI:
- We used the MUI library of React componenets extensively in this project to create a clean, professional-looking web application efficiently. 
- Please note that this project used MUI Version 4. More information can be found here: https://v4.mui.com/ 

### Prettier:
- Prettier formats your code for you, so that we all have consistent formatting. If you use vscode, it’s set up for you, but otherwise please try to configure your editor for prettier! More information here: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode  

### ESLint:
- ESLint lints your code and tells you if you’re making mistakes or not following the style guidelines for the project. Your code will still compile and work, but ESLint will complain in the console.
- ESLint has also been integrated into our CI pipeline to run with every push request. This ensures that we are not merging code that doesn’t adhere to the code style guidelines of our project.
- To fix ESLint warnings, either fix your code as it tells you to, or disable the rule in [.eslintrc](https://github.com/ben-cook/FERNtree/blob/main/.eslintrc).

### Formik
- Formik is a tool  used for building forms in React. Formik takes care of the repetitive and annoying stuff—keeping track of values/errors/visited fields, orchestrating validation, and handling submission.
- We integrated Formik with Material UI, using it to collect data about the user and their contacts. Ivy Brain created a Formik wrapper in order to cater to the dynamic needs of our Category feature (where the information collected for each contact differs according to their assigned category).
 
### Gravatar
- Gravatar is a service for providing globally unique avatars. If a contact's email address is associated with a Gravatar, this is automatically used as the contact's profile image.
 

<a name="back-end-technologies"></a>
## Back End Technologies

### Firebase
- We decided to use Google’s Firebase backend instead of the more conventional MERN stack.
- The serverless nature of a cloud backend service allows our application to scale up and down automatically with the needs of our users, which allows our application to potentially serve millions of users if need be.
- Firestore, one of the NoSQL database options offered through Firebase, was used in our project, because it allowed us to easily add user-defined fields and values into our database.

More information about our backend can be found in our API Documentation here: https://ferntree.atlassian.net/wiki/spaces/IPF/pages/35455376/API+Documentation


<a name="testing"></a>
## Testing

### Cypress & Firebase Emulator
FERNtree uses Cypress for end-to-end testing, and Firebase Emulator for backend testing. More information can be found here: https://ferntree.atlassian.net/wiki/spaces/IPF/pages/230070/Testing

To test FERNtree locally, make sure you have all dependencies installed then open Cypress with `yarn cypress`. From here, you can select which tests you wish to run.


<a name="licensing"></a>
## Licensing
More information to be added.
