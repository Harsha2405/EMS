// Mock Service Worker to intercept API requests when working without a backend
// This file will simulate our backend API endpoints

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

const eventStore = {
  events: [
    {
      id: '1',
      title: 'Web Development Workshop',
      description: 'Learn the fundamentals of modern web development with React and Node.js.',
      startTime: '2025-05-15T10:00:00',
      endTime: '2025-05-15T16:00:00',
      location: 'Tech Hub, 123 Main St'
    },
    {
      id: '2',
      title: 'Design Systems Conference',
      description: 'Join us for a day of talks about building and maintaining design systems at scale.',
      startTime: '2025-06-01T09:00:00',
      endTime: '2025-06-01T17:00:00',
      location: 'Design Center, 456 Park Ave'
    },
    {
      id: '3',
      title: 'AI and Machine Learning Meetup',
      description: 'Connect with AI enthusiasts and learn about the latest advancements in machine learning.',
      startTime: '2025-06-15T18:00:00',
      endTime: '2025-06-15T21:00:00',
      location: 'Innovation Lab, 789 Oak St'
    }
  ]
};

// Helpers
const jsonResponse = (data, status = 200) => new Response(
  JSON.stringify(data),
  {
    status,
    headers: { 'Content-Type': 'application/json' }
  }
);

// Route handling
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only intercept API requests
  if (!url.pathname.startsWith('/api')) {
    return;
  }
  
  event.respondWith(handleRequest(request, url));
});

async function handleRequest(request, url) {
  const { pathname, searchParams } = url;
  const method = request.method;
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // Handle preflight requests
  if (method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 });
  }
  
  // Handle API endpoints
  if (pathname === '/api/events') {
    if (method === 'GET') {
      return jsonResponse(eventStore.events);
    }
    
    if (method === 'POST') {
      const data = await request.json();
      const newEvent = {
        id: String(Date.now()),
        ...data
      };
      
      eventStore.events.push(newEvent);
      return jsonResponse(newEvent, 201);
    }
  }
  
  // Handle event by ID
  const eventIdMatch = pathname.match(/\/api\/events\/(.+)/);
  if (eventIdMatch) {
    const eventId = eventIdMatch[1];
    const eventIndex = eventStore.events.findIndex(e => e.id === eventId);
    
    if (eventIndex === -1) {
      return jsonResponse({ error: 'Event not found' }, 404);
    }
    
    if (method === 'GET') {
      return jsonResponse(eventStore.events[eventIndex]);
    }
    
    if (method === 'PUT') {
      const data = await request.json();
      const updatedEvent = {
        ...eventStore.events[eventIndex],
        ...data,
        id: eventId // Ensure ID doesn't change
      };
      
      eventStore.events[eventIndex] = updatedEvent;
      return jsonResponse(updatedEvent);
    }
    
    if (method === 'DELETE') {
      eventStore.events.splice(eventIndex, 1);
      return jsonResponse({ success: true });
    }
  }
  
  // If no route matches
  return jsonResponse({ error: 'Not found' }, 404);
}