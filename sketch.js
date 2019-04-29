
let carrier; 
let modulator; 

let analyzer; 

let carrierBaseFreq = 220;


let modMaxFreq = 112;
let modMinFreq = 0;
let modMaxDepth = 150;
let modMinDepth = -150;
let freqX = 50;
let freqY;

var serial;   
var portName = 'COM3';   
var inData;   


function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  noFill();

  carrier = new p5.Oscillator('sine');
  carrier.amp(0); 
  carrier.freq(carrierBaseFreq); 
  carrier.start(); 

  modulator = new p5.Oscillator('sawtooth');
  modulator.start();


  modulator.disconnect();
  carrier.freq(modulator);


  analyzer = new p5.FFT();

  toggleAudio(cnv);

  serial = new p5.SerialPort();    
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); 
  serial.on('open', portOpen);        
  serial.on('data', serialEvent);     
  serial.on('error', serialError);   
  serial.on('close', portClose);     

  serial.list();                    
  serial.open(portName);         
}

function draw() {
  background(30);

  // map mouseY to modulator freq between a maximum and minimum frequency
  freqY = mouseY;
  let modFreq = map(freqY, height, 0, modMinFreq, modMaxFreq);
  modulator.freq(modFreq);

  // change the amplitude of the modulator
  freqX = mouseX;
  let modDepth = map(freqX, 0, width, modMinDepth, modMaxDepth);
  modulator.amp(modDepth);

  waveform = analyzer.waveform();

 
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
  text('Modulator Frequency: ' + modFreq.toFixed(3) + ' Hz', 20, 20);
  text(
    'Modulator Amplitude (Modulation Depth): ' + modDepth.toFixed(3),
    20,
    40
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
  if(inData == 3)
  {
    console.log("indata = 3");
    freqX++;

  }
  else if(inData == 4)
  {
    console.log("indata = 4");
    freqY++;
  }
  
}

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
  for (var i = 0; i < portList.length; i++) {
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
 