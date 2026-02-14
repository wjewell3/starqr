'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeDisplayProps {
  merchantId: string;
  businessName: string;
}

export function QRCodeDisplay({ merchantId, businessName }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const checkInUrl = `${window.location.origin}/c/${merchantId}`;
        
        const dataUrl = await QRCode.toDataURL(checkInUrl, {
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });
        
        setQrCodeUrl(dataUrl);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [merchantId]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `${businessName.replace(/\s+/g, '-')}-QR-Code.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handlePrint = () => {
    if (!qrCodeUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${businessName} - QR Code</title>
          <style>
            body {
              margin: 0;
              padding: 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-family: Arial, sans-serif;
            }
            h1 {
              margin-bottom: 20px;
              text-align: center;
            }
            .instructions {
              text-align: center;
              margin-top: 20px;
              color: #666;
            }
            img {
              max-width: 400px;
              width: 100%;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <h1>${businessName}</h1>
          <h2>Loyalty Rewards</h2>
          <img src="${qrCodeUrl}" alt="QR Code" />
          <div class="instructions">
            <p><strong>Scan to earn stamps!</strong></p>
            <p>Collect stamps with every visit and earn free rewards</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const checkInUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/c/${merchantId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your QR Code</CardTitle>
        <CardDescription>
          Print this and display it at your register for customers to scan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="bg-white p-8 rounded-lg border-2 border-gray-200 flex flex-col items-center">
            {loading ? (
              <div className="w-64 h-64 bg-gray-100 animate-pulse rounded" />
            ) : (
              <>
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-64 h-64"
                />
                <p className="text-sm text-gray-600 mt-4 text-center">
                  Customers scan this to check in
                </p>
              </>
            )}
          </div>

          {/* Check-in URL */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-2 font-medium">Check-in URL:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-white px-3 py-2 rounded border border-gray-200 overflow-x-auto">
                {checkInUrl}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(checkInUrl);
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDownload}
              disabled={loading}
              className="flex-1"
              size="lg"
            >
              📥 Download QR Code
            </Button>
            <Button
              onClick={handlePrint}
              disabled={loading}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              🖨️ Print QR Code
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">💡 Tips:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Print on 8.5" x 11" paper for best results</li>
              <li>• Display near your register or checkout counter</li>
              <li>• Add text like "Scan to earn rewards!"</li>
              <li>• Consider getting a sticker made for durability</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
