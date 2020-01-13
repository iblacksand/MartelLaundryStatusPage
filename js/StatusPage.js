var socket = io();
socket.emit('amUser');
socket.on('updateClient', (data) => {
    
})