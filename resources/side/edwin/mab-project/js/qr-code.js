import QRCode from 'qrcode';

export function generateQRCodes() {
  const qrCodeCanvas1 = document.getElementById('qr-code-1');
  // const qrCodeCanvas2 = document.getElementById('qr-code-2');

  if (qrCodeCanvas1) {
    const url1 = qrCodeCanvas1.getAttribute('data-url');
    QRCode.toCanvas(qrCodeCanvas1, url1, function (error) {
      if (error) {
        console.error("QR Code 1 generation failed: ", error);
      }
    });
  }

  // if (qrCodeCanvas2) {
  //   const url2 = qrCodeCanvas2.getAttribute('data-url');
  //   QRCode.toCanvas(qrCodeCanvas2, url2, function (error) {
  //     if (error) {
  //       console.error("QR Code 2 generation failed: ", error);
  //     }
  //   });
  // }
}
