'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardStatsProps {
  totalCustomers: number;
  checkInsThisMonth: number;
  rewardsThisMonth: number;
  planTier: 'free' | 'paid';
  freeTierLimit: number;
  approachingLimit: boolean;
}

export function DashboardStats({
  totalCustomers,
  checkInsThisMonth,
  rewardsThisMonth,
  planTier,
  freeTierLimit,
  approachingLimit,
}: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      subtitle: planTier === 'free' ? `${freeTierLimit - totalCustomers} slots remaining` : 'Unlimited',
      icon: '👥',
      color: approachingLimit ? 'text-orange-600' : 'text-blue-600',
      bgColor: approachingLimit ? 'bg-orange-50' : 'bg-blue-50',
    },
    {
      title: 'Check-ins This Month',
      value: checkInsThisMonth,
      subtitle: 'Total visits',
      icon: '☕',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Rewards Redeemed',
      value: rewardsThisMonth,
      subtitle: 'This month',
      icon: '🎉',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`text-3xl ${stat.color}`}>{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <p className="text-xs text-gray-500">{stat.subtitle}</p>
            
            {/* Warning badge for approaching limit */}
            {stat.title === 'Total Customers' && approachingLimit && planTier === 'free' && (
              <Badge variant="outline" className="mt-2 border-orange-300 text-orange-700 bg-orange-50">
                Approaching limit
              </Badge>
            )}
          </CardContent>
          
          {/* Decorative gradient */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.bgColor} opacity-50`} />
        </Card>
      ))}
    </div>
  );
}
