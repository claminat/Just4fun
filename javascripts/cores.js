var socketPromise = new Promise(function (resolve, reject) {
    var socketUrl = 'http://localhost:3002';
    //var socketUrl = 'http://202.143.111.30:3002';

    var socket = io.connect(socketUrl);
    socket.on('connect', function (data) {
        socket.emit('join', 'Hello from redirect');
        console.log('Listen socket: ', socketUrl);

        socket.on('broad', function (data) {
            var msg = '[' + new Date().toLocaleString("en-US") + '] Client recieved (broad): ' + data;
            console.log(msg);
        });
        socket.on('notification', function (data) {
            console.log('socket.on', 'notification', data);
            createNotification('Post complete!');
        });
        if (socket)
            resolve(socket);
    });
});