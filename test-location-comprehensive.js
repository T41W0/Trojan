// Comprehensive location test for Tega's Food
console.log('🧪 Testing Location Functionality...');

// Test 1: Check if geolocation is supported
console.log('📍 Geolocation supported:', !!navigator.geolocation);

// Test 2: Check if we're on HTTPS (required for geolocation in production)
console.log('🔒 HTTPS:', location.protocol === 'https:');

// Test 3: Test getCurrentLocation function
async function testGetCurrentLocation() {
  console.log('🎯 Testing getCurrentLocation...');
  
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      });
    });
    
    console.log('✅ Location obtained:', {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy
    });
    
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  } catch (error) {
    console.error('❌ Error getting location:', error);
    return null;
  }
}

// Test 4: Test reverse geocoding
async function testReverseGeocoding(lat, lng) {
  console.log('🔄 Testing reverse geocoding...');
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.display_name) {
      console.log('✅ Reverse geocoding successful:', data.display_name);
      return data.display_name;
    } else {
      console.log('❌ No address found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error in reverse geocoding:', error);
    return null;
  }
}

// Test 5: Test address geocoding
async function testAddressGeocoding(address) {
  console.log('🗺️ Testing address geocoding...');
  
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=gb`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      console.log('✅ Address geocoding successful:', {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        address: data[0].display_name
      });
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    } else {
      console.log('❌ No coordinates found for address');
      return null;
    }
  } catch (error) {
    console.error('❌ Error in address geocoding:', error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive location tests...\n');
  
  // Test current location
  const location = await testGetCurrentLocation();
  
  if (location) {
    // Test reverse geocoding
    await testReverseGeocoding(location.lat, location.lng);
  }
  
  // Test address geocoding with a known UK address
  await testAddressGeocoding('London, UK');
  await testAddressGeocoding('Manchester, UK');
  await testAddressGeocoding('Birmingham, UK');
  
  console.log('\n✅ All location tests completed!');
}

// Run tests when script loads
runAllTests();
