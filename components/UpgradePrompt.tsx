'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UpgradePromptProps {
  totalCustomers: number;
  freeTierLimit: number;
  approachingLimit: boolean;
}

export function UpgradePrompt({ totalCustomers, freeTierLimit, approachingLimit }: UpgradePromptProps) {
  if (!approachingLimit) return null;

  const remainingSlots = freeTierLimit - totalCustomers;
  const isAtLimit = remainingSlots === 0;

  return (
    <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">⚠️</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {isAtLimit ? 'Customer Limit Reached' : 'Approaching Customer Limit'}
            </h3>
            <p className="text-gray-700 mb-4">
              {isAtLimit ? (
                <>
                  You've reached the free tier limit of {freeTierLimit} customers. 
                  Upgrade to add unlimited customers and unlock premium features.
                </>
              ) : (
                <>
                  You have <span className="font-bold">{remainingSlots} customer slot{remainingSlots === 1 ? '' : 's'}</span> remaining 
                  on the free tier. Upgrade now for unlimited customers.
                </>
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/upgrade">
                <Button size="lg" className="w-full sm:w-auto">
                  Upgrade to Pro - $9/month
                </Button>
              </Link>
              <Link href="/dashboard/upgrade">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
