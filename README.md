# Rooms.chat
Group Project for CS314@pdx.edu
Repository found at: https://github.com/DarbyBurbidge/rooms.chat/tree/dev


## Overview
Rooms.chat is an instant messenger app for students and teachers to create places for people to communicate and collaborate on anything that interests them.

The app utilizes Node.js, Express, and Socket.IO to manage business logic and provide live updates. The app uses MongoDB Atlas to manage persistence. The front end client uses React and Vue to manage user actions and provide a responsive Single Page Application for the user.

### Cloning
1. git clone https://github.com/DarbyBurbidge/rooms.chat.git
2. checkout branch dev: git checkout dev
3. Good to go.

## First time setup
From the rooms.chat directory
### Backend

NOTE: The backend uses a handful of environment variables that are not in the repo
These include:
##### URI's for MongoDB Atlas:
TEST_URI
DEV_URI
PROD_URI
##### Google OAuth keys:
CLIENT_ID
CLIENT_SECRET

NOTE: It is suggested that you use your own.
Google: https://console.cloud.google.com/
MongoDB Atlas: https://www.mongodb.com/products/platform/atlas-database

#### Other .env variables
##### Redirect Urls
OAUTH_REDIRECT_URL=https://localhost:3000/oauth - This is the url of the backend endpoint that google Oauth uses
FE_REDIRECT_URL=https://localhost:5173/home - This is the url that the user is redirected to on the front end after login/registration


#### Backend Setup
```sh
cd backend
yarn install
```
#### Backend Commands
##### Run prod
This command compiles the typescript and runs it
```sh
yarn run prod
```
##### Run dev
This command runs a development version of the code with live updates using nodemon
```sh
yarn run dev
```
##### Run Testing
Runs backend test suite
```sh
yarn run test
```

other commands can be found in package.json

### Frontend Installation
```sh
cd frontend
yarn install
yarn run dev
```
### Frontend Testing Installation
```
cd frontend/frontEndTests
```
It is best practice to use a virtualenv 
```
pip install -r requirements.txt
```
Finally edit the /backend/.env with your PSU credentials
```
TEST_USERNAME=<YOUR USERNAME>
TEST_PASSWORD=<YOUR PASSWORD>
```
other commands can be found in package.json

## Backend Design
The backend design was focused on security and data consistency. The backend utilizes Google Oauth to provide authentication and authorization. It uses middleware that checks the users authorization token is valid and then links data in that token to the users profile. Another security decision we made was the decision to make Express calls to the backend api to generate messages rather than broadcast messages directly into client rooms. The backend takes a message request from the client, processes that message, spawns a notification, and then the backend broadcasts that message and notification to the necessary clients. This choice allows for data sanitization so users aren't able to inject malicious code into other users clients as easily. When considering data consistency, we made a decision to make it so that any time a resolver modifies more than one thing in the database, it is handled atomically using mongodb Sessions and Transactions. This ensures there are no dangling references in the database to missing objects.

## Backend Testing
When creating our test plan it became apparent that a refactor was necessary. Originally each endpoint effectively did all database operations itself. This was ultimately split between resolvers and routes. Resolvers processed transactions and interact with the database while routes process data from the request and make sure it's safe to be handed to the resolvers. This allowed a test plan that allows for testing database transactions seperately from endpoint tests. Currently there are only unit tests for the resolvers, however the refactor allows for future testing over each endpoint listed in the API.

### API Documentation:

Authorization Errors return 401 Unauthorized
Other Errors return as a 500 Server Error
Success returns 200 OK

On open, the backend links the client to the users googleId, then passes notifications to the user via that 'room.'
It also attaches a clients socket to their rooms, allowing them to receive immediate live updates.

#### Object interfaces:
Room:
```
{
	_id: string,
	creator: User,
	admins: User[],
	users: User[],
	messages: Message[],
	inviteUrl: string
}
```
Message:
```
{
	_id: string,
	sender: string,
	content: string,
	createTime: string,
	editTime?: string,
}
```
User:
```
{
	_id: string,
	googleId: string,
	family_name: string,
	given_name: string,
	imageUrl: string,
	rooms: string[],
	notifications: string[],
	contacts: string[]
}
```
Notification:
```
{
	_id: string,
	message: string,
	type: string,
	url: string,
	read: boolean
}
```

#### Services
The project is broken up into a 6 major services: Account/OAuth, Users, Contacts, Rooms, Messages, Notifications.

### OAuth

#### GET /oauth
used by google to handle access/refresh tokens
account/login redirects here on consent

### Account
The Account service provides the user a way to view and manipulate their personal account

#### POST /account/login
uses google oauth api to login/register a user

#### DELETE /account/delete
deletes the current user from the database

#### GET /account/info
uses current user to retrieve user account info and settings

### Room
The Room service is the backbone of the app, allowing the user to create, delete, and query rooms, among other features

#### POST /room/create
creates a room in the database adds the current user as the creator
```
takes: {
	"name": string
}
```
```
return: {
	"room": {
		"roomCode": string
    }
}
```

#### DELETE /room/delete/:roomId
deletes a room that the user has created
```
return: OK, Server Error, or Unauthorized
```

#### GET /room/link/:roomId
retreives an invite link for the given room
```
return: {
	"inviteUrl": string
}
```

#### PUT /room/join/:roomId
joins the clients account to the room associated with the roomId
then adds the clients socket to the socket room instance
```
return: OK, Server Error, or Unauthorized
```

#### PUT /room/leave/:roomId
removes the user from the chatroom
disconnects the client socket from the socket room instance
returns the room so the room data can be updated on the client side
```
return: OK, Server Error, or Unauthorized
```

#### GET /room/list
retrieves a list of rooms accessible by the current user
```
return: {
	"rooms": Room[]
}
```

#### GET /room/info/:roomId
shows details about a room such as who the creator/admins are
```
return: {
	"room": Room
}
```

### User
The User service allows the current user to query for and invite any user on the platform

#### GET /user/search?username=<user>
searches users by username 
matches against either given_name or family_name
```
return: {
	"users": User[]
}
```

#### GET /user/id?id=<userId>
searches users by id
```
return: {
	"user": User
}
```

#### PUT /user/invite/:userId/:roomId
sends an invite to a specific user for the specified room
```
return: OK, Server Error, or Unauthorized
```

### Contact (User)
The Contact service provides a default list of users for so the user can invite them more easily
#### GET /contact/list
retrieves the list of contacts for the current user
```
return: {
	"contacts": User[]
}
```

#### PUT /contact/add/:userId
adds a user to the current users list of contacts
```
return: {
	"contacts": User[]
}
```

#### DELETE /contact/delete/:userId
removes a user from current users list of contacts

### Notification
Notifications are generated on by the backend by other events and endpoints, this service is to manage Notifications after creation
#### PUT notification/read/:noteId
marks a notification with the given noteId as read
```
return: OK, Server Error, or Unauthorized
```

#### DELETE notification/delete/:noteId
deletes a notification with the given Id
```
return: OK, Server Error, or Unauthorized
```

### Message
Messages are passed back and forth from client to client through the backend message service.

#### POST /message/create/:roomId
reads message content from the req body, then broadcasts that message on behalf of the user
```
takes: {
	"content": string
}
```
```
return: {
	"message": Message
}
```

#### PUT /message/edit/:messageId
takes a content string from the request body and modifies the message in the database. Also broadcasts the update to other clients in the room
```
takes: {
	"content": string
}
```
```
return: {
	"message": Message
}
```

#### DELETE /message/delete/:messageId 
deletes the message from the database
```
return: OK, Server Error, or Unauthorized
```

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

