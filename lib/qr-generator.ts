import QRCode from 'qrcode';

export async function generateQRCode(merchantId: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_CUSTOMER_URL}/c/${merchantId}`;
  
  try {
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    
    return qrDataUrl;
  } catch (error) {
    console.error('QR generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

export async function generateQRCodeBuffer(merchantId: string): Promise<Buffer> {
  const url = `${process.env.NEXT_PUBLIC_CUSTOMER_URL}/c/${merchantId}`;
  
  try {
    const buffer = await QRCode.toBuffer(url, {
      width: 800,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    
    return buffer;
  } catch (error) {
    console.error('QR buffer generation error:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}

export async function generateQRCodeSVG(merchantId: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_CUSTOMER_URL}/c/${merchantId}`;
  
  try {
    const svg = await QRCode.toString(url, {
      type: 'svg',
      width: 800,
      margin: 4,
    });
    
    return svg;
  } catch (error) {
    console.error('QR SVG generation error:', error);
    throw new Error('Failed to generate QR code SVG');
  }
}
