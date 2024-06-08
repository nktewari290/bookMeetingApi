const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, 'db.json');

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());

// Load initial data from db.json
let meetings = [];
if (fs.existsSync(dataFile)) {
    meetings = JSON.parse(fs.readFileSync(dataFile, 'utf8')).meetings;
}

// Get all meetings
app.get('/api/meetings', (req, res) => {
    res.json(meetings);
});

// Get meetings for a specific room
app.get('/api/meetings/room/:room', (req, res) => {
    const room = parseInt(req.params.room);
    const roomMeetings = meetings.filter(meeting => Number(meeting.room) === Number(room));
    console.log(roomMeetings)
    res.json(roomMeetings);
});

// Create a new meeting
app.post('/api/meetings', (req, res) => {
    const newMeeting = req.body;
    newMeeting.id = Date.now();
    meetings.push(newMeeting);
    fs.writeFileSync(dataFile, JSON.stringify({ meetings }, null, 2));
    res.status(201).json(newMeeting);
});

// Delete a meeting by id
app.delete('/api/meetings/:id', (req, res) => {
    const id = parseInt(req.params.id);
    meetings = meetings.filter(meeting => meeting.id !== id);
    fs.writeFileSync(dataFile, JSON.stringify({ meetings }, null, 2));
    res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});