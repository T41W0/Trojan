// Helper functions for emitting events
export const emitOrderUpdate = (orderId: string, data: any) => {
  if (typeof global !== 'undefined' && global.io) {
    global.io.to(`order-${orderId}`).emit('order-update', data);
    console.log(`Emitted order update to order-${orderId}:`, data);
  }
};

export const emitPaymentUpdate = (orderId: string, data: any) => {
  if (typeof global !== 'undefined' && global.io) {
    global.io.to(`order-${orderId}`).emit('payment-update', data);
    console.log(`Emitted payment update to order-${orderId}:`, data);
  }
};

export const emitUserNotification = (userId: string, data: any) => {
  if (typeof global !== 'undefined' && global.io) {
    global.io.to(`user-${userId}`).emit('notification', data);
    console.log(`Emitted notification to user-${userId}:`, data);
  }
};
