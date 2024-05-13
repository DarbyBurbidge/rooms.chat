//import { googleButton } from './assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png';
import './App.css'

const navigate = (url: string) => {
  window.location.href = url;
}

const auth = async () => {
  const response = await fetch('http://127.0.0.1:3000/account/login',
    { method: 'put' });
  const data = await response.json();
  navigate(data.url);
}

function App() {
  return (
    <>
      <h1>Rooms.Chat</h1>
      <button type="button" onClick={() => { auth() }}>
      </button>
    </>
  )
}

export default App
