var socket = io(); // initialize socket
socket.emit('amUser'); // let server know that it is a user
socket.on('updateClient', (data) => { // base function to update tables
    $("#wa-av").html(data.availableWashers);
    $("#wa-next").html(data.nextWasher + ' min');
    $("#washer-table-body").html(data.washerTable);
    $("#dy-av").html(data.availableDryers);
    $("#dy-next").html(data.nextDryer + ' min');
    $("#dryer-table-body").html(data.dryerTable);
})  