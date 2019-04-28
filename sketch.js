
let carrier; // this is the oscillator we will hear
let modulator; // this oscillator will modulate the frequency of the carrier

let analyzer; // we'll use this visualize the waveform

// the carrier frequency pre-modulation
let carrierBaseFreq = 220;

// min/max ranges for modulator
let modMaxFreq = 112;
let modMinFreq = 0;
let modMaxDepth = 150;
let modMinDepth = -150;

var serial;   // variable to hold an instance of the serialport library
var portName = 'COM3';    // fill in your serial port name here
var inData;   // variable to hold the input data from Arduino


function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  noFill();

  carrier = new p5.Oscillator('sine');
  carrier.amp(0); // set amplitude
  carrier.freq(carrierBaseFreq); // set frequency
  carrier.start(); // start oscillating

  // try changing the type to 'square', 'sine' or 'triangle'
  modulator = new p5.Oscillator('sawtooth');
  modulator.start();

  // add the modulator's output to modulate the carrier's frequency
  modulator.disconnect();
  carrier.freq(modulator);

  // create an FFT to analyze the audio
  analyzer = new p5.FFT();

  // fade carrier in/out on mouseover / touch start
  toggleAudio(cnv);

  //set up communication port
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
}

function draw() {
  background(30);

  // map mouseY to modulator freq between a maximum and minimum frequency
  // let modFreq = map(mouseY, height, 0, modMinFreq, modMaxFreq);
  let modFreq = 50;
  modulator.freq(modFreq);

  // change the amplitude of the modulator
  // negative amp reverses the sawtooth waveform, and sounds percussive
  //
  let modDepth = map(mouseX, 0, width, modMinDepth, modMaxDepth);
  modulator.amp(modDepth);

  // analyze the waveform
  waveform = analyzer.waveform();

  // draw the shape of the waveform
  stroke(255);
  strokeWeight(10);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, -height / 2, height / 2);
    vertex(x, y + height / 2);
  }
  endShape();

  strokeWeight(1);
  // add a note about what's happening
  text('Modulator Frequency: ' + modFreq.toFixed(3) + ' Hz', 20, 20);
  text(
    'Modulator Amplitude (Modulation Depth): ' + modDepth.toFixed(3),
    20,
    40
  );
  text(
    'Carrier Frequency (pre-modulation): ' + carrierBaseFreq + ' Hz',
    20,
    60
  );
  text(
    'Serial Data in: ' + inData, 20, 80
  );

  if(inData == 0)
  {
      carrier.amp(1.0, 0.01);
  }
  else if(inData == 1)
  {
    carrier.amp(0.0, 1.0);
  }
  else if(inData == 3)
  {
    modFreq++;
  }
  else if(inData == 4)
  {
    modFreq = modFreq - 100;
  }
}

// helper function to toggle sound
function toggleAudio(cnv) {
  cnv.mouseClicked(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.touchStarted(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.mouseClicked(function() {
    carrier.amp(0.0, 1.0);
  });
}

function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
  // Display the list the console:
  print(i + " " + portList[i]);
  }
 }
 
 function serverConnected() {
   print('connected to server.');
 }
 
 function portOpen() {
   print('the serial port opened.')
 }
 
 function serialEvent() {
   inData = Number(serial.read());
 }
 
 function serialError(err) {
   print('Something went wrong with the serial port. ' + err);
 }
 
 function portClose() {
   print('The serial port closed.');
 }
 