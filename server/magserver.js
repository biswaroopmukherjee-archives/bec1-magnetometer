// A quick node server to stream magnetometer data to plotly

var serialport = require('serialport');

// Load the Plotly Tokens
const os = require('os');
if (os.homedir()=="/Users/biswaroopmukherjee"){
    // If at home,
    var pt = require('/Users/biswaroopmukherjee/Documents/Physics/Research/Zwierlein/Programs/Setup/plotly_config.json')
}
else {
    // Otherwise, enter your own tokens
    console.log('Please enter your plotly tokens')
}
// Manually enter tokens below:
var plotly = require('plotly')(pt.username, pt.apikey),
    token1 = pt.tokens[0],
    token2 = pt.tokens[1],
    token3 = pt.tokens[2];

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
var initdata = [{x:[], y:[], stream:{token:token1, maxpoints: 500}}];
var initlayout = {fileopt : "extend", filename : "sensor-test-4"};


// Plot the data continuously
plotly.plot(initdata, initlayout, function (err, msg) {
    if (err) return console.log(err)

    console.log(msg);

    var xstream = plotly.stream(token1, function (err, res) {
        console.log(err, res);
    });
    // var ystream = plotly.stream(token2, function (err, res) {
    //     console.log(err, res);
    // });

    sp.on('data', function(input) {
        strArray = input.split(',');
        data = strArray.map(Number);
        // console.log(data[2]+2)

        // if(isNaN(input)) return;

        var xstreamObject = JSON.stringify({ x : getDateString(), y : data[0] + 2});
        // var ystreamObject = JSON.stringify({ x : getDateString(), y : data[1] });

        console.log(xstreamObject);
        // console.log(streamObject2);

        xstream.write(xstreamObject+'\n');
        // ystream.write(ystreamObject+'\n');
    });
});




