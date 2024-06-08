# Front End Design Documentation

## Goals + Overview
- Primary goal was to keep it reasonably simple and leverage as much premade react components as possible 
- Functionality > asthetics.
- Limiting latency and easy to debug

This led to some interesting desgin choices, combined with a time crunch and lack of any javascript instruction meant most of front end was hacked together. The major libraries that saved the frontend were react-router and react-bootstrap. These allowed me to quickly set up a reasonable framework. Unfortunately I had to then tear down most this and re-implement it with better routing functions so that I could confirm only authenticated users could sign in

## Routing Documentation

### Route: /
This displays all the rooms a user is currently in, as well as the navbar.

Respective Files:
- [nav.tsx](nav.tsx)
- [home.tsx](home.tsx)

### Route: /home
See above

### Route: /login
Super simple, just loads the navbar for unauthed users.

Respective Files:
- [nav.tsx](nav.tsx)
### Route: /room/:roomID
Actual chat room. This is by far the most complex view. It has message sending/ deletion and handles real time updates from socketIO. 

Respective Files:
- [try_new_chat.jsx](try_new_chat.jsx)
### Route: /newroom

Respective Files:
- [room_form.tsx](room_form.tsx)
### Route: /invite/:inviteLink
Displays a bootstrap modal with room name, # of members, and a button to join + redirect to a room.

Respective Files:
- [join_room.tsx](join_room.tsx)

### Route: /addcontact/:userId
Displays a bootstrap modal with username and buttons to click to add contact.

Respective Files:
- [add_contact.tsx](add_contact.tsx)

### Route: /myaccount
This functionally does nothing and is inacessible from the UI. It was intended to be able to edit profile information, but not implemented.

### Route: /admin/:roomID
This is the route for the administration panel. Currently the only option is to delete the room. Non admins will be redirected to home if they try to access this.

Respective Files:
- [room_admin_panel.tsx](room_admin_panel.tsx)


### Route: *
Our general/wildcard route. Same as home and /