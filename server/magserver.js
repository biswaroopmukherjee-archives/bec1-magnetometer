// A quick node server to stream magnetometer data to plotly

var serialport = require('serialport');

// Load the Plotly Tokens
const os = require('os');
if (os.homedir()=="/Users/biswaroopmukherjee"){
    // If at home,
    var pt = require('/Users/biswaroopmukherjee/Documents/Physics/Research/Zwierlein/Programs/Setup/plotly_tokens.js')
}
else {
    // Otherwise, enter your own tokens
    console.log('Please enter your plotly tokens')
}
// Manually enter tokens below:
var plotly = require('plotly')(pt.username, pt.apikey),
    token = pt.streamtoken;

// Define serial port to read from:
var portName = '/dev/tty.usbmodem1411';
var sp = new serialport(portName,{
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\r\n")
});

// Function to get a nicely formatted date string
function getDateString() {
    var time = new Date().getTime();
    // 32400000 is (GMT+9 Japan)
    // for your timezone just multiply +/-GMT by 36000000
    var datestr = new Date(time +32400000).toISOString().replace(/T/, ' ').replace(/Z/, '');
    return datestr;
}

// Initial data and layout
var initdata = [{x:[], y:[], stream:{token:token, maxpoints: 500}}];
var initlayout = {fileopt : "extend", filename : "sensor-test"};


// Plot the data continuously
plotly.plot(initdata, initlayout, function (err, msg) {
    if (err) return console.log(err)

    console.log(msg);
    var stream = plotly.stream(token, function (err, res) {
        console.log(err, res);
    });

    sp.on('data', function(input) {
        if(isNaN(input)) return;

        var streamObject = JSON.stringify({ x : getDateString(), y : input });
        console.log(streamObject);
        stream.write(streamObject+'\n');
    });
});




