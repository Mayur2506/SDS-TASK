import 'bootstrap/dist/css/bootstrap.min.css';
import {useLocation} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { useState } from 'react';
import toast from "react-hot-toast"
import "./Editor.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./Navbar"


const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userf=location.state?.name
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState(userf);
  const createNewRoom = (e) => {
      e.preventDefault();
      const id = uuidV4();
      setRoomId(id);
      toast.success('Created a new room');
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
          },
      });
  };

  const handleInputEnter = (e) => {
      if (e.code === 'Enter') {
          joinRoom();
      }
  };
  return (
    //   <div className="homePageWrapper">
    //       <div className="formWrapper">
    //          <div className='topp'>
    //           <h4 className="mainLabel">Paste invitation ROOM ID</h4>
    //           <div className="inputGroup">
    //               <input
    //                   type="text"
    //                   className="inputBox"
    //                   placeholder="ROOM ID"
    //                   onChange={(e) => setRoomId(e.target.value)}
    //                   value={roomId}
    //                   onKeyUp={handleInputEnter}
    //               />
    //               <br></br>
    //               <input
    //                   type="text"
    //                   className="inputBox"
    //                   placeholder="USERNAME"
    //                   onChange={(e) => setUsername(e.target.value)}
    //                   value={username}
    //                   onKeyUp={handleInputEnter}
    //               />
    //              </div>
    //              <br></br>
    //               <button className="btnjoinBtn" onClick={joinRoom}>
    //                   Join
    //               </button>
    //               <div className="createInfo">
    //                   If you don't have an invite then create &nbsp;    
    //               </div>
    //               <button className='newroom' onClick={createNewRoom}>
    //                       new room
    //               </button>
    //             </div> 
    //       </div>
    //   </div>
    <div className='bg'>
    <Navbar></Navbar>
    <Form className='wrapper'>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>ROOM ID</Form.Label>
        <Form.Control type="text" placeholder="Enter roomId" className='inputbox' onChange={(e) => setRoomId(e.target.value)} value={roomId} onKeyUp={handleInputEnter} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>USERNAME</Form.Label>
        <Form.Control type="text" placeholder="Username" className='inputbox'  onChange={(e) => setUsername(e.target.value)} value={username} onKeyUp={handleInputEnter} />
      </Form.Group>
      <div className='btnflex'>
      <Button variant="primary" type="submit" onClick={joinRoom} >
        JOIN ROOM
      </Button>
      <Button variant="primary" type="submit" className='btnn' onClick={createNewRoom}>
        CREATE ROOM
      </Button>
      </div>
    </Form>
    </div>

  );
};

export default Home;