const int BUTTON = 7; 
int buttonVal = 0;

void setup() {
  Serial.begin(9600);
  pinMode(BUTTON, INPUT); 
}

void loop() {
  int potentiometer = analogRead(A0);
  buttonVal = digitalRead(BUTTON); 
  int mappedPort = map(potentiometer, 0, 1023, 0, 240);
  Serial.write(mappedPort);

  if(buttonVal == HIGH){
    Serial.write(255);
  }  
  
  delay(1);
}
