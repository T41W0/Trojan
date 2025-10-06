// Notification service for order updates
import toast from 'react-hot-toast';

export interface OrderNotification {
  orderId: string;
  orderNumber: string;
  status: string;
  customerEmail: string;
  customerPhone: string;
  restaurantName: string;
  estimatedTime?: string;
}

export class NotificationService {
  // Request browser notification permission
  static async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Show browser notification
  static showBrowserNotification(title: string, body: string, icon?: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'order-update'
      });
    }
  }

  // Show toast notification
  static showToastNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
      default:
        toast(message, { icon: '📱' });
        break;
    }
  }

  // Get status message for notifications
  static getStatusMessage(status: string, orderNumber: string, restaurantName: string): string {
    const statusMessages: { [key: string]: string } = {
      pending: `Your order #${orderNumber} from ${restaurantName} has been placed and is being processed.`,
      confirmed: `Great news! Your order #${orderNumber} from ${restaurantName} has been confirmed and is being prepared.`,
      preparing: `Your order #${orderNumber} from ${restaurantName} is being prepared in the kitchen.`,
      ready: `Your order #${orderNumber} from ${restaurantName} is ready for pickup!`,
      out_for_delivery: `Your order #${orderNumber} from ${restaurantName} is out for delivery and on its way to you!`,
      delivered: `Your order #${orderNumber} from ${restaurantName} has been delivered. Enjoy your meal!`,
      cancelled: `Your order #${orderNumber} from ${restaurantName} has been cancelled.`
    };

    return statusMessages[status] || `Your order #${orderNumber} status has been updated to: ${status}`;
  }

  // Send email notification (mock implementation)
  static async sendEmailNotification(notification: OrderNotification): Promise<boolean> {
    try {
      console.log('📧 Sending email notification:', notification);
      
      // In a real app, this would call an email service like SendGrid, Mailgun, etc.
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: notification.customerEmail,
          subject: `Order Update - ${notification.orderNumber}`,
          template: 'order-update',
          data: notification
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  // Send SMS notification (mock implementation)
  static async sendSMSNotification(notification: OrderNotification): Promise<boolean> {
    try {
      console.log('📱 Sending SMS notification:', notification);
      
      // In a real app, this would call an SMS service like Twilio, AWS SNS, etc.
      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: notification.customerPhone,
          message: this.getStatusMessage(notification.status, notification.orderNumber, notification.restaurantName)
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      return false;
    }
  }

  // Send all notifications for an order update
  static async sendOrderUpdateNotification(notification: OrderNotification): Promise<void> {
    const message = this.getStatusMessage(notification.status, notification.orderNumber, notification.restaurantName);
    
    // Browser notification
    this.showBrowserNotification(
      `Order Update - ${notification.orderNumber}`,
      message
    );

    // Toast notification
    this.showToastNotification(message, 'success');

    // Email notification (if email provided)
    if (notification.customerEmail) {
      await this.sendEmailNotification(notification);
    }

    // SMS notification (if phone provided)
    if (notification.customerPhone) {
      await this.sendSMSNotification(notification);
    }
  }
}
