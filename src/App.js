import './App.css';
import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {useEffect, useState} from "react";

function App() {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser,setCurrentUser] = useState('');
    const [formInput, setFormInput] = useState({toUserId:'1',message:''});
    useEffect(()=>{
        fetch('http://localhost:8080/v1/users')
            .then((response) => response.json())
            .then((data) => setUsers(data.users));
    },[])


    const handleChange = (event)=>{
        const userId = parseInt(event.target.value);
        setCurrentUser(userId);
        fetch(`http://localhost:8080/v1/messages/user/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                setMessages(data.messages)
            });
    }

    const handleNewMessage = (event) => {
        event.preventDefault();

        fetch("http://localhost:8080/v1/messages", {
            method: "POST",
            body: JSON.stringify(formInput),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => console.log("Success:", JSON.stringify(response)))
            .then(() => setFormInput((oldState) => ({...oldState, message:''})))
            .catch(error => console.error("Error:", error));
    };
    const handleInput = (event) => {
        const {name,value} = event.target;
        setFormInput((oldValue) => ({...oldValue, [name]: value }));
    };
    const userOptions = users.map(user => <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>);
    const formattedMessages=messages.map(message => <div key={message.id}>{message.message}</div>)
  return (
      <Grid container spacing={2} style={{padding:'20px'}}>
          <Grid item xs={4} >
              <div>
                  <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Target User</InputLabel>
                      <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Target User"
                          value={formInput.toUserId}
                          name="toUserId"
                          onChange={handleInput}
                      >
                          {userOptions}
                      </Select>
                  </FormControl>
              </div>
          </Grid>
          <Grid item xs={8} >
              <div>
                  <form onSubmit={handleNewMessage}>
                      <TextField
                          id="new-message"
                          label="New Message"
                          multiline
                          fullWidth
                          value={formInput.message}
                          name="message"
                          onChange={handleInput}
                    />
                      <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          >
                      Send Secret
                  </Button>
                  </form>
              </div>
          </Grid>
          <Grid item xs={4}>
              <div>
                  <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Current User</InputLabel>
                      <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Current User"
                          value={currentUser}
                          onChange={handleChange}
                      >
                          {userOptions}
                      </Select>
                  </FormControl>
              </div>

          </Grid>
          <Grid item xs={8}>
              <div>
                  <Box>
                      {formattedMessages}
                  </Box>
              </div>
          </Grid>

      </Grid>

  );
}

export default App;
