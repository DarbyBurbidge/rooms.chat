# Front End Design Documentation

## Goals + Overview
- Primary goal was to keep it reasonably simple and leverage as much premade react components as possible 
- Functionality > asthetics.
- Limiting latency and easy to debug

This led to some interesting desgin choices, combined with a time crunch and lack of any javascript instruction meant most of front end was hacked together. The major libraries that saved the frontend were react-router and react-bootstrap. These allowed me to quickly set up a reasonable framework. Unfortunately I had to then tear down most this and re-implement it with better routing functions so that I could confirm only authenticated users could access certain views. 

## Routing Documentation

### Route: /
This displays all the rooms a user is currently in, as well as the navbar.

Respective Files:
- [nav.tsx](frontend/src/nav.tsx)
- [home.tsx](frontend/src/home.tsx)

### Route: /home
See above

### Route: /login
Super simple, just loads the navbar for unauthed users.

Respective Files:
- [nav.tsx](frontend/src/nav.tsx)
### Route: /room/:roomID
Actual chat room. This is by far the most complex view. It has message sending/ deletion and handles real time updates from socketIO. 

Respective Files:
- [try_new_chat.jsx](frontend/src/try_new_chat.jsx)
### Route: /newroom

Respective Files:
- [room_form.tsx](frontend/src/room_form.tsx)
### Route: /invite/:inviteLink
Displays a bootstrap modal with room name, # of members, and a button to join + redirect to a room.

Respective Files:
- [join_room.tsx](frontend/src/join_room.tsx)

### Route: /addcontact/:userId
Displays a bootstrap modal with username and buttons to click to add contact.

Respective Files:
- [add_contact.tsx](frontend/src/add_contact.tsx)

### Route: /myaccount
This functionally does nothing and is inacessible from the UI. It was intended to be able to edit profile information, but not implemented.

### Route: /admin/:roomID
This is the route for the administration panel. Currently the only option is to delete the room. Non admins will be redirected to home if they try to access this.

Respective Files:
- [room_admin_panel.tsx](frontend/src/room_admin_panel.tsx)


### Route: *
Our general/wildcard route. Same as home and /

## Component Documentation

### App in [App.tsx](frontend/src/App.tsx)
Main screen. Needed for vite. If you have to edit this you have messed up.
### Login in [login.tsx](frontend/src/login.tsx)
This is deprecated.
### NavScroll in [nav.tsx](frontend/src/nav.tsx)
Essential component. Handles login functionality(Handing off to oauth) as well as linking to room creation, and all contact functionality
### HomeMenu in [home.tsx](frontend/src/home.tsx)
Gets and renders all rooms + the last message sent in each room. This requires 3 requests per room which is excessive. An update should minimize these calls if possible.
### RoomForm in [room_form.tsx](frontend/src/room_form.tsx)
This is the room creation form. Currently just a text box for name and a button to submit. Used to call contacts but some bugs + lack of utility since adding contacts wasn't added, so currently there is no requests associated with this component. 
### Tester in [try_new_chat.jsx](frontend/src/try_new_chat.jsx)
The name in this should refactored as its not very descriptive. 
Displays a chat room. Requires 1 + number of users in chat requests to show user info. Further updates should minimize this as well as add additional information
### JoinModal in [join_room.tsx](frontend/src/join_room.tsx)
A bootstrap modal component which allows users to join a room that they received an invite to. This actually uses a lot of requests 1 + number of users to display images.
### AddContactModal in [add_contact.tsx](frontend/src/add_contact.tsx)
A bootstrap modal component which allows for adding a contact. Only has one request unless an action is taken.
### AccountPage in [my_account.tsx](frontend/src/my_account.tsx)
Deprecated
### AdminPanel in [room_admin_panel.js](frontend/src/room_admin_panel.js)
This component currently only contains a button to delete a room. Future updates should add user removal functionality.