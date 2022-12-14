import AceEditor from 'react-ace'
import React, { useEffect, useState} from 'react'
import { useParams,useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Beautify from 'ace-builds/src-noconflict/ext-beautify'
import 'ace-builds/src-noconflict/ext-elastic_tabstops_lite'
import 'ace-builds/src-noconflict/ext-error_marker'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/theme-terminal'
import 'ace-builds/src-noconflict/mode-java' 
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/mode-golang'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/mode-php'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/mode-powershell'
import 'ace-builds/src-noconflict/snippets/c_cpp'
import 'ace-builds/src-noconflict/snippets/java'
import 'ace-builds/src-noconflict/snippets/python'
import 'ace-builds/src-noconflict/snippets/javascript'
import 'ace-builds/src-noconflict/snippets/golang'
import 'ace-builds/src-noconflict/snippets/php'
import io from 'socket.io-client'
import toast from 'react-hot-toast'
import "./Editor.css"
import Client from './Client'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Chat from "./Chat"
import FileSaver from 'file-saver';

const Editor = () => {
  const navigate = useNavigate();
  const location=useLocation();
  const token=localStorage.getItem("token");
  const rusername=location.state?.username;
  const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
  };
  
  const [clients, setClients] = useState([]);
  const { roomId } = useParams();
  const [state, setState] = useState({
    text: '',
    font:'14',
    langauge: '54',
    theme: 'monokai',
    input: '',
    output: '',
  })
 
  
 
  const client= io("http://localhost:5000", options);; 
  useEffect(() => {
    
      client.emit('join', {
        roomId,
        username:rusername,
        token
      });

      client.off('joined').on(
        'joined',
        ({ clients, username, prevdata }) => {
            
            if (username !== rusername) {
                toast.success(`${username} joined the room.`);
                console.log(`${username} joined`);
            }
            setClients(clients);
            if(prevdata !== undefined){
              setState(prevdata.data);
            }
        }
      );
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
     
    client.on('data', (newState) => {
      if (newState.data.data.text !== ' ') setState(newState.data.data)
    })
    client.on('notauth', () => {
        toast.error("Please Login to Continue");
        navigate('/');
    })

    client.off('disconnected').on(
      'disconnected',
      ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => {
              return prev.filter(
                  (client) => client.socketId !== socketId
              );
          });
      }
    );
  })
  
  const handleChange = (text) => {
    
    const newState = {
      text: text,
      font:state.font,
      langauge: state.langauge,
      theme: state.theme,
      input: state.input,
      output: state.output,
    }
    setState(newState)
    const data = { room: roomId, data: newState } 
    client.emit('data', data)
  }
  const handleLanguageChange = (langauge) => {
    const newState = {
      text: state.text,
      font:state.font,
      langauge: langauge,
      theme: state.theme,
      input: state.input,
      output: state.output,
    }
    setState(newState)
    const data = { room: roomId, data: newState }
    client.emit('data', data)
  }
  const handleThemeChange = (theme) => {
    const newState = {
      text: state.text,
      font:state.font,
      langauge: state.langauge,
      theme: theme,
      input: state.input,
      output: state.output,
    }
    setState(newState)
    const data = { room: roomId, data: newState }
    client.emit('data', data)
  }
  

  const handleUserInput = (input) => {
    const newState = {
      text: state.text,
      font:state.font,
      langauge: state.langauge,
      theme: state.theme,
      input: input,
      output: state.output,
    }
    setState(newState)
    const data = { room:roomId, data: newState }
    client.emit('data', data)
  }

  let map2 = new Map()

  map2.set(54, '.cpp')
  map2.set(71, '.py')
  map2.set(62, '.java') 
  map2.set(60, '.go')
  map2.set(63, '.js')
  map2.set(68, '.php')

  const downloadcode = (e) => {
    e.preventDefault();
    console.log("downloading");
    if(state.text === ""){
      toast.error("no code found");
    }
    else{
        let name=map2.get(parseInt(state.langauge))
        let text2 = rusername;
        let result = text2.concat(name);
        var file = new File([state.text], result, {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(file);
      }

  }

  const handleCodeOutput = (output) => {
    const newState = {
      text: state.text,
      font:state.font,
      langauge: state.langauge,
      theme: state.theme,
      input: state.input,
      output: output,
    }
    setState(newState)
    const data = { room: roomId, data: newState }
    client.emit('data', data)
  }
  const removeToken = () => {
    localStorage.removeItem("token");
    navigate('/');
  };
  onsubmit = async (e) => {
    e.preventDefault()
    let outputText = document.getElementById('output1')
    outputText.value = ''
    outputText.value += 'Creating Submission ...\n'
    handleCodeOutput(outputText.value)
    const response = await fetch(
      'https://judge0-ce.p.rapidapi.com/submissions',
      {
        method: 'POST',
        headers: {
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'x-rapidapi-key':
            '59b623c4f9msh13c92c11398e2c2p1e327djsn6c27816d32b1', 
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          source_code: state.text,
          stdin: state.input,
          language_id: parseInt(state.langauge),
        }),
      }
    )
    
    outputText.value = 'Submission Created ...\n'
    handleCodeOutput(outputText.value)
    const jsonResponse = await response.json()
    console.log('json-response', jsonResponse)
    let jsonGetSolution = {
      status: { description: 'Queue' },
      stderr: null,
      compile_output: null,
    }

    while (
      jsonGetSolution.status.description !== 'Accepted' &&
      jsonGetSolution.stderr == null &&
      jsonGetSolution.compile_output == null
    ) {
      
      if (jsonResponse.token) {
        let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`

        const getSolution = await fetch(url, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'x-rapidapi-key':
              '59b623c4f9msh13c92c11398e2c2p1e327djsn6c27816d32b1',
            'content-type': 'application/json',
          },
        })
        jsonGetSolution = await getSolution.json()
        console.log("getting solution",jsonGetSolution)
      }
    }
    if (jsonGetSolution.stdout) {
      const output = atob(jsonGetSolution.stdout)

      outputText.value = ''

      outputText.value += `Results : ${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`
      handleCodeOutput(outputText.value)
    } else if (jsonGetSolution.stderr) {
      const error = atob(jsonGetSolution.stderr)
      console.log(error)
      outputText.value = ''

      outputText.value += `\n Error :${error}`
      handleCodeOutput(outputText.value)
    } else {
      const compilation_error = atob(jsonGetSolution.compile_output)
      console.log(compilation_error)
      outputText.value = ''
      outputText.value += `\n Error :${compilation_error}`
      console.log(outputText.value)
      handleCodeOutput(outputText.value)
    }
  }


  let map1 = new Map()

  map1.set(54, 'c_cpp')
  map1.set(71, 'python')
  map1.set(62, 'java') 
  map1.set(60, 'golang')
  map1.set(63, 'javascript')
  map1.set(68, 'php')
  
 

  return (
    <div className='compiler'>
      <div className='initiate'>
        <span>  </span>
        <span className='inspan'>Language :  </span>
        <select
          onChange={(e) => handleLanguageChange(e.target.value)}
          className='langauges'
          value={state.langauge}
        >
          <option value='54'>C++</option>
          <option value='71'>python</option>
          <option value='62'>java</option>
          <option value='60'>golang</option>
          <option value='63'>javascript</option>
          <option value='68'>PHP</option>
        </select>
        <span>  </span>
        <span className='inspan'> Theme :  </span>
        <select
          onChange={(e) => handleThemeChange(e.target.value)}
          className='themes'
          value={state.theme}
        >
          <option value='terminal'>terminal</option>
          <option value='monokai'>monokai</option>
          <option value='xcode'>xcode</option>
          <option value='github'>github</option>
          <option value='solarized_dark'>solarized_dark</option>
          <option value='tomorrow'>tomorrow</option>
        </select>
      </div>
      <div className='makeflex'>
      <AceEditor
        mode={map1.get(parseInt(state.langauge))}
        theme={state.theme}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          behavioursEnabled: true,
          displayIndentGuides: true,
        }}
        className='editor'
        highlightActiveLine={true}
        commands={[
          Beautify.commands,
          {

            name: 'removeline', 
            bindKey: { win: 'Ctrl-X', mac: 'Command-X' },
            exec: 'removeline',
          },
          {
            
            name: 'copyline',
            bindKey: { win: 'Ctrl-C', mac: 'Command-C' },
            exec: 'copyline',
          },
          {
           
            name: 'format', 
            bindKey: { win: 'Ctrl-Shift-b', mac: 'Command-Shift-b' }, 
            exec: 'beautify',
          },
        ]}
        fontSize='16px'
        name='UNIQUE_ID_OF_DIV'
        editorProps={{ $blockScrolling: false }}
        style={{
          height: 600,
          width: 750,
          display: 'flex',
          justifyContent: 'center',
          font: 50,
          whiteSpace: 'pre-wrap',
        }}
        value={state.text}
        onChange={handleChange}
      />
        <div className='editinput'>
        <div className='flex1'>
          <span className='inspan'>
            User Input :
          </span>
          <br />
          <textarea
            value={state.input}
            id='input1'
            className='textareas'
            onChange={(e) => handleUserInput(e.target.value)}
          />
        </div>
        <div className='mt-2 ml-5'>
          <span className='inspan'>
            Output :
          </span>
          <br />
          <textarea
            value={state.output}
            id='output1'
            className='textareas'
            onChange={(e) => handleCodeOutput(e.target.value)}
          />
        </div>
            <button
            style={{ height: 50, width: 100,marginTop: 25}}
            type='submit'
            className='btn1'
            onClick={(e) => onsubmit(e)}
            >
            Submit
            </button>
            <div className='filesave'>
            <button className='btn2' onClick={downloadcode}>Download</button>
            </div>
      </div>
      <div className='gborder'></div>
      <div className='users'>
        <div>
            <CopyToClipboard text={roomId}
              onCopy={() => {toast.success("RoomId copied to clipboard")}}>
              <button className='copybtn'>Invite</button>
            </CopyToClipboard>
            <button className='bgq' onClick={removeToken}>Log Out</button>
        </div>
        <br></br>
        <p className='inspan'>users :</p>
        <div className='userflex'>
        {clients.map((client) => (
            <Client
                key={client.socketId}
                username={client.username}
            />
        ))}
        </div>
          <div>
          <Chat socket={client} username={rusername} room={roomId} />  
        </div>
      </div>
      </div>
    </div>
  )
}

export default Editor
