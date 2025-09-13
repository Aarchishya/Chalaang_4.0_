// Navigation Service for GPS and Map Integration
export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
  address?: string;
  placeName?: string;
}

export interface NavigationStep {
  instruction: string;
  distance: string;
  duration: string;
  maneuver?: string;
}

export interface Route {
  steps: NavigationStep[];
  totalDistance: string;
  totalDuration: string;
  destination: string;
}

class NavigationService {
  private currentLocation: Location | null = null;
  private watchId: number | null = null;
  private isNavigating = false;
  private currentRoute: Route | null = null;
  private currentStepIndex = 0;
  private stepWaypoints: Location[] = [];
  private autoAdvanceCallback: ((nextInstruction: string) => void) | null = null;
  private lastGeocodeTime = 0;
  private geocodeCache = new Map<string, { address: string; placeName: string }>();
  private forwardGeocodeCache = new Map<string, Location>();
  private lastWeatherCheck = 0;
  private weatherCache = new Map<string, { weather: any; timestamp: number }>();

  // Request GPS permission and get current location with place name
  async getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          // Get place name using reverse geocoding
          const locationWithAddress = await this.reverseGeocode(location);
          
          this.currentLocation = locationWithAddress;
          resolve(locationWithAddress);
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  // Start watching location for navigation with auto-advance
  startLocationWatch(callback: (location: Location) => void, autoAdvanceCallback?: (nextInstruction: string) => void): void {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return;
    }

    this.autoAdvanceCallback = autoAdvanceCallback || null;

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        // Only geocode occasionally to avoid API spam (every 10th update or if no previous location)
        const shouldGeocode = !this.currentLocation || 
          Math.random() < 0.1 || // 10% chance
          this.calculateDistance(this.currentLocation, location) > 0.1; // If moved more than 100m
        
        if (shouldGeocode) {
          // Get place name using reverse geocoding
          const locationWithAddress = await this.reverseGeocode(location);
          this.currentLocation = locationWithAddress;
          callback(locationWithAddress);
        } else {
          // Use previous location data with new coordinates
          const locationWithAddress = {
            ...location,
            address: this.currentLocation?.address || `Location (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`,
            placeName: this.currentLocation?.placeName || 'Current Location'
          };
          this.currentLocation = locationWithAddress;
          callback(locationWithAddress);
        }
        
        // Check for auto-advance
        this.checkForAutoAdvance(location);
      },
      (error) => {
        console.error('Error watching location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );
  }

  // Stop watching location
  stopLocationWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Get directions using OpenRouteService API (free alternative to Google Maps)
  async getDirections(
    _start: Location, 
    destination: string, 
    _mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<Route> {
    try {
      // For demo purposes, we'll use a mock route
      // In production, integrate with OpenRouteService, Mapbox, or Google Maps API
      const mockRoute: Route = {
        steps: [
          {
            instruction: "Head north on Main Street",
            distance: "200m",
            duration: "2 min",
            maneuver: "straight"
          },
          {
            instruction: "Turn right onto Highway 101",
            distance: "1.2km",
            duration: "5 min",
            maneuver: "turn-right"
          },
          {
            instruction: "Continue straight for 3km",
            distance: "3km",
            duration: "8 min",
            maneuver: "straight"
          },
          {
            instruction: "Turn left onto Destination Road",
            distance: "500m",
            duration: "2 min",
            maneuver: "turn-left"
          },
          {
            instruction: "Arrive at destination",
            distance: "0m",
            duration: "0 min",
            maneuver: "arrive"
          }
        ],
        totalDistance: "4.9km",
        totalDuration: "17 min",
        destination
      };

      this.currentRoute = mockRoute;
      return mockRoute;
    } catch (error) {
      console.error('Error getting directions:', error);
      throw error;
    }
  }

  // Get real-time directions using OpenRouteService API
  async getRealDirections(
    start: Location, 
    destination: string, 
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<Route> {
    const API_KEY = import.meta.env.VITE_OPENROUTE_API_KEY || 'your-api-key';
    const profile = mode === 'driving' ? 'driving-car' : mode === 'walking' ? 'foot-walking' : 'cycling-regular';
    
    // Skip API call if using placeholder key
    // if (API_KEY === 'your-api-key' || API_KEY === 'your_api_key_here') {
    //   console.log('🗺️ Using mock navigation data for demo (no API key provided)');
    //   return this.getDirections(start, destination, mode);
    // }
    
    try {
      // First, geocode the destination to get coordinates
      const destinationCoords = await this.forwardGeocode(destination);
      
      if (!destinationCoords) {
        throw new Error('Could not find coordinates for destination');
      }
      
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${API_KEY}&start=${start.longitude},${start.latitude}&end=${destinationCoords.longitude},${destinationCoords.latitude}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Parse OpenRouteService response
      const route = data.features[0];
      const steps: NavigationStep[] = route.properties.segments[0].steps.map((step: any) => ({
        instruction: step.instruction,
        distance: `${Math.round(step.distance)}m`,
        duration: `${Math.round(step.duration / 60)} min`,
        maneuver: step.maneuver?.type || 'straight'
      }));

      const routeData: Route = {
        steps,
        totalDistance: `${Math.round(route.properties.summary.distance / 1000 * 10) / 10}km`,
        totalDuration: `${Math.round(route.properties.summary.duration / 60)} min`,
        destination: destinationCoords.address || destination
      };

      this.currentRoute = routeData;
      return routeData;
    } catch (error) {
      console.error('Error getting real directions:', error);
      // Fallback to mock data
      return this.getDirections(start, destination, mode);
    }
  }

  // Start navigation
  startNavigation(destination: string, mode: 'driving' | 'walking' | 'cycling' = 'driving'): Promise<Route> {
    if (!this.currentLocation) {
      throw new Error('Current location not available');
    }
    
    this.isNavigating = true;
    this.currentStepIndex = 0;
    
    // Try real directions first, fallback to mock if API fails
    return this.getRealDirections(this.currentLocation, destination, mode)
      .catch(error => {
        console.warn('Real directions failed, using mock data:', error);
        return this.getDirections(this.currentLocation!, destination, mode);
      });
  }

  // Stop navigation
  stopNavigation(): void {
    this.isNavigating = false;
    this.currentRoute = null;
    this.currentStepIndex = 0;
    this.stepWaypoints = [];
    this.autoAdvanceCallback = null;
    this.stopLocationWatch();
  }

  // Get current navigation status
  getNavigationStatus(): { isNavigating: boolean; route: Route | null; currentLocation: Location | null } {
    return {
      isNavigating: this.isNavigating,
      route: this.currentRoute,
      currentLocation: this.currentLocation
    };
  }

  // Calculate distance between two points
  calculateDistance(point1: Location, point2: Location): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(point2.latitude - point1.latitude);
    const dLon = this.deg2rad(point2.longitude - point1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(point1.latitude)) * Math.cos(this.deg2rad(point2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Forward geocoding to get coordinates from address
  async forwardGeocode(address: string): Promise<Location | null> {
    try {
      // Check cache first
      const cacheKey = address.toLowerCase().trim();
      if (this.forwardGeocodeCache.has(cacheKey)) {
        return this.forwardGeocodeCache.get(cacheKey)!;
      }
      
      // Rate limiting: wait at least 1 second between API calls
      const now = Date.now();
      if (now - this.lastGeocodeTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - (now - this.lastGeocodeTime)));
      }
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Porter-AI-Navigation/1.0'
          }
        }
      );
      
      this.lastGeocodeTime = Date.now();
      
      if (!response.ok) {
        console.warn(`Geocoding API failed: ${response.status} ${response.statusText}, using mock location`);
        // Return a mock location for demo purposes
        return {
          latitude: 12.9716 + (Math.random() - 0.5) * 0.1, // Bangalore area with some variation
          longitude: 77.5946 + (Math.random() - 0.5) * 0.1,
          address: address,
          placeName: address.split(',')[0]
        };
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const location: Location = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          address: result.display_name,
          placeName: result.name || result.display_name.split(',')[0]
        };
        
        // Cache the result
        this.forwardGeocodeCache.set(cacheKey, location);
        return location;
      }
      
      // Return mock location if no results found
      console.warn(`No geocoding results for "${address}", using mock location`);
      return {
        latitude: 12.9716 + (Math.random() - 0.5) * 0.1,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.1,
        address: address,
        placeName: address.split(',')[0]
      };
    } catch (error) {
      console.error('Forward geocoding error:', error);
      // Return mock location on error
      return {
        latitude: 12.9716 + (Math.random() - 0.5) * 0.1,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.1,
        address: address,
        placeName: address.split(',')[0]
      };
    }
  }

  // Reverse geocoding to get place name from coordinates
  async reverseGeocode(location: Location): Promise<Location> {
    try {
      // Create cache key for this location (rounded to 4 decimal places for caching)
      const cacheKey = `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`;
      
      // Check cache first
      if (this.geocodeCache.has(cacheKey)) {
        const cached = this.geocodeCache.get(cacheKey)!;
        return { ...location, ...cached };
      }
      
      // Rate limiting: wait at least 1 second between API calls
      const now = Date.now();
      if (now - this.lastGeocodeTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - (now - this.lastGeocodeTime)));
      }
      
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Porter-AI-Navigation/1.0'
          }
        }
      );
      
      this.lastGeocodeTime = Date.now();
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        // Extract meaningful parts of the address
        const addressParts = data.display_name.split(', ');
        const placeName = addressParts[0] || 'Unknown Location';
        const city = addressParts[1] || '';
        const state = addressParts[2] || '';
        const country = addressParts[addressParts.length - 1] || '';
        
        const address = [placeName, city, state, country].filter(Boolean).join(', ');
        
        const result = {
          address: address,
          placeName: placeName
        };
        
        // Cache the result
        this.geocodeCache.set(cacheKey, result);
        
        return {
          ...location,
          ...result
        };
      }
      
      return location;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Return location with fallback place name
      return {
        ...location,
        address: `Location (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`,
        placeName: 'Current Location'
      };
    }
  }

  // Get next navigation instruction
  getNextInstruction(): string | null {
    if (!this.currentRoute || !this.isNavigating) {
      return null;
    }
    
    // In a real implementation, you would track the current step
    // For demo, return the first step
    return this.currentRoute.steps[0]?.instruction || null;
  }

  // Check if user is near destination
  isNearDestination(_threshold: number = 0.1): boolean {
    if (!this.currentLocation || !this.currentRoute) {
      return false;
    }
    
    // This would need the actual destination coordinates
    // For demo, return false
    return false;
  }

  // Generate waypoints for each step (simplified for demo)
  generateStepWaypoints(route: Route): Location[] {
    if (!this.currentLocation || !route.steps.length) {
      return [];
    }

    const waypoints: Location[] = [];
    let currentLat = this.currentLocation.latitude;
    let currentLon = this.currentLocation.longitude;

    // Generate approximate waypoints for each step
    route.steps.forEach((_step, _index) => {
      // Simulate waypoint progression (in real app, use actual route coordinates)
      const latOffset = (Math.random() - 0.5) * 0.01; // ~1km variation
      const lonOffset = (Math.random() - 0.5) * 0.01;
      
      currentLat += latOffset;
      currentLon += lonOffset;
      
      waypoints.push({
        latitude: currentLat,
        longitude: currentLon,
        accuracy: 10
      });
    });

    return waypoints;
  }

  // Check if user should auto-advance to next step
  checkForAutoAdvance(currentLocation: Location): void {
    if (!this.isNavigating || !this.currentRoute || !this.autoAdvanceCallback) {
      return;
    }

    // Check if we have waypoints for current step
    if (this.stepWaypoints.length === 0) {
      this.stepWaypoints = this.generateStepWaypoints(this.currentRoute);
    }

    // Check if user is near current step waypoint
    if (this.currentStepIndex < this.stepWaypoints.length) {
      const targetWaypoint = this.stepWaypoints[this.currentStepIndex];
      const distance = this.calculateDistance(currentLocation, targetWaypoint);
      
      // Auto-advance if within 100 meters of waypoint
      if (distance < 0.1) {
        this.advanceToNextStep();
      }
    }
  }

  // Advance to next step automatically
  advanceToNextStep(): void {
    if (!this.currentRoute || !this.autoAdvanceCallback) {
      return;
    }

    this.currentStepIndex++;
    
    if (this.currentStepIndex < this.currentRoute.steps.length) {
      const nextInstruction = this.currentRoute.steps[this.currentStepIndex].instruction;
      this.autoAdvanceCallback(nextInstruction);
    } else {
      // Reached destination
      this.autoAdvanceCallback("Destination reached!");
      this.stopNavigation();
    }
  }

  // Get current step index
  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  // Set current step index (for manual navigation)
  setCurrentStepIndex(stepIndex: number): void {
    if (this.currentRoute && stepIndex >= 0 && stepIndex < this.currentRoute.steps.length) {
      this.currentStepIndex = stepIndex;
    }
  }

  // Check weather at current location
  async checkWeatherAtLocation(location: Location): Promise<string | null> {
    try {
      const cacheKey = `${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}`;
      const now = Date.now();
      
      // Check cache (valid for 10 minutes)
      if (this.weatherCache.has(cacheKey)) {
        const cached = this.weatherCache.get(cacheKey)!;
        if (now - cached.timestamp < 600000) { // 10 minutes
          return this.formatWeatherAlert(cached.weather);
        }
      }
      
      // Rate limiting: wait at least 30 seconds between weather checks
      if (now - this.lastWeatherCheck < 30000) {
        return null;
      }
      
      // Using OpenWeatherMap API (free tier)
      // For demo purposes, we'll use mock data instead of real API
      // In production, replace 'demo' with actual API key from environment
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
      
      // Skip API call for demo and use mock data
    //   if (API_KEY === 'demo' || API_KEY === 'your_api_key_here') {
    //     console.log('🌦️ Using mock weather data for demo (no API key provided)');
    //     const mockWeather = this.getMockWeather();
    //     this.weatherCache.set(cacheKey, { weather: mockWeather, timestamp: now });
    //     return this.formatWeatherAlert(mockWeather);
    //   }
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`
      );
      
      this.lastWeatherCheck = now;
      
      if (!response.ok) {
        console.log('🌦️ Weather API failed, using mock data:', response.status, response.statusText);
        // For demo purposes, return mock weather data
        const mockWeather = this.getMockWeather();
        this.weatherCache.set(cacheKey, { weather: mockWeather, timestamp: now });
        return this.formatWeatherAlert(mockWeather);
      }
      
      const data = await response.json();
      this.weatherCache.set(cacheKey, { weather: data, timestamp: now });
      return this.formatWeatherAlert(data);
      
    } catch (error) {
      console.error('Weather check error:', error);
      // Return mock weather for demo
      const mockWeather = this.getMockWeather();
      return this.formatWeatherAlert(mockWeather);
    }
  }

  // Get mock weather data for demo
  private getMockWeather() {
    const conditions = [
      { main: 'Clear', description: 'clear sky', temp: 28, humidity: 45 },
      { main: 'Clouds', description: 'few clouds', temp: 26, humidity: 55 },
      { main: 'Rain', description: 'light rain', temp: 22, humidity: 85 },
      { main: 'Rain', description: 'moderate rain', temp: 20, humidity: 90 },
      { main: 'Thunderstorm', description: 'thunderstorm', temp: 18, humidity: 95 },
      { main: 'Snow', description: 'light snow', temp: 5, humidity: 80 },
      { main: 'Mist', description: 'mist', temp: 24, humidity: 75 },
      { main: 'Fog', description: 'fog', temp: 23, humidity: 85 },
      { main: 'Clear', description: 'clear sky', temp: 35, humidity: 30 }, // Hot weather
      { main: 'Clouds', description: 'overcast clouds', temp: 25, humidity: 85 } // High humidity
    ];
    
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      weather: [{ main: randomCondition.main, description: randomCondition.description }],
      main: { 
        temp: randomCondition.temp, 
        humidity: randomCondition.humidity 
      },
      wind: { speed: Math.floor(Math.random() * 15) + 5 }
    };
  }

  // Format weather data into alert message
  private formatWeatherAlert(weatherData: any): string | null {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
      return null;
    }

    const condition = weatherData.weather[0].main;
    const description = weatherData.weather[0].description;
    const temp = Math.round(weatherData.main.temp);
    const humidity = weatherData.main.humidity;

    // Weather severity levels
    if (condition === 'Thunderstorm') {
      return `⚡ Severe weather alert: ${description}. Consider stopping navigation.`;
    } else if (condition === 'Rain') {
      return `🌧️ Rain detected: ${description}. Drive slowly and reduce speed.`;
    } else if (condition === 'Snow') {
      return `❄️ Snow conditions: ${description}. Road may be slippery.`;
    } else if (condition === 'Mist' || condition === 'Fog') {
      return `🌫️ Low visibility: ${description}. Turn on headlights and maintain distance.`;
    } else if (condition === 'Clear' && temp > 35) {
      return `☀️ Hot weather: ${temp}°C. Stay hydrated and check vehicle temperature.`;
    } else if (humidity > 80) {
      return `💧 High humidity: ${humidity}%. Road may be slippery.`;
    }

    return null; // No alert needed for normal conditions
  }

  // Check weather before starting navigation
  async checkWeatherAlert(destination: string): Promise<string | null> {
    try {
      const destinationCoords = await this.forwardGeocode(destination);
      if (!destinationCoords) {
        return null;
      }
      
      const weather = await this.checkWeatherAtLocation(destinationCoords);
      return weather;
    } catch (error) {
      console.error('Weather alert check error:', error);
      return null;
    }
  }
}

export default new NavigationService();
