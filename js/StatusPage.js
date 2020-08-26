var socket = io(); // initialize socket
socket.emit('amUser'); // let server know that it is a user
socket.on('updateClient', (data) => { // base function to update tables
    
})