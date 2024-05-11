# rooms.chat
Group Project for CS314@pdx.edu

### Cloning
1. git clone https://github.com/DarbyBurbidge/rooms.chat.git
2. checkout branch dev: git checkout dev
3. Good to go.

## First time setup
From the rooms.chat directory
### backend
```sh
cd backend
yarn install
yarn run dev
```
other commands can be found in package.json

### frontend
```sh
cd frontend
yarn install
yarn run dev
```
other commands can be found in package.json

## API Documentation:

api uses METHOD thingAction notation:

### Account

#### PUT /account/login
uses google oauth api to login a user

#### GET /account/info

### Room

#### PUT /room/create
creates a room

#### DELETE /room/delete?=roomId
deletes a room that the user has created

#### GET /room/list
retrieves a list of rooms accessible by the current user

#### GET /room/info
shows details about a room such as who the creator/admins are

### User

#### GET /user/search?=userName
searches users by userName 

#### PUT /user/invite?=userId?=roomId
sends an invite to a user for the specified room

### Contact (User)

#### GET /contact/list
retrieves the list of contacts for the current user

#### PUT /contact/add?=userId
adds a user to the current users list of contacts

#### DELETE /contact/delete?=userId
removes a user from current users list of contacts
