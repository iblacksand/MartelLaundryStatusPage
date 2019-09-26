'use strict';
//Initialize Server
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
var router = express.Router();
var app = express();
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const HOST = path.join(__dirname, 'host.html');
var users = [];
express().use(express.static('public'));
app.use('/', express.static(__dirname + '/'));
const server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

//Start the sockets
const io = socketIO(server);

//Global variables
var haveErrors = false;
var availableWashers = 0;
var busyWashers = 0;
var availableDryers = 0;
var busyDryers = 0;
var washers = [];
var dryers = [];

//Initial connection of socket
io.on('connection', (socket)=>{
    socket.emit('connected', {});
    socket.on('amUser', () =>{
        // Send initial table data
        socket.emit('updateClient', {washerTable: generateWasherTables(), dryerTable: generateDryerTables(), availableWashers: availableWashers, busyWashers: busyWashers, availableDryers: availableWashers, busyDryers: busyDryers});
    });
    socket.on('amStatusRelay', (data) => {
        washers = data.washers;
        dryers = data.dryers;
        //When socket has an update
        socket.on('updateServer', (data)=>{

            // Update the clients
            io.emit('updateClient', {washerTable: generateWasherTables(), dryerTable: generateDryerTables(), availableWashers: availableWashers, busyWashers: busyWashers, availableDryers: availableWashers, busyDryers: busyDryers})
        })
    });
});

function availableStatus(){
    return '<td class="has-text-success">Available</td>';
}

function timeRemainingStatus(t){
    let color = 'has-text-danger';
    if(t < 16) color = 'has-text-yellow';
    return '<td class="' + color + '">' + t + 'm</td>';
}

function unknownStatus(){

}

function generateWasherTables(){
    var tableHTML = `<table class="table">
    <thead>
      <tr>
        <th>Machine</th>
        <th>Time Remaining</th>
      </tr>
    </thead>
    <tbody>`;
    for(let i = 0; i < washers.length; i++){
        var washerData = '<tr><td>Washer #' + (i+1) + '</td>'
        let d = washer[i].status;
        var timeData =  "";
        switch (d) {
            case 0:
                timeData = availableStatus();
                break;
            case 1:
                timeData = timeRemainingStatus(washers[i].timeRemaining);
                break;
            case -1:
                timeData = unknownStatus();
                break;
            default:
                timeData = unknownStatus();
                break;
        }
        washerData += timeData + '</tr>';
    }
    tableHTML += '</tbody></table>';
}


function generateDryerTables(){
    var tableHTML = `<table class="table">
    <thead>
      <tr>
        <th>Machine</th>
        <th>Time Remaining</th>
      </tr>
    </thead>
    <tbody>`;
    for(let i = 0; i < dryers.length; i++){
        var washerData = '<tr><td>Washer #' + (i+1) + '</td>'
        let d = dryers[i].status;
        var timeData =  "";
        switch (d) {
            case 0:
                timeData = availableStatus();
                break;
            case 1:
                timeData = timeRemainingStatus(dryers[i].timeRemaining);
                break;
            case -1:
                timeData = unknownStatus();
                break;
            default:
                timeData = unknownStatus();
                break;
        }
        washerData += timeData + '</tr>';
    }
    tableHTML += '</tbody></table>';
}