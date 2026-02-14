'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CheckIn {
  timestamp: string;
  phoneLast4: string;
}

interface RecentCheckInsProps {
  checkIns: CheckIn[];
}

export function RecentCheckIns({ checkIns }: RecentCheckInsProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (checkIns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
          <CardDescription>Customer activity from the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <p className="text-gray-600 mb-2">No check-ins yet</p>
            <p className="text-sm text-gray-500">
              Share your QR code with customers to start tracking visits
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Check-ins</CardTitle>
        <CardDescription>Latest customer visits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checkIns.map((checkIn, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                  ☕
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    •••• {checkIn.phoneLast4}
                  </p>
                  <p className="text-xs text-gray-500">Customer check-in</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {formatTimestamp(checkIn.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
