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

### OAuth

#### GET /oauth
used by google to handle access/refresh tokens
account/login redirects here on consent

### Account

#### PUT /account/login
uses google oauth api to login/register a user

#### GET /account/info
uses current user to retrieve user account info and settings

#### DELETE /account/delete

### Room

#### PUT /room/create
creates a room

#### DELETE /room/delete?roomId=<roomId>
deletes a room that the user has created

#### GET /room/link?roomId=<roomId>
retreives an invite link for the given room

#### PUT /room/leave?roomId=<roomId>
removes the user from the chatroom

#### GET /room/list
retrieves a list of rooms accessible by the current user

#### GET /room/info?roomId=<roomId>
shows details about a room such as who the creator/admins are

### User

#### GET /user/search?username=<user>
searches users by username 

#### PUT /user/invite?userId=<userId>&roomId=<roomId>
sends an invite to a specific user for the specified room

### Contact (User)

#### GET /contact/list
retrieves the list of contacts for the current user

#### PUT /contact/add?userId=<userId>
adds a user to the current users list of contacts

#### DELETE /contact/delete?userId=<userId>
removes a user from current users list of contacts
