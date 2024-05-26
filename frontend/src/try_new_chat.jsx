import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from 'react-query';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, CardFooter, Row } from 'react-bootstrap';
import { MessageBox, Avatar } from "react-chat-elements";
import Cookies from 'js-cookie';
import Card from 'react-bootstrap/Card';
import { CardBody, CardHeader } from 'react-bootstrap';
import { Input } from 'react-chat-elements';

const queryClient = new QueryClient();

async function send_message(roomID, text) {
    await fetch(`http://localhost:3000/message/create/${roomID}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Cookies.get('Authorization'),
        },
        credentials: 'include',
        body: JSON.stringify({ content: text }),
    });
    window.location.reload();  // Refresh the whole page after sending a message
}

async function fetch_user_data(userId) {
    const data = await fetch(`http://localhost:3000/user/id?id=${userId}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Authorization": Cookies.get('Authorization') },
        credentials: 'include',
    }).then(res => res.json());
    return data;
}

async function current_user_data(){
    const data = await fetch(`http://localhost:3000/account/info`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Authorization": Cookies.get('Authorization') },
        credentials: 'include',
    }).then(res => res.json());
    return data.account;
}

async function make_user_dict(messages) {
    const user_dict = {};
    await Promise.all(messages.map(async (element) => {
        const data = await fetch_user_data(element.sender);
        user_dict[element.sender] = data;
    }));
    return user_dict;
}

export default function Tester() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
    const { roomID } = useParams();
    const [message, setMessage] = useState('');
    const [userDict, setUserDict] = useState({});
    const [isUserDictLoading, setIsUserDictLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const { isLoading, error, data } = useQuery(['repoData', roomID], () =>
        fetch(`http://localhost:3000/room/info/${roomID}`, {
            method: 'GET',
            mode: 'cors',
            headers: { "Authorization": Cookies.get('Authorization') },
            credentials: 'include',
        }).then(res => res.json())
    );

    useEffect(() => {
        if (data && data.room && data.room.messages) {
            make_user_dict(data.room.messages).then((dict) => {
                setUserDict(dict);
                setIsUserDictLoading(false);
            });
        }
    }, [data]);

    useEffect(() => {
        current_user_data().then(setCurrentUser);
    }, []);

    if (isLoading || isUserDictLoading || !currentUser) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    console.log(data);
    let room;
    try {
        room = data.room;
        console.log(currentUser._id)
    } catch (error) {
        room = { id: "None" };
    }

    const handleSendMessage = async () => {
        if (message.trim() !== '') {
            await send_message(roomID, message);
            setMessage('');
        }
    };

    return (
        <div>
            {room.id === "None" ? (
                <>
                    <Spinner animation="border" variant="primary" />
                    <Spinner animation="border" variant="secondary" />
                    <Spinner animation="border" variant="success" />
                    <Spinner animation="border" variant="danger" />
                    <Spinner animation="border" variant="warning" />
                    <Spinner animation="border" variant="info" />
                    <Spinner animation="border" variant="light" />
                    <Spinner animation="border" variant="dark" />
                </>
            ) : (
                <Card>
                    <CardHeader>
                        <div class="d-inline-flex"><a href = "/home"><Button>Back</Button></a><h1>{room.creator.given_name} {room.creator.family_name}'s Room</h1></div>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            {room.messages.length ? (
                                room.messages.map((text, index) => (
                                    <MessageBox
                                        key={index}
                                        position={text.sender === currentUser._id ? "right" : "left"}
                                        type="text"
                                        title={userDict[text.sender] ? `${userDict[text.sender].given_name} ${userDict[text.sender].family_name}` : 'Unknown User'}
                                        text={text.content}
                                    />
                                ))
                            ) : (
                                <h2>No Messages in this chat</h2>
                            )}
                        </Row>
                    </CardBody>
                    <CardFooter>
                        <Row>
                            <Input
                                placeholder="Type here..."
                                multiline={true}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rightButtons={
                                    <Button onClick={handleSendMessage}>Send</Button>
                                }
                            />
                        </Row>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
