'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { sessionAPI, orderAPI } from '@/lib/api';
import { PunchOutSession, Order } from '@/types';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import { StatCard, QuickActionCard, FeatureCard } from '@/components/ui';
import Link from 'next/link';


interface DashboardStats {
  totalSessions: number;
  devSessions: number;
  stageSessions: number;
  prodSessions: number;
  recentSessions: PunchOutSession[];
  totalOrders: number;
  totalOrderValue: number;
  recentOrders: Order[];
}

const INITIAL_STATS: DashboardStats = {
  totalSessions: 0,
  devSessions: 0,
  stageSessions: 0,
  prodSessions: 0,
  recentSessions: [],
  totalOrders: 0,
  totalOrderValue: 0,
  recentOrders: [],
};

const QUICK_ACTIONS = [
  {
    href: '/developer/punchout',
    title: 'Start Testing',
    description: 'Execute PunchOut tests across DEV, STAGE, PROD, and S4-DEV environments',
    icon: 'fa-rocket',
    actionText: 'Launch Developer Testing',
    colorScheme: 'purple' as const,
  },
  {
    href: '/sessions',
    title: 'All Sessions',
    description: 'View, filter, and analyze all PunchOut sessions with network request logs',
    icon: 'fa-list',
    actionText: 'Browse Sessions',
    colorScheme: 'blue' as const,
  },
  {
    href: '/converter',
    title: 'Converter',
    description: 'Convert between cXML and JSON formats for development and testing',
    icon: 'fa-exchange-alt',
    actionText: 'Open Converter',
    colorScheme: 'green' as const,
  },
];

const FEATURES = [
  {
    title: 'Network Request Logging',
    description: 'Track all INBOUND and OUTBOUND requests with full payloads, headers, and timing',
    icon: 'fa-network-wired',
    colorScheme: 'blue' as const,
  },
  {
    title: 'Multi-Environment',
    description: 'Test across DEV, STAGE, PROD, and S4-DEV with environment-specific templates',
    icon: 'fa-layer-group',
    colorScheme: 'purple' as const,
  },
  {
    title: 'Custom Templates',
    description: 'Edit cXML payloads with customer-specific templates stored in MongoDB',
    icon: 'fa-file-code',
    colorScheme: 'green' as const,
  },
];

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [allSessions, orderStats, allOrders] = await Promise.all([
        sessionAPI.getAllSessions(),
        orderAPI.getOrderStats().catch(() => ({ totalOrders: 0, totalValue: 0 })),
        orderAPI.getAllOrders().catch(() => []),
      ]);

      const sessionsByEnv = allSessions.reduce(
        (acc, session) => {
          if (session.environment === 'DEVELOPMENT') acc.dev++;
          else if (session.environment === 'STAGING') acc.stage++;
          else if (session.environment === 'PRODUCTION') acc.prod++;
          return acc;
        },
        { dev: 0, stage: 0, prod: 0 }
      );

      const recentSessions = [...allSessions]
        .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
        .slice(0, 5);

      const recentOrders = [...allOrders]
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, 5);

      setStats({
        totalSessions: allSessions.length,
        devSessions: sessionsByEnv.dev,
        stageSessions: sessionsByEnv.stage,
        prodSessions: sessionsByEnv.prod,
        recentSessions,
        totalOrders: orderStats.totalOrders || 0,
        totalOrderValue: orderStats.totalValue || 0,
        recentOrders,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const statCards = useMemo(
    () => [
      { title: 'Total Sessions', value: stats.totalSessions, icon: 'fa-database', colorScheme: 'blue' as const },
      { title: 'Total Orders', value: stats.totalOrders, icon: 'fa-shopping-cart', colorScheme: 'teal' as const },
      { title: 'DEV', value: stats.devSessions, icon: 'fa-code', colorScheme: 'green' as const },
      { title: 'STAGE', value: stats.stageSessions, icon: 'fa-vial', colorScheme: 'orange' as const },
      { title: 'PROD', value: stats.prodSessions, icon: 'fa-check-circle', colorScheme: 'red' as const },
    ],
    [stats]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-4">
              <i className="fas fa-rocket mr-4"></i>
              Waters Punchout Platform
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Test, monitor, and debug your PunchOut integrations across all environments
            </p>
            <div className="flex gap-4">
              <Link
                href="/developer/punchout"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition transform hover:scale-105"
              >
                <i className="fas fa-play mr-2"></i>
                Start Testing
              </Link>
              <Link
                href="/sessions"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-400 transition transform hover:scale-105"
              >
                <i className="fas fa-list mr-2"></i>
                View Sessions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {statCards.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard key={action.href} {...action} />
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        {stats.recentOrders.length > 0 && (
          <RecentOrdersSection orders={stats.recentOrders} />
        )}

        {/* Recent Sessions */}
        <RecentSessionsSection sessions={stats.recentSessions} />

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentOrdersSection({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-shopping-cart text-green-600 mr-3"></i>
          Recent Orders
        </h2>
        <Link href="/orders" className="text-green-600 hover:text-green-800 font-semibold text-sm">
          View All →
        </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.orderId}`}
            className="block px-6 py-4 hover:bg-green-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <code className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded">
                    {order.orderId}
                  </code>
                  <span className="text-sm text-gray-700">{order.customerName}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    <i className="fas fa-calendar mr-1 text-gray-400"></i>
                    {formatDate(order.orderDate)}
                  </span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(order.total, order.currency || 'USD')}
                  </span>
                  <span>
                    <i className="fas fa-box mr-1 text-gray-400"></i>
                    {order.items?.length || 0} items
                  </span>
                </div>
              </div>
              <div className="text-green-600">
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function RecentSessionsSection({ sessions }: { sessions: PunchOutSession[] }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-clock text-blue-600 mr-3"></i>
          Recent Sessions
        </h2>
        <Link href="/sessions" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
          View All →
        </Link>
      </div>
      {sessions.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <Link
              key={session.sessionKey}
              href={`/sessions/${session.sessionKey}`}
              className="block px-6 py-4 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <code className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded">
                      {session.sessionKey}
                    </code>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.operation || '')}`}>
                      {session.operation}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.environment || '')}`}>
                      {session.environment}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      <i className="fas fa-envelope mr-1 text-gray-400"></i>
                      {session.contactEmail || 'No contact'}
                    </span>
                    <span>
                      <i className="fas fa-clock mr-1 text-gray-400"></i>
                      {formatDate(session.sessionDate)}
                    </span>
                  </div>
                </div>
                <div className="text-blue-600">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="px-6 py-12 text-center">
          <i className="fas fa-inbox text-gray-300 text-5xl mb-4"></i>
          <p className="text-gray-500 text-lg">No sessions yet</p>
          <Link
            href="/developer/punchout"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Start Your First Test
          </Link>
        </div>
      )}
    </div>
  );
}
