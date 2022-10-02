import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import toast from 'react-hot-toast';
import Navbar from "./Navbar"

function Login() {
   

//  const s=useNavigate();
  const onChange = (e) => {
        setloginCredentials({ ...logincredentials, [e.target.name]: e.target.value });
  };
  const onChanges = (e) => {
    setregisterCredentials({ ...registercredentials, [e.target.name]: e.target.value });
  };
  const [logincredentials, setloginCredentials] = useState({ email: "", password: "" });
  const [registercredentials, setregisterCredentials] = useState({ email: "", password: "",name:"",username:""});
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: logincredentials.email,
        password: logincredentials.password,
      }),
    });
    const json = await response.json();
    const name=json.reuser
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
        navigate("/home", {
          state: {
              name
          },
        });
        toast.success("Logged in Successfully")
    }else {
        toast.error("Please Try again")
    }
  };
  const handleReg = async (e) => {
    console.log("clicked");
    e.preventDefault();
    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registercredentials.name,
        username: registercredentials.username,
        email: registercredentials.email,
        password: registercredentials.password,
      }),
    });
    const json = await response.json(); 
    if (json.success) {
        console.log("done");
        toast.success("Please Login to Enter")
    }else {
        toast.error("User Already Registered")
    }
  };
  const [justifyActive, setJustifyActive] = useState('tab1');
  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  return (
    <div>
        <Navbar/>
        <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

          <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
                Login
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
                Register
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent>

            <MDBTabsPane show={justifyActive === 'tab1'}>

              <div className="text-center mb-3">
                <p>Sign in with:</p>

              </div>

              <MDBInput wrapperClass='mb-4' name="email" label='Email address'   value={logincredentials.email} id='form1' type='email' onChange={onChange}/>
              <MDBInput wrapperClass='mb-4' name="password" label='Password'  value={logincredentials.password} id='form2' type='password' onChange={onChange}/>

              <div className="d-flex justify-content-between mx-4 mb-4">
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
              </div>

              <MDBBtn className="mb-4 w-100" onClick={handleSubmit} >Sign in</MDBBtn>
            </MDBTabsPane>

            <MDBTabsPane show={justifyActive === 'tab2'}>

              <div className="text-center mb-3">
                <p>Sign up with:</p>

              </div>

              <MDBInput wrapperClass='mb-4' name="name" label='Name' value={registercredentials.name} id='form1' type='text' onChange={onChanges} />
              <MDBInput wrapperClass='mb-4' name="username" label='Username' value={registercredentials.username} id='form1' type='text' onChange={onChanges} />
              <MDBInput wrapperClass='mb-4' name="email" label='Email' value={registercredentials.email} id='form1' type='email' onChange={onChanges} />
              <MDBInput wrapperClass='mb-4'  name="password" label='Password' value={registercredentials.password} id='form1' type='password' onChange={onChanges}/>

              <div className='d-flex justify-content-center mb-4'>
                <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I have read and agree to the terms' />
              </div>

              <MDBBtn className="mb-4 w-100" onClick={handleReg}>Sign up</MDBBtn>

            </MDBTabsPane>

          </MDBTabsContent>

        </MDBContainer>
    </div>
  );
}

export default Login;