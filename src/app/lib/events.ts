
export type UniversityEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  category: 'Music' | 'Tech' | 'Sports' | 'Art' | 'Networking';
  description: string;
  price: number;
  image: string;
  ticketsAvailable: number;
  organizer: string;
};

export const MOCK_EVENTS: UniversityEvent[] = [
  {
    id: '1',
    name: 'AlgoRhythm Main Night (algoරිද්ම)',
    date: '2025-05-15',
    time: '18:00',
    location: 'University Grand Auditorium',
    category: 'Music',
    description: 'The flagship musical event of the year, featuring local and international tech-house beats. Experience the rhythm of algorithms.',
    price: 15.00,
    image: 'https://picsum.photos/seed/algo1/1200/600',
    ticketsAvailable: 500,
    organizer: 'Faculty of Computing',
  },
  {
    id: '2',
    name: 'Future AI Summit',
    date: '2025-05-20',
    time: '09:00',
    location: 'Innovation Hub, Floor 4',
    category: 'Tech',
    description: 'A gathering of industry leaders discussing the future of generative AI and its impact on university research.',
    price: 5.00,
    image: 'https://picsum.photos/seed/algo2/800/600',
    ticketsAvailable: 150,
    organizer: 'AI Society',
  },
  {
    id: '3',
    name: 'Code-Strike Hackathon',
    date: '2025-06-01',
    time: '08:00',
    location: 'Main Lab Complex',
    category: 'Tech',
    description: '24 hours of non-stop coding. Build a solution for climate change using university API services.',
    price: 0.00,
    image: 'https://picsum.photos/seed/algo3/800/600',
    ticketsAvailable: 100,
    organizer: 'Developer Student Club',
  },
  {
    id: '4',
    name: 'Inter-Uni Athletics Meet',
    date: '2025-06-10',
    time: '07:00',
    location: 'University Sports Ground',
    category: 'Sports',
    description: 'Witness the fastest students across the country compete for the ultimate championship trophy.',
    price: 3.00,
    image: 'https://picsum.photos/seed/algo4/800/600',
    ticketsAvailable: 2000,
    organizer: 'Sports Council',
  },
  {
    id: '5',
    name: 'Digital Canvas Art Expo',
    date: '2025-06-25',
    time: '10:00',
    location: 'Fine Arts Faculty Lobby',
    category: 'Art',
    description: 'An exhibition of student-created digital art, NFT collections, and traditional paintings.',
    price: 2.00,
    image: 'https://picsum.photos/seed/algo5/800/600',
    ticketsAvailable: 300,
    organizer: 'Art & Design Collective',
  },
  {
    id: '6',
    name: 'Startup Networking Night',
    date: '2025-07-05',
    time: '17:30',
    location: 'Business School Cafe',
    category: 'Networking',
    description: 'Connect with startup founders, university alumni, and venture capitalists in an informal setting.',
    price: 10.00,
    image: 'https://picsum.photos/seed/algo6/800/600',
    ticketsAvailable: 80,
    organizer: 'Entrepreneurship Cell',
  },
];
