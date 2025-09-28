'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Bell,
  TrendingUp,
  Activity,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Heart,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useAdmin, withAdminAuth } from '@/components/admin/AdminProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';

// Quick actions configuration

// Quick actions will be generated dynamically based on analytics data

function AdminDashboard() {
  const { user, hasPermission } = useAdmin();
  const {
    analytics,
    isLoadingAnalytics,
    analyticsError,
    activities,
    isLoadingActivities,
    activitiesError,
    hasMoreActivities,
    refreshAnalytics,
    refreshActivities,
    loadMoreActivities,
  } = useAdminAnalytics();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Generate quick actions based on permissions and analytics
  const quickActions = [
    {
      title: 'Send Notification',
      description: 'Send a message to all guests',
      icon: Bell,
      href: '/admin/notifications/send',
      color: 'bg-blue-500',
      permission: 'manage_notifications',
    },
    {
      title: 'Moderate Messages',
      description: 'Review pending guest book messages',
      icon: MessageSquare,
      href: '/admin/guestbook/moderate',
      color: 'bg-yellow-500',
      badge: analytics?.guestbook.pending > 0 ? analytics.guestbook.pending.toString() : undefined,
      permission: 'manage_guestbook',
    },
    {
      title: 'Export RSVPs',
      description: 'Download RSVP data as CSV',
      icon: Users,
      href: '/admin/rsvp/export',
      color: 'bg-green-500',
      permission: 'manage_rsvp',
    },
    {
      title: 'Update Timeline',
      description: 'Add or edit timeline events',
      icon: Calendar,
      href: '/admin/content/timeline',
      color: 'bg-purple-500',
      permission: 'manage_content',
    },
  ].filter(action => hasPermission(action.permission));

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-sage-green to-sage-green/80 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user?.displayName || user?.email}!
              </h1>
              <p className="text-sage-green-100">
                Here's what's happening with your wedding website today.
              </p>
            </div>
            <div className="hidden md:block">
              <Heart className="w-16 h-16 text-blush-pink opacity-20" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* RSVP Stats */}
          {hasPermission('manage_rsvp') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">RSVPs</CardTitle>
                <div className="flex items-center space-x-2">
                  {isLoadingAnalytics && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {analyticsError ? (
                  <div className="text-sm text-red-600">Failed to load data</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {analytics?.rsvps.total || 0}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {analytics?.rsvps.attending || 0} attending
                      </p>
                      <Badge variant="secondary" className="text-green-600">
                        {analytics?.rsvps.trend || '0%'}
                      </Badge>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Attending: {analytics?.rsvps.attending || 0}</span>
                        <span>Not: {analytics?.rsvps.notAttending || 0}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-sage-green h-2 rounded-full" 
                          style={{ 
                            width: `${analytics?.rsvps.total ? (analytics.rsvps.attending / analytics.rsvps.total) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Guest Book Stats */}
          {hasPermission('manage_guestbook') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Guest Messages</CardTitle>
                <div className="flex items-center space-x-2">
                  {isLoadingAnalytics && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {analyticsError ? (
                  <div className="text-sm text-red-600">Failed to load data</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {analytics?.guestbook.total || 0}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {analytics?.guestbook.pending || 0} pending approval
                      </p>
                      <Badge variant="secondary" className="text-blue-600">
                        {analytics?.guestbook.trend || '0%'}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notifications Stats */}
          {hasPermission('manage_notifications') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <div className="flex items-center space-x-2">
                  {isLoadingAnalytics && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {analyticsError ? (
                  <div className="text-sm text-red-600">Failed to load data</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {analytics?.notifications.sent || 0}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {analytics?.notifications.delivered || 0} delivered
                      </p>
                      <Badge variant="secondary" className="text-purple-600">
                        {analytics?.notifications.trend || '0%'}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Analytics Stats */}
          {hasPermission('view_analytics') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Website Traffic</CardTitle>
                <div className="flex items-center space-x-2">
                  {isLoadingAnalytics && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {analyticsError ? (
                  <div className="text-sm text-red-600">Failed to load data</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {analytics?.website.visitors || 0}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {analytics?.website.pageViews || 0} page views
                      </p>
                      <Badge variant="secondary" className="text-orange-600">
                        {analytics?.website.trend || '0%'}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start space-y-2 relative"
                      asChild
                    >
                      <a href={action.href}>
                        <div className="flex items-center justify-between w-full">
                          <div className={`p-2 rounded-lg ${action.color} text-white`}>
                            <action.icon className="w-4 h-4" />
                          </div>
                          {action.badge && (
                            <Badge variant="destructive" className="text-xs">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-sm">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                      </a>
                    </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Activity</span>
                </div>
                <div className="flex items-center space-x-2">
                  {isLoadingActivities && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshActivities}
                    disabled={isLoadingActivities}
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activitiesError ? (
                <div className="text-sm text-red-600 text-center py-4">
                  Failed to load activity data
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.length === 0 && !isLoadingActivities ? (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No recent activity
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-1 rounded-full ${
                          activity.status === 'success' ? 'bg-green-100 text-green-600' :
                          activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                          activity.status === 'info' ? 'bg-blue-100 text-blue-600' :
                          activity.status === 'error' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {activity.status === 'success' && <CheckCircle className="w-4 h-4" />}
                          {activity.status === 'warning' && <AlertTriangle className="w-4 h-4" />}
                          {activity.status === 'info' && <Activity className="w-4 h-4" />}
                          {activity.status === 'error' && <AlertTriangle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {hasMoreActivities && (
                    <div className="text-center pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={loadMoreActivities}
                        disabled={isLoadingActivities}
                      >
                        {isLoadingActivities ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-2" />
                        ) : null}
                        Load More
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Website Status</p>
                  <p className="text-sm text-green-600">All systems operational</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-green-600">Connected and healthy</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-green-600">Service running</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default withAdminAuth(AdminDashboard);
