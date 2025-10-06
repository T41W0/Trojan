'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Settings } from 'lucide-react';
import { NotificationService } from '@/lib/notificationService';
import toast from 'react-hot-toast';

interface NotificationSettingsProps {
  userId?: string;
}

export default function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    browserNotifications: false,
    emailNotifications: true,
    smsNotifications: true,
    orderUpdates: true,
    promotions: false,
    deliveryUpdates: true
  });

  const [permissionStatus, setPermissionStatus] = useState<string>('default');

  useEffect(() => {
    // Check current notification permission
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
      setSettings(prev => ({
        ...prev,
        browserNotifications: Notification.permission === 'granted'
      }));
    }

    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('notification-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  const handleBrowserNotificationToggle = async () => {
    if (!settings.browserNotifications) {
      // Request permission
      const granted = await NotificationService.requestNotificationPermission();
      setPermissionStatus(Notification.permission);
      
      if (granted) {
        setSettings(prev => ({ ...prev, browserNotifications: true }));
        toast.success('Browser notifications enabled!');
      } else {
        toast.error('Browser notifications permission denied');
      }
    } else {
      setSettings(prev => ({ ...prev, browserNotifications: false }));
      toast.success('Browser notifications disabled');
    }
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('notification-settings', JSON.stringify(settings));
    toast.success('Notification settings saved!');
  };

  const testNotification = async () => {
    if (settings.browserNotifications) {
      NotificationService.showBrowserNotification(
        'Test Notification',
        'This is a test notification from Tega\'s Restaurant!'
      );
    }
    toast.success('Test notification sent!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Bell className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
          <p className="text-sm text-gray-600">Choose how you want to be notified about your orders</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Browser Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-900">Browser Notifications</h3>
              <p className="text-sm text-gray-600">
                Get popup notifications in your browser
                {permissionStatus === 'denied' && (
                  <span className="text-red-600 ml-2">(Permission denied - check browser settings)</span>
                )}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.browserNotifications}
              onChange={handleBrowserNotificationToggle}
              className="sr-only peer"
              disabled={permissionStatus === 'denied'}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive order updates via email</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* SMS Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-900">SMS Notifications</h3>
              <p className="text-sm text-gray-600">Receive order updates via text message</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            What to notify me about
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Order status updates</span>
              <input
                type="checkbox"
                checked={settings.orderUpdates}
                onChange={(e) => handleSettingChange('orderUpdates', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Delivery updates</span>
              <input
                type="checkbox"
                checked={settings.deliveryUpdates}
                onChange={(e) => handleSettingChange('deliveryUpdates', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Promotions and offers</span>
              <input
                type="checkbox"
                checked={settings.promotions}
                onChange={(e) => handleSettingChange('promotions', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={saveSettings}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Settings
          </button>
          
          <button
            onClick={testNotification}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Test Notification
          </button>
        </div>
      </div>
    </div>
  );
}
