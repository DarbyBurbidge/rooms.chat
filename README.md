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

Errors return as a 500 status Server Error

On open, the backend links the client to the users googleId, then passes notifications to the user via that 'room.' 

### OAuth

#### GET /oauth
used by google to handle access/refresh tokens
account/login redirects here on consent

### Account

#### POST /account/login
uses google oauth api to login/register a user

#### GET /account/info
uses current user to retrieve user account info and settings

#### DELETE /account/delete

### Room

#### POST /room/create/:socketId
takes the socketId from the client and joins the socket to the roomId
adding it to the room
```
takes: {
    "name": string
}
```

```
returns: {
    "room": {
    	roomCode: string
    }
}
```

#### DELETE /room/delete/:roomId
deletes a room that the user has created
```
returns Nothing
```

#### GET /room/link/:roomId
retreives an invite link for the given room
```
return: {
	"inviteUrl": string
}
```

#### PUT /room/join/:socketId/:roomId
joins the clients account to the room associated with the roomId
then adds the clients socket to the socket room instance
```
returns: Nothing
```

#### PUT /room/leave/:socketId/:roomId
removes the user from the chatroom
disconnects the client socket from the socket room instance
returns the room so the room data can be updated on the client side
```
returns: {
	"room": {
        id,
		users: User[]
    }
}
```

#### GET /room/list/
retrieves a list of rooms accessible by the current user
```
returns: {
    "rooms": Room[]
}
```

#### GET /room/info/:roomId
shows details about a room such as who the creator/admins are
```
returns: {
	"room": {
		id: string,
		creator: User,
		admins: User[],
		users: User[],
		messages: Message[]
	}
}
```

### User

#### GET /user/search?username=<user>
searches users by username 
1P
1P
```
returns: {
	"users": User[]
}
```

#### PUT /user/invite/:userId/:roomId
sends an invite to a specific user for the specified room
returns: Nothing

### Contact (User)

#### GET /contact/list
retrieves the list of contacts for the current user
```
returns: {
	contacts: User[]
}
```

#### PUT /contact/add/:userId
adds a user to the current users list of contacts
```
returns: {
	contacts: User[]
}
```

#### DELETE /contact/delete/:userId
removes a user from current users list of contacts

### Notifications
Notifications are generated on by the backend by other events and endpoints, that's why there is no create
#### PUT notification/read/:noteId
marks a notification with the given noteId as read
```
returns: Nothing
```

#### DELETE notification/delete/:noteId
deletes a notification with the given Id
```
returns: Nothing
```

#### POST /message/create/:roomId
reads message content from the req body, then broadcasts that message on behalf of the user
```
takes: {
	"content": string
}
```
```
returns: {
	message: {
		id: string,
		sender: User,
		content: string,
		createTime: Date,
		editTime: Date,
		read: boolean
	}
}
```

#### PUT /message/edit/:messageId
takes a content string from the request body and modifies the message in the database. Also broadcasts the update to other clients in the room
```
takes: {
	content: string
}
```
```
returns: {
	message: {
		id: string,
		sender: User,
		content: string,
		createTime: Date,
		editTime: Date,
		read: boolean
	}
}
```

#### DELETE /message/delete/:messageId 
deletes the message from the database
```
returns: Nothing
```
