import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'js-cookie';
import { withCookies } from 'react-cookie';
import ContactList from './contact_list';

const navigate = (url) => {
  window.location.href = url;
}

async function usersearch(username) {
  const data = await fetch(`http://localhost:3000/user/search?username=${username}`, {
    method: 'GET',
    mode: 'cors',
    headers: { "Authorization": Cookies.get('Authorization') },
    credentials: 'include',
  }).then(res => res.json());
  return data.users;
}

const auth = async () => {
  const response = await fetch('http://localhost:3000/account/login', { method: 'POST' });
  const data = await response.json();
  navigate(data.url);
}

class NavScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authed: Cookies.get('Authorization') || 'None',
      user_name: "",
      searchResults: []
    };
  }

  async localauth() {
    await auth();
    this.setState({ authed: Cookies.get('Authorization') });
  }

  handleSearch = async (event) => {
    event.preventDefault();
    const username = event.target.elements.username.value;
    const users = await usersearch(username);
    this.setState({ searchResults: users });
  }

  render() {
    const { searchResults } = this.state;

    return (
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="#">Rooms.Chat</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          {this.state.authed !== "None" ? (
            <></>
          ) : (
            <>
              <Button variant="outline-success" onClick={() => this.localauth()}>Log In</Button>
              <Button variant="outline-success" onClick={() => auth()}>Create Account</Button>
            </>
          )}
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            </Nav>
            {this.state.authed !== "None" ? (
              <>
                <ContactList></ContactList>
                <a href='newroom'>
                  <Button variant="outline-success">New Chat +</Button>
                </a>
                <Form className="d-flex" onSubmit={this.handleSearch}>
                  <Form.Control
                    type="search"
                    placeholder="Username"
                    className="me-2"
                    aria-label="Search"
                    name="username"
                  />
                  <Button variant="outline-success" type="submit">Search</Button>
                </Form>
                {searchResults.length > 0 && (
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Search Results
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {searchResults.map(user => (
                        <Dropdown.Item key={user._id} href={`/addcontact/${user._id}`}>
                          <p>{user.given_name} {user.family_name}</p>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
          <Button variant="outline-danger" onClick={() => {Cookies.remove("Authorization"); window.location.href = "/login"}}>Log Out</Button>
              </>
            ) : (<></>)}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withCookies(NavScroll);
