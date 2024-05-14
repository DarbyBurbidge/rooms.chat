import React, { Component } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';

class ContactList extends Component {

constructor(props) {
    super(props);
    this.state = {
        show:false,
        name: "Members"
    };
}
    setShow(val:bool ){
        this.setState({show:val});
    }
    handleClose = () => this.setShow(false);
    handleShow = () => this.setShow(true);
    render(): React.ReactNode {
        
  return (
    <>
      <Button variant="primary" onClick={this.handleShow}>
        Launch
      </Button>

      <Offcanvas show={this.state.show} onHide={this.handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{this.state.members}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
}

export default ContactList;
/*
class SlideOutList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    toggleList = () => {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen
        }));
    };

    render() {
        const { isOpen } = this.state;

        return (
            <div className={`slide-out-list ${isOpen ? 'open' : ''}`}>
                <Button onClick={this.toggleList}>
                    {isOpen ? 'Close List' : 'Open List'}
                </Button>
                <ListGroup>
                    <ListGroup.Item>Item 1</ListGroup.Item>
                    <ListGroup.Item>Item 2</ListGroup.Item>
                    <ListGroup.Item>Item 3</ListGroup.Item>
                    <ListGroup.Item>Item 4</ListGroup.Item>
                    <ListGroup.Item>Item 5</ListGroup.Item>
                </ListGroup>
            </div>
        );
    }
}

export default SlideOutList;
*/