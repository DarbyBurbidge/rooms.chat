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
async function fetch_user_data(userId) {
    const data = await fetch(`http://localhost:3000/user/id?id=${userId}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Authorization": Cookies.get('Authorization') },
        credentials: 'include',
    }).then(res => res.json());
    return data;
}
async function handleContactAdd(userId,nav){
     
    
    const data = await fetch(`http://localhost:3000/contact/add/${userId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: { "Authorization": Cookies.get('Authorization') },
        credentials: 'include',
    }).then(res => res.json());
    nav("/home");
}
function AddContactModal() {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserInfo() {
      try {
        const info = await fetch_user_data(userId);
        setUserInfo(info);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getUserInfo();
  }, [userId]);


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
          <Modal.Title>Add Contact?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Col xs={6} md={4}>
          <Image src={userInfo.imageUrl} roundedCircle />
        </Col>
          <p>{userInfo.given_name} {userInfo.family_name}</p>
          <Button variant="primary" size="lg" onClick={() => handleContactAdd(userId, navigate)}>Add Contact</Button>
        </Modal.Body>

      </Modal>
    </div>
  );
}

export default AddContactModal;
