import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card'
import { CardBody, CardHeader } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GoogleButton } from '@react-oauth/google';

function Login() {
  return (
    
    <Container >
    
    <Row><br></br></Row>
    <Row>
    <Card bg = 'light' className="mx-auto" >
        <CardHeader>Login</CardHeader>
    <CardBody>

    
    <Form>
      <Form.Group className="" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        
      </Form.Group>

      <Form.Group className="" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Remember Me" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Login
      </Button>
      <Button variant="danger" type="ignore">
        Login With Google
      </Button>
    </Form>
    </CardBody>
    </Card>
    </Row>
    </Container>
  );
}
export default Login;