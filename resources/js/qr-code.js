import QRCode from 'qrcode';

document.addEventListener('DOMContentLoaded', () => {
    // Render the first QR code
    const qrCodeCanvas1 = document.getElementById('qr-code-1');
    if (qrCodeCanvas1) {
        const url1 = qrCodeCanvas1.getAttribute('data-url');
        QRCode.toCanvas(qrCodeCanvas1, url1, function (error) {
            if (error) console.error(error);
        });
    }

    // Render the second QR code
    const qrCodeCanvas2 = document.getElementById('qr-code-2');
    if (qrCodeCanvas2) {
        const url2 = qrCodeCanvas2.getAttribute('data-url');
        QRCode.toCanvas(qrCodeCanvas2, url2, function (error) {
            if (error) console.error(error);
        });
    }
});

