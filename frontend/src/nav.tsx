import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ContactList from './contact_list';
import { instanceOf } from 'prop-types';

import { CookiesProvider, useCookies, Cookies, withCookies } from 'react-cookie'
const navigate = (url: string) => {
  window.location.href = url;
}

const auth = async () => {
  //useCookies(["user"]) 
  const response = await fetch('http://127.0.0.1:3000/account/login',
    { method: 'put' });
  const data = await response.json();
  //console.log(data)
  //alert(data.url) 
  navigate(data.url);
}

class NavScroll extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
    constructor(props) {
    super(props);
    const {cookies} = props;
    this.state = {
        logged_in: cookies.get('logged_in') || false,
        user_name: cookies.get('user_name') || ""
    };
  }

  async localauth() 
  {
    await auth();
    alert("test");
    const { cookies } = this.props;

    cookies.set('logged_in', true , { path: '/' });
    this.setState({ logged_in: cookies.get('logged_in')});
  }
  render() {
    //this.setState({logged_in: this.props.logged_in});
    //const [isLoggedIn, setCookie] = useCookies(['user']);
    return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">Rooms.Chat</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        {this.state.logged_in? (
        <><ContactList></ContactList></>):(
            <><Button variant="outline-success" onClick={this.localauth }>Log In</Button> 
            <Button variant="outline-success" onClick={() => {auth()} }>Create Account</Button> 
            </>
        )}
        <Navbar.Collapse id="navbarScroll">

          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            
          </Nav>
          {this.state.logged_in? ( 
          
          <><Button variant="outline-success">New Chat +</Button><Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Username"
                                className="me-2"
                                aria-label="Search" />
                            <Button variant="outline-success">Search</Button>
                        </Form></>
        ) : (<></>)}

        </Navbar.Collapse>
        
      </Container>
    </Navbar>
  );
}
}

export default withCookies(NavScroll);