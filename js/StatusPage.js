var socket = io(); // initialize socket
socket.emit('amUser'); // let server know that it is a user
socket.on('updateClient', (data) => { // base function to update tables
    $("#wa-av").innerhtml(data.availableWashers);
    $("#wa-next").innerhtml(data.nextWasher);
    $("#washer-table-body").innerhtml(data.washerTable);
    $("#dy-av").innerhtml(data.availableDryers);
    $("#dy-next").innerhtml(data.nextDryer);
    $("#dryer-table-body").innerhtml(data.dryerTable);
})  