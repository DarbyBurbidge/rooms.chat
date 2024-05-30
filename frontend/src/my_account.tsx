
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
  } from 'react-query';
  import { SystemMessage } from "react-chat-elements"
  import Spinner from 'react-bootstrap/Spinner';
  import { useParams } from 'react-router-dom';
  import { useState, useEffect, Component } from 'react';
  import { Button, CardFooter, Row, Modal, Col } from 'react-bootstrap';
  import { MessageBox, Avatar, Input } from "react-chat-elements";
  import Cookies from 'js-cookie';
  import Card from 'react-bootstrap/Card';
  import { CardBody, CardHeader } from 'react-bootstrap';
  import * as Icon from 'react-bootstrap-icons';
  import { current_user_data } from './api_function';

import  Image  from 'react-bootstrap/Image';
class AccountPage extends Component {

constructor(props) {
    super(props);
    this.state = {
        user :{} 
    };
}


    async componentDidMount() {
        try {
            const user = await current_user_data();
            this.setState({ user });
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
        
      const { user} = this.state;
      return (
    <>
    <Card>
                 
        <CardHeader>My Account</CardHeader>
        <CardBody>
            <Row>
            <Col>
         <Image src= {user.imageUrl} roundedCircle />   
         </Col>
            <Col>
         {user.given_name} 
         </Col>
         <Col>
         {user.family_name} </Col>
         <Col></Col>
         <Col></Col>
         <Col></Col>
         <Col></Col>
         <Col></Col>
            </Row>

        </CardBody>
    </Card>
    </>
  );
}
}

export default AccountPage;



  