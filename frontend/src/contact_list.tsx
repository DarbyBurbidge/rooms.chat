import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { fetch_contacts,  make_user_dict } from './api_function';
class ContactList extends Component {

constructor(props) {
    super(props);
    this.state = {
      contacts:[],
      userDict:{},
        show:false,
        
    };
}


    async componentDidMount() {
        try {
            const contacts = await fetch_contacts();
            const userDict = await make_user_dict(contacts);
            this.setState({ contacts });
            this.setState({ userDict });
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    }
    setShow(val:bool ){
        this.setState({show:val});
    }
    handleClose = () => this.setShow(false);
    handleShow = () => this.setShow(true);
    render(): React.ReactNode {
        
      const { contacts, userDict } = this.state;
      return (

    <>
      <Button variant="primary" onClick={this.handleShow}>
        Contacts
      </Button>

      <Offcanvas show={this.state.show} onHide={this.handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Contacts</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
          {contacts.map((contact) => (
            <a href={"#" + contact}><ListGroupItem>
{`${userDict[contact].given_name} ${userDict[contact].family_name}`}
            </ListGroupItem></a>
            ))}
            </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
}

export default ContactList;
