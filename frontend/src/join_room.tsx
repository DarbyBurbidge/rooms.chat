import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
function handleClose(){
    let navigate = useNavigate();
    navigate(`/home`);
}
async function fetch_room_info(roomID) {
    console.log(`http://localhost:3000/room/linkinfo/${roomID}`)
  const response = await fetch(`http://localhost:3000/room/linkinfo/${roomID}`, {
    method: 'GET',
    mode: 'cors',
    headers: { "Authorization": Cookies.get('Authorization') },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch room information');
  }

  const data = await response.json();
  return data.room;
}

function JoinModal() {
  const { inviteLink } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getRoomInfo() {
      try {
        const info = await fetch_room_info(inviteLink);
        setRoomInfo(info);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getRoomInfo();
  }, [inviteLink]);

  const handleJoinRoom = () => {
    navigate(`/rooms/${inviteLink}`);
  };

  if (loading) {
    return <p>Loading...</p>; // Optionally, render a loading spinner here
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show = {true}backdrop="static" onHide={() => navigate("/home")}>
        <Modal.Header closeButton>
          <Modal.Title>You have been invited to {roomInfo.creator.given_name}'s Room</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Col xs={6} md={4}>
          <Image src={roomInfo.creator.imageUrl} roundedCircle />
        </Col>
          <p>{1 + roomInfo.admins.length + roomInfo.users.length } Members</p>
          <Button variant="primary" onClick={handleJoinRoom}>Join Room</Button>
        </Modal.Body>

      </Modal>
    </div>
  );
}

export default JoinModal;
