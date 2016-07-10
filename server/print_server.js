var serialport = require('serialport');
var portName = '/dev/tty.usbmodem1411';
var sp = new serialport(portName, {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\r\n")
});


sp.on('data', function(input) {
	strArray = input.split(',')
    console.log(strArray.map(Number));
});