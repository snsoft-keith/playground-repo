import { SerialPort } from 'serialport';

const port = new SerialPort({
  path: '/dev/cu.usbmodemEpic_Edge1',
  baudRate: 9600,
});

const escposBarcode = Buffer.from([
  0x1d,
  0x6b,
  0x04, // GS k m (Select Code128)
  0x0c, // Length of barcode data
  ...Buffer.from('123456789012'),
  0x00,
]);

port.on('open', () => {
  port.write(escposBarcode, (err) => {
    if (err) console.error('Error:', err);
    else console.log('Barcode sent via ESC/POS');
  });
});
