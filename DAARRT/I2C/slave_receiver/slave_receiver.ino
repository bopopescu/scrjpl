// Wire Slave Receiver
// by Nicholas Zambetti <http://www.zambetti.com>

// Demonstrates use of the Wire library
// Receives data as an I2C/TWI slave device
// Refer to the "Wire Master Writer" example for use with this

// Created 29 March 2006

// This example code is in the public domain.


#include <Wire.h>
#include <stdio.h>

void setup()
{
  Wire.begin(7);                // join i2c bus with address #4
  Wire.onReceive(receiveEvent); // register event
  Wire.onRequest(requestEvent); // register event
  Serial.begin(9600);           // start serial for output
}

void loop()
{
  delay(10);
}

// function that executes whenever data is received from master
// this function is registered as an event, see setup()
void receiveEvent(int howMany)
{
  Serial.print("command received");
  byte b;                                                                      // byte from buffer
  int i;                                                                       // integer from buffer
  

    b=Wire.read();                                                             // read a byte from the buffer
 Serial.println(b); 

  //----------------------------------------------------------------------------- valid data packet received ------------------------------
  
  b=Wire.read();                                                               // read pwmfreq from the buffer
 
  Serial.println(b);                                    // change timer 2 clock pre-scaler

  
  i=Wire.read()*256+Wire.read();                                               // read integer from I²C buffer
  Serial.println(i,DEC);
  b=Wire.read(); 
  Serial.println(b);
  // read new left  motor brake status
  
  i=Wire.read()*256+Wire.read();                                               // read integer from I²C buffer
  Serial.println(i,DEC);
  b= Wire.read();                                                         // read new right motor brake status
  Serial.println(b);
  Serial.println("test1");
  int j = 0;
  for(j=0;j<3;j++)                                                        // read position information for 6 servos
  {
    i=Wire.read()*256+Wire.read();                                             // read integer from I²C buffer
    Serial.println(i,DEC);                                                            // read new servo position -- 0 = no servo present
  }
  Serial.println("test2");
  /*i=Wire.read()*256+Wire.read();  
  Serial.println("test2.5");                                           // read integer from I²C buffer
  Serial.println(i,DEC);
  Serial.println("test3");/*
  
  b=Wire.read();       
  Serial.println(b);  // update devibrate setting - default=50 (100mS)
  i=Wire.read()*256+Wire.read();
  Serial.println(i,DEC);
  
  i=Wire.read()*256+Wire.read();                                               // read integer from I²C buffer
  Serial.println(i,DEC);
  
  b=Wire.read();                                                               // read byte from buffer
  Serial.println(b); 
  b=Wire.read();                                                               // read byte from buffer
  Serial.println(b);*/
}

void requestEvent()
{ char*hh = "%hello 012345678912345678";
  hh[0]=15;
  Wire.write(hh); // respond with message of 6 bytes
                       // as expected by master
}
