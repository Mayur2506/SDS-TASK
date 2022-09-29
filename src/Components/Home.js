import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import {useLocation} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { useState } from 'react';
import toast from "react-hot-toast"


const Home = () => {
  const [value,setvalue]=useState('languages')
  const navigate = useNavigate();
  const location = useLocation();
  const userf=location.state?.name
  const [roomId, setRoomId] = useState(userf);
  const [username, setUsername] = useState('');
  const createNewRoom = (e) => {
      e.preventDefault();
      const id = uuidV4();
      setRoomId(id);
      toast.success('Created a new room');
  };
  const handleSelect = (e) => {
      setvalue(e)
  };
  const joinRoom = () => {
      if (!roomId || !username) {
          toast.error('ROOM ID & username is required');
          return;
      }

      // Redirect
      navigate(`/editor/${roomId}`, {
          state: {
              username,
              value
          },
      });
  };

  const handleInputEnter = (e) => {
      if (e.code === 'Enter') {
          joinRoom();
      }
  };
  return (
      <div className="homePageWrapper">
          <div className="formWrapper">
              <img
                  className="homePageLogo"
                  src="/code-sync.png"
                  alt="code-sync-logo"
              />
              <h4 className="mainLabel">Paste invitation ROOM ID</h4>
              <div className="inputGroup">
                  <input
                      type="text"
                      className="inputBox"
                      placeholder="ROOM ID"
                      onChange={(e) => setRoomId(e.target.value)}
                      value={roomId}
                      onKeyUp={handleInputEnter}
                  />
                  <input
                      type="text"
                      className="inputBox"
                      placeholder="USERNAME"
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      onKeyUp={handleInputEnter}
                  />
                  <button className="btn joinBtn" onClick={joinRoom}>
                      Join
                  </button>
                  <span className="createInfo">
                      If you don't have an invite then create &nbsp;
                      <button onClick={createNewRoom}>
                          new room
                      </button>
                  </span>
                  <DropdownButton
                    alignRight
                    title={value}
                    id="dropdown-menu-align-right"
                    onSelect={handleSelect}
                  >
                  <Dropdown.Item eventKey="C">C</Dropdown.Item>
                  <Dropdown.Item eventKey="C++">C++</Dropdown.Item>
                  <Dropdown.Item eventKey="JAVA">JAVA</Dropdown.Item>
                  <Dropdown.Item eventKey="PYTHON">PYTHON</Dropdown.Item>
                </DropdownButton>

              </div>
          </div>
      </div>
  );
};

export default Home;