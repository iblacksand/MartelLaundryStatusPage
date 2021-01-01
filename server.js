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
            washers = data.washers.split(',');
            dryers = data.dryers.split(',');
            availableWashers = availableMachines(washers);
            nextWasher = Array.min(washers);
            availableDryers = availableMachines(dryers);
            nextDryer = Array.min(dryers);
            // Update the clients
            io.emit('updateClient', {washerTable: generateWasherTables(), dryerTable: generateDryerTables(), availableWashers: availableWashers, nextWasher: nextWasher, availableDryers: availableDryers, nextDryer:nextDryer})
        })
    });
});

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

function availableMachines(m){
    let av = 0;
    for(let i = 0; i < m.length; i++){
        av += m[i] ==  0; // add if not equal to 0
    }
    return av;
}

function availableStatus(){
    return '<td class="has-text-success">Available</td>';
}

function timeRemainingStatus(t){
    let color = 'has-text-danger';
    if(t < 16) color = 'has-text-yellow';
    return '<td class="' + color + '">' + t + 'm</td>\n';
}

function unknownStatus(){

}

function generateWasherTables(){
    var tableHTML = '';
    for(let i = 0; i < washers.length; i++){
        var washerData = '<tr><td>Washer #' + (i+1) + '</td>\n'
        let d = washers[i];
        var timeData =  "";
        switch (d) {
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


function generateDryerTables(){
    var tableHTML = '';
    for(let i = 0; i < dryers.length; i++){
        var dryerData = '<tr><td>Dryer #' + (i+1) + '</td>'
        let d = dryers[i];
        var timeData =  "";
        switch (d) {
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