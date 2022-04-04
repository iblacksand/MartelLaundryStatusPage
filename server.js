'use strict';
//Initialize Server
const express = require('express');
const auth = require('./auth'); // file that contains the passwords
const socketIO = require('socket.io');
const path = require('path');
var router = express.Router();
var app = express();
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const HOST = path.join(__dirname, 'host.html');
var users = [];

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = RateLimit({
  windowMs: 1*1000, // 1 second
  max: 5
});

// apply rate limiter to all requests
app.use(limiter);

// Add all of the appropriate paths
express().use(express.static('public'));
app.use('/', express.static(__dirname + '/status/'));
app.use('/js', express.static('js'));
app.use('/', express.static('public'));
app.use('/css', express.static('css'));
app.use('/img', express.static('img'));
app.use(auth);
app.use('/admin', express.static('admin'));
const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

//Start the sockets
const io = socketIO(server);

//Global variables
var haveErrors = false;
var availableWashers = 0;
var nextWasher= 0;
var availableDryers = 0;
var nextDryer = 0;
var washers = [];
var dryers = [];

//Initial connection of socket
io.on('connection', (socket)=>{
    socket.emit('connected', {});
    socket.on('amUser', () =>{
        // Send initial table data
        socket.emit('updateClient', {washerTable: generateWasherTables(), dryerTable: generateDryerTables(), availableWashers: availableWashers, nextWasher: nextWasher, availableDryers: availableDryers, nextDryer: nextDryer});
    });
    socket.on('amStatusRelay', () => {
        //When socket has an update
        socket.on('updateServer', (data)=>{
            // Grab all of the data
            washers = data.washers.split(',').map(Function.prototype.call, String.prototype.trim);
            dryers = data.dryers.split(',').map(Function.prototype.call, String.prototype.trim);
            availableWashers = availableMachines(washers);
            nextWasher = nextMachine(washers);
            availableDryers = availableMachines(dryers);
            nextDryer = nextMachine(dryers);
            // Update the clients
            io.emit('updateClient', {washerTable: generateWasherTables(), dryerTable: generateDryerTables(), availableWashers: availableWashers, nextWasher: nextWasher, availableDryers: availableDryers, nextDryer:nextDryer})
        })
    });
});

// Find the machine with the lowest time remaining and != to 0
function nextMachine(m){
    let val = Number.MAX_VALUE;
    for(let i = 0; i < m.length; i++){
        let v = parseInt(m[i]);
        if (v >= 0 && v < val) val = v;
    }
    if(Number.MAX_VALUE == val) val = "ERROR";
    return val;
}

// Find the number of machines with 0 minutes remaining on the timer
function availableMachines(m){
    let av = 0;
    for(let i = 0; i < m.length; i++){
        av += m[i] ==  0; // add if not equal to 0
    }
    return av;
}

// Generate row corresponding to available status
function availableStatus(){
    return '<td class="has-text-success">Available</td>';
}

// Generate the correct time remaining status for the machine
function timeRemainingStatus(t){
    let color = 'has-text-danger';
    if(t < 16) color = 'has-text-yellow';
    return '<td class="' + color + '">' + t + 'm</td>\n';
}

// Generate row corresponding to unknown status
function unknownStatus(){
    return '<td style="color:purple">Status Unknown</td>'
}

// Generate tables for the washers
function generateWasherTables(){
    var tableHTML = ''; // html for the table
    for(let i = 0; i < washers.length; i++){
        var washerData = '<tr><td>Washer #' + (i+1) + '</td>\n'
        let d = washers[i];
        var timeData =  "";
        switch (d) { // find appropriate status
            case "0":
                timeData = availableStatus();
                break;
            case "-1":
                timeData = unknownStatus();
                break;
            default:
                timeData = timeRemainingStatus(washers[i]);
                break; 
        }
        washerData += timeData + '</tr>';
        tableHTML += washerData + '\n';
    }
    return tableHTML;
}

// Generate tables for the dryers
function generateDryerTables(){
    var tableHTML = '';// html for the table
    for(let i = 0; i < dryers.length; i++){
        var dryerData = '<tr><td>Dryer #' + (i+1) + '</td>'
        let d = dryers[i];
        var timeData =  "";
        switch (d) {// find appropriate status
            case "0":
                timeData = availableStatus();
                break;
            case "-1":
                timeData = unknownStatus();
                break;
            default:
                timeData = timeRemainingStatus(dryers[i]);
                break;
        }
        dryerData += timeData + '</tr>\n';
        tableHTML += dryerData + '\n';
    }
    return tableHTML;
}
