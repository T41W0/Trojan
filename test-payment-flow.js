// Test Payment Flow Script
// Run this in browser console to test the payment system

console.log('🧪 Testing Payment Flow...');

// Test 1: Check if we're on the right page
function checkCurrentPage() {
  const currentPath = window.location.pathname;
  console.log('📍 Current page:', currentPath);
  
  if (currentPath.includes('/checkout')) {
    console.log('✅ On checkout page');
    return true;
  } else if (currentPath.includes('/orders/')) {
    console.log('✅ On order tracking page');
    return true;
  } else {
    console.log('❌ Not on payment/order page. Navigate to cart first.');
    return false;
  }
}

// Test 2: Check for required elements
function checkPaymentElements() {
  const elements = {
    cardNumber: document.querySelector('input[placeholder*="1234"]'),
    expiryDate: document.querySelector('input[placeholder*="MM/YY"]'),
    cvv: document.querySelector('input[placeholder*="123"]'),
    cardholderName: document.querySelector('input[placeholder*="John"]'),
    payButton: document.querySelector('button[class*="bg-blue-600"]')
  };
  
  console.log('🔍 Checking payment elements:');
  Object.entries(elements).forEach(([name, element]) => {
    if (element) {
      console.log(`✅ ${name}: Found`);
    } else {
      console.log(`❌ ${name}: Not found`);
    }
  });
  
  return Object.values(elements).every(el => el !== null);
}

// Test 3: Fill test payment data
function fillTestPaymentData() {
  console.log('💳 Filling test payment data...');
  
  const testData = {
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: 'Test User'
  };
  
  // Fill card number
  const cardNumberInput = document.querySelector('input[placeholder*="1234"]');
  if (cardNumberInput) {
    cardNumberInput.value = testData.cardNumber;
    cardNumberInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Card number filled');
  }
  
  // Fill expiry date
  const expiryInput = document.querySelector('input[placeholder*="MM/YY"]');
  if (expiryInput) {
    expiryInput.value = testData.expiryDate;
    expiryInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Expiry date filled');
  }
  
  // Fill CVV
  const cvvInput = document.querySelector('input[placeholder*="123"]');
  if (cvvInput) {
    cvvInput.value = testData.cvv;
    cvvInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ CVV filled');
  }
  
  // Fill cardholder name
  const nameInput = document.querySelector('input[placeholder*="John"]');
  if (nameInput) {
    nameInput.value = testData.cardholderName;
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Cardholder name filled');
  }
  
  return true;
}

// Test 4: Check WebSocket connection
function checkWebSocketConnection() {
  console.log('🔌 Checking WebSocket connection...');
  
  // Check if Socket.IO is available
  if (typeof io !== 'undefined') {
    console.log('✅ Socket.IO library loaded');
    return true;
  } else {
    console.log('❌ Socket.IO library not found');
    return false;
  }
}

// Test 5: Simulate payment process
function simulatePayment() {
  console.log('🚀 Simulating payment process...');
  
  const payButton = document.querySelector('button[class*="bg-blue-600"]');
  if (payButton) {
    console.log('✅ Pay button found, clicking...');
    payButton.click();
    return true;
  } else {
    console.log('❌ Pay button not found');
    return false;
  }
}

// Test 6: Check order tracking elements
function checkOrderTrackingElements() {
  console.log('📦 Checking order tracking elements...');
  
  const elements = {
    orderStatus: document.querySelector('[class*="status"]'),
    orderDetails: document.querySelector('[class*="order"]'),
    restaurantInfo: document.querySelector('[class*="restaurant"]'),
    callButton: document.querySelector('button[class*="bg-blue-600"]'),
    supportButton: document.querySelector('button[class*="bg-green-600"]')
  };
  
  Object.entries(elements).forEach(([name, element]) => {
    if (element) {
      console.log(`✅ ${name}: Found`);
    } else {
      console.log(`❌ ${name}: Not found`);
    }
  });
  
  return Object.values(elements).some(el => el !== null);
}

// Test 7: Check real-time updates
function checkRealTimeUpdates() {
  console.log('⚡ Checking real-time updates...');
  
  // Check for WebSocket connection indicator
  const connectionStatus = document.querySelector('[class*="Connected"]');
  if (connectionStatus) {
    console.log('✅ Connection status indicator found');
    return true;
  } else {
    console.log('❌ Connection status not found');
    return false;
  }
}

// Main test function
async function runPaymentTests() {
  console.log('🚀 Starting Payment System Tests...\n');
  
  // Test 1: Check current page
  const onCorrectPage = checkCurrentPage();
  if (!onCorrectPage) {
    console.log('❌ Please navigate to checkout or order page first');
    return;
  }
  
  // Test 2: Check payment elements
  const elementsExist = checkPaymentElements();
  if (!elementsExist) {
    console.log('❌ Payment form elements not found');
    return;
  }
  
  // Test 3: Fill test data
  fillTestPaymentData();
  
  // Test 4: Check WebSocket
  checkWebSocketConnection();
  
  // Test 5: Check order tracking (if on order page)
  if (window.location.pathname.includes('/orders/')) {
    checkOrderTrackingElements();
    checkRealTimeUpdates();
  }
  
  console.log('\n✅ Payment system tests completed!');
  console.log('💡 Next steps:');
  console.log('1. Click the pay button to test payment processing');
  console.log('2. Watch for real-time updates');
  console.log('3. Check if order tracking page loads after payment');
}

// Auto-run tests
runPaymentTests();

// Export functions for manual testing
window.testPayment = {
  checkCurrentPage,
  checkPaymentElements,
  fillTestPaymentData,
  checkWebSocketConnection,
  simulatePayment,
  checkOrderTrackingElements,
  checkRealTimeUpdates,
  runPaymentTests
};

console.log('🔧 Test functions available as window.testPayment');
