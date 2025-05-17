
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Search, Globe, Sun, Mountain, Building, MapPin, Calendar, Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TypewriterText from '@/components/TypewriterText';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

// Extended destinations data with more places
const destinationsData = [
  {
    id: 1,
    name: 'Paris',
    country: 'France',
    continent: 'Europe',
    climate: 'Temperate',
    type: 'City',
    description: 'The City of Light offers iconic attractions like the Eiffel Tower and world-class cuisine.',
    rating: 4.8,
    emoji: '🗼',
    image: 'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?q=80&w=1770&auto=format',
    fullDescription: 'Paris, the capital of France, is known worldwide for its stunning architecture, art museums like the Louvre, iconic Eiffel Tower, and exquisite cuisine. The city is divided by the Seine River and contains numerous landmarks including Notre-Dame Cathedral, Arc de Triomphe, and charming neighborhoods like Montmartre. Paris offers a perfect blend of history, culture, and romance, making it one of the most visited cities in the world.',
    bestTimeToVisit: 'April to June, September to November',
    mustSeeAttractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Montmartre', 'Seine River Cruise']
  },
  {
    id: 2,
    name: 'Bali',
    country: 'Indonesia',
    continent: 'Asia',
    climate: 'Tropical',
    type: 'Beach',
    description: 'A tropical paradise known for beautiful beaches, vibrant coral reefs, and spiritual retreats.',
    rating: 4.7,
    emoji: '🏝️',
    image: 'https://images.unsplash.com/photo-1531060390976-9a6be1eb75dd?q=80&w=1776&auto=format',
    fullDescription: 'Bali is an Indonesian island known for its lush terraced rice fields, varied landscape of hills and mountains, and beautiful beaches. The island is home to religious sites such as cliffside Uluwatu Temple and is renowned for its yoga and meditation retreats. Bali\'s vibrant arts scene includes traditional and modern dance, music, and crafts, while its cuisine offers rich flavors and fresh ingredients.',
    bestTimeToVisit: 'April to October',
    mustSeeAttractions: ['Ubud Sacred Monkey Forest', 'Tanah Lot Temple', 'Tegallalang Rice Terraces', 'Uluwatu Temple', 'Kuta Beach']
  },
  {
    id: 3,
    name: 'Grand Canyon',
    country: 'United States',
    continent: 'North America',
    climate: 'Arid',
    type: 'Mountain',
    description: 'One of the world\'s natural wonders with breathtaking views and hiking trails.',
    rating: 4.9,
    emoji: '🏞️',
    image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?q=80&w=1770&auto=format',
    fullDescription: 'The Grand Canyon, carved by the Colorado River in Arizona, is a massive canyon known for its overwhelming size and intricate landscape. Its layered bands of red rock reveal millions of years of geological history. The canyon averages 10 miles wide and a mile deep, offering some of the most spectacular vistas in the world. Visitors can explore by hiking down into the canyon, taking a helicopter tour, or enjoying the views from the South or North Rim.',
    bestTimeToVisit: 'March to May, September to November',
    mustSeeAttractions: ['South Rim', 'Havasu Falls', 'Bright Angel Trail', 'Desert View Watchtower', 'Colorado River Rafting']
  },
  {
    id: 4,
    name: 'Tokyo',
    country: 'Japan',
    continent: 'Asia',
    climate: 'Temperate',
    type: 'City',
    description: 'A city where traditional culture and cutting-edge technology blend seamlessly.',
    rating: 4.8,
    emoji: '🗾',
    image: 'https://images.unsplash.com/photo-1557409518-691ebcd96038?q=80&w=1770&auto=format',
    fullDescription: 'Tokyo, Japan\'s busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers and anime shops to historic temples and gardens. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding forests. The Imperial Palace sits amid expansive public gardens. Tokyo offers a seemingly unlimited choice of shopping, entertainment, culture, and dining options, making it one of the world\'s most exciting and vibrant cities.',
    bestTimeToVisit: 'March to May, September to November',
    mustSeeAttractions: ['Tokyo Skytree', 'Senso-ji Temple', 'Shibuya Crossing', 'Meiji Shrine', 'Akihabara']
  },
  {
    id: 5,
    name: 'Machu Picchu',
    country: 'Peru',
    continent: 'South America',
    climate: 'Highland',
    type: 'Mountain',
    description: 'An ancient Incan citadel set against a breathtaking mountain backdrop.',
    rating: 4.9,
    emoji: '🏔️',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1974&auto=format',
    fullDescription: 'Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned, it\'s renowned for its sophisticated dry-stone walls that fuse huge blocks without the use of mortar, intriguing buildings that play on astronomical alignments, and panoramic views. Its exact former use remains a mystery. The site can be reached by hiking the Inca Trail or by train and bus from Cusco.',
    bestTimeToVisit: 'May to September',
    mustSeeAttractions: ['Sun Gate', 'Intihuatana Stone', 'Temple of the Sun', 'Huayna Picchu', 'Inca Bridge']
  },
  {
    id: 6,
    name: 'Santorini',
    country: 'Greece',
    continent: 'Europe',
    climate: 'Mediterranean',
    type: 'Beach',
    description: 'Famous for its stunning white buildings with blue domes overlooking the sea.',
    rating: 4.8,
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1469796466635-455ede028aca?q=80&w=1770&auto=format',
    fullDescription: 'Santorini is one of the Cyclades islands in the Aegean Sea, shaped by a massive volcanic eruption that created its rugged landscape. The island is known for its whitewashed, cubic houses in the cliff-top towns of Fira and Oia, which offer stunning views over the submerged caldera. The island features black, red, and white beaches made of volcanic pebbles, dramatic cliffs, and crystal-clear waters, making it one of the most photogenic places in Greece.',
    bestTimeToVisit: 'April to November',
    mustSeeAttractions: ['Oia Sunset', 'Fira Town', 'Red Beach', 'Ancient Akrotiri', 'Amoudi Bay']
  },
  {
    id: 7,
    name: 'Cape Town',
    country: 'South Africa',
    continent: 'Africa',
    climate: 'Mediterranean',
    type: 'City',
    description: 'A beautiful coastal city with Table Mountain as its iconic backdrop.',
    rating: 4.6,
    emoji: '🌊',
    image: 'https://images.unsplash.com/photo-1576485375217-d6a95e34d043?q=80&w=1770&auto=format',
    fullDescription: 'Cape Town is a port city on South Africa\'s southwest coast, on a peninsula beneath the imposing Table Mountain. The city is known for its harbor, beautiful beaches, and landmarks such as Cape Point and Cape of Good Hope. From the flat-topped Table Mountain down to the blue waters of Table Bay, Cape Town is simply stunning. It\'s also a place of immense natural beauty, with many nearby national parks and reserves showcasing the region\'s incredible biodiversity.',
    bestTimeToVisit: 'February to May, September to November',
    mustSeeAttractions: ['Table Mountain', 'Robben Island', 'Cape of Good Hope', 'Kirstenbosch Botanical Gardens', 'V&A Waterfront']
  },
  {
    id: 8,
    name: 'Great Barrier Reef',
    country: 'Australia',
    continent: 'Oceania',
    climate: 'Tropical',
    type: 'Beach',
    description: 'The world\'s largest coral reef system, home to diverse marine life.',
    rating: 4.9,
    emoji: '🐠',
    image: 'https://images.unsplash.com/photo-1540149149182-b8a4c4e57365?q=80&w=1769&auto=format',
    fullDescription: 'The Great Barrier Reef is the world\'s largest coral reef system, composed of over 2,900 individual reefs and 900 islands stretching for over 2,300 kilometers. Located in the Coral Sea off the coast of Queensland, Australia, the reef is a living treasure that hosts an incredible biodiversity, including countless species of colorful fish, mollusks, starfish, turtles, dolphins, and sharks. It\'s an extraordinary underwater wonderland perfect for snorkeling, scuba diving, and exploring by boat.',
    bestTimeToVisit: 'June to October',
    mustSeeAttractions: ['Whitsunday Islands', 'Cairns Underwater Observatory', 'Lady Elliot Island', 'Michaelmas Cay', 'Agincourt Reef']
  },
  {
    id: 9,
    name: 'Venice',
    country: 'Italy',
    continent: 'Europe',
    climate: 'Mediterranean',
    type: 'City',
    description: 'A unique city built on water with a rich history of art and architecture.',
    rating: 4.7,
    emoji: '🚤',
    image: 'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?q=80&w=1774&auto=format',
    fullDescription: 'Venice, the capital of northern Italy\'s Veneto region, is built on more than 100 small islands in a lagoon in the Adriatic Sea. It has no roads, just canals – including the Grand Canal – lined with Renaissance and Gothic palaces. The central square, Piazza San Marco, contains St. Mark\'s Basilica, which is tiled with Byzantine mosaics, and the Campanile bell tower offering views of the city\'s red roofs.',
    bestTimeToVisit: 'April to June, September to November',
    mustSeeAttractions: ['Grand Canal', 'St. Mark\'s Basilica', 'Doge\'s Palace', 'Rialto Bridge', 'Murano Island']
  },
  {
    id: 10,
    name: 'Kyoto',
    country: 'Japan',
    continent: 'Asia',
    climate: 'Temperate',
    type: 'City',
    description: 'Japan\'s cultural capital with numerous temples, gardens and traditional wooden houses.',
    rating: 4.8,
    emoji: '🏯',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1770&auto=format',
    fullDescription: 'Kyoto, once the capital of Japan, is a city on the island of Honshu known for its numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses. The city embodies Japanese culture, featuring traditional kaiseki dining, geisha districts like Gion, and centuries-old ceremonies. With over 1,600 Buddhist temples and 400 Shinto shrines, Kyoto remains a spiritual center and provides a glimpse into Japan\'s rich history and traditions.',
    bestTimeToVisit: 'March to May, October to November',
    mustSeeAttractions: ['Fushimi Inari Shrine', 'Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove', 'Gion District', 'Kiyomizu-dera Temple']
  },
  {
    id: 11,
    name: 'Serengeti',
    country: 'Tanzania',
    continent: 'Africa',
    climate: 'Tropical',
    type: 'Mountain',
    description: 'Famous for its annual migration of wildebeest and diverse wildlife.',
    rating: 4.9,
    emoji: '🦁',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1868&auto=format',
    fullDescription: 'The Serengeti ecosystem is a geographical region in Africa, spanning northern Tanzania and southwestern Kenya. It\'s known for its annual migration of over 1.5 million wildebeest and 250,000 zebra. This vast expanse of grassland savannah also hosts the "Big Five" game (elephant, lion, leopard, buffalo, and rhino), making it an incredible wildlife viewing destination. The protected area includes the Serengeti National Park and several game reserves, preserving one of the oldest and most diverse ecosystems on earth.',
    bestTimeToVisit: 'June to October (dry season), January to February (calving season)',
    mustSeeAttractions: ['Great Migration', 'Grumeti River Crossing', 'Seronera Valley', 'Moru Kopjes', 'Hot Air Balloon Safari']
  },
  {
    id: 12,
    name: 'Rio de Janeiro',
    country: 'Brazil',
    continent: 'South America',
    climate: 'Tropical',
    type: 'City',
    description: 'Vibrant city known for its carnival, beaches, and the iconic Christ the Redeemer statue.',
    rating: 4.6,
    emoji: '🏖️',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1770&auto=format',
    fullDescription: 'Rio de Janeiro, or simply Rio, is the second-most populous city in Brazil and the sixth-most populous in the Americas. Famous for its Christ the Redeemer statue, Copacabana and Ipanema beaches, Sugarloaf Mountain, and its annual Carnival festival, Rio offers a vibrant blend of culture, music, and natural beauty. The city\'s dramatic setting between lush mountains and the Atlantic Ocean creates one of the most stunning urban landscapes in the world.',
    bestTimeToVisit: 'December to March (summer, Carnival), May to October (mild weather)',
    mustSeeAttractions: ['Christ the Redeemer', 'Sugarloaf Mountain', 'Copacabana Beach', 'Tijuca National Park', 'Lapa Steps']
  },
  {
    id: 13,
    name: 'Petra',
    country: 'Jordan',
    continent: 'Asia',
    climate: 'Arid',
    type: 'Mountain',
    description: 'Ancient city carved into rose-colored rock faces, known as the "Rose City."',
    rating: 4.9,
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?q=80&w=1974&auto=format',
    fullDescription: 'Petra is a famous archaeological site in Jordan\'s southwestern desert. Dating to around 300 B.C., it was the capital of the Nabatean Kingdom. Accessed via a narrow canyon called Al Siq, it contains tombs and temples carved into pink sandstone cliffs, earning its nickname, the "Rose City." Its most famous structure is Al Khazneh, a temple with an ornate, Greek-style facade. Petra is a symbol of Jordan\'s rich cultural heritage and one of the New Seven Wonders of the World.',
    bestTimeToVisit: 'March to May, September to November',
    mustSeeAttractions: ['The Treasury (Al Khazneh)', 'The Monastery (Ad Deir)', 'High Place of Sacrifice', 'The Royal Tombs', 'Petra by Night']
  },
  {
    id: 14,
    name: 'Reykjavik',
    country: 'Iceland',
    continent: 'Europe',
    climate: 'Temperate',
    type: 'City',
    description: 'Gateway to Iceland\'s stunning natural landscapes and the Northern Lights.',
    rating: 4.7,
    emoji: '❄️',
    image: 'https://images.unsplash.com/photo-1504280317859-7f6aef78a5c6?q=80&w=1974&auto=format',
    fullDescription: 'Reykjavik, Iceland\'s coastal capital, is renowned for the late-night clubs, geothermal Blue Lagoon spa, and its proximity to the Golden Circle. The city is powered by geothermal energy and is known for its colorful houses, Viking history, and modern design. Despite being the world\'s northernmost capital of a sovereign state, it\'s a vibrant cultural hub with museums, restaurants, and an impressive arts scene. Reykjavik is also the perfect base for exploring Iceland\'s glaciers, waterfalls, and volcanic landscapes.',
    bestTimeToVisit: 'June to August (midnight sun), September to March (Northern Lights)',
    mustSeeAttractions: ['Blue Lagoon', 'Hallgrímskirkja Church', 'Northern Lights', 'Golden Circle', 'Harpa Concert Hall']
  },
  {
    id: 15,
    name: 'New Zealand',
    country: 'New Zealand',
    continent: 'Oceania',
    climate: 'Temperate',
    type: 'Mountain',
    description: 'Breathtaking landscapes from mountains to beaches, famous for Lord of the Rings filming locations.',
    rating: 4.9,
    emoji: '🏔️',
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=1841&auto=format',
    fullDescription: 'New Zealand is an island country in the southwestern Pacific Ocean, known for its stunning landscapes that range from high alpine mountains and glaciers to beautiful beaches and lush rainforests. Made famous as the filming location for "The Lord of the Rings" trilogy, New Zealand offers visitors a wealth of outdoor activities including hiking, skiing, bungee jumping, and water sports. The country is also known for its indigenous Māori culture, unique wildlife, world-class wineries, and friendly locals known as "Kiwis."',
    bestTimeToVisit: 'December to February (summer), June to August (winter sports)',
    mustSeeAttractions: ['Milford Sound', 'Queenstown', 'Rotorua Geothermal Area', 'Bay of Islands', 'Hobbiton Movie Set']
  },
  {
    id: 16,
    name: 'Dubai',
    country: 'United Arab Emirates',
    continent: 'Asia',
    climate: 'Arid',
    type: 'City',
    description: 'Ultra-modern city known for luxury shopping, futuristic architecture, and vibrant nightlife.',
    rating: 4.7,
    emoji: '🏙️',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1770&auto=format',
    fullDescription: 'Dubai is a city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture, and a lively nightlife scene. Burj Khalifa, an 830m-tall tower, dominates the skyscraper-filled skyline. At its foot lies Dubai Fountain, with jets and lights choreographed to music. On artificial islands just offshore is Atlantis, The Palm, a resort with water and marine-animal parks. Dubai has transformed from a humble fishing village to one of the most glamorous tourist destinations in the world.',
    bestTimeToVisit: 'November to March',
    mustSeeAttractions: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Dubai Creek', 'Desert Safari']
  },
  {
    id: 17,
    name: 'Maldives',
    country: 'Maldives',
    continent: 'Asia',
    climate: 'Tropical',
    type: 'Beach',
    description: 'Stunning tropical paradise with overwater bungalows and incredible marine life.',
    rating: 4.9,
    emoji: '🌴',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1965&auto=format',
    fullDescription: 'The Maldives is a tropical nation in the Indian Ocean composed of 26 ring-shaped atolls, which are made up of more than 1,000 coral islands. It\'s known for its beaches, blue lagoons and extensive reefs. The capital, Malé, has a busy fish market, restaurants and shops on the main road, Majeedhee Magu, and 17th-century Hukuru Miskiy (also known as Friday Mosque) made of carved white coral. The Maldives is famous for its overwater bungalows, underwater restaurants, and some of the world\'s best diving and snorkeling sites.',
    bestTimeToVisit: 'November to April',
    mustSeeAttractions: ['Baa Atoll', 'Male Fish Market', 'Artificial Beach', 'National Museum', 'Underwater Scooter']
  },
  {
    id: 18,
    name: 'Barcelona',
    country: 'Spain',
    continent: 'Europe',
    climate: 'Mediterranean',
    type: 'City',
    description: 'Vibrant city known for stunning architecture, beaches, and rich cultural heritage.',
    rating: 4.8,
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1770&auto=format',
    fullDescription: 'Barcelona, the cosmopolitan capital of Spain\'s Catalonia region, is known for its art and architecture. The fantastical Sagrada Família church and other modernist landmarks designed by Antoni Gaudí dot the city. Museu Picasso and Fundació Joan Miró feature modern art by their namesakes. City history museum MUHBA, includes several Roman archaeological sites. Barcelona combines the charm of its medieval Gothic Quarter with the chic style of modern developments, seaside restaurants, and cultural attractions.',
    bestTimeToVisit: 'April to June, September to October',
    mustSeeAttractions: ['Sagrada Familia', 'Park Güell', 'La Rambla', 'Gothic Quarter', 'Camp Nou']
  },
  {
    id: 19,
    name: 'Swiss Alps',
    country: 'Switzerland',
    continent: 'Europe',
    climate: 'Highland',
    type: 'Mountain',
    description: 'Majestic mountain range with world-class ski resorts and breathtaking scenery.',
    rating: 4.9,
    emoji: '⛰️',
    image: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=1769&auto=format',
    fullDescription: 'The Swiss Alps are the portion of the Alps mountain range that lies within Switzerland. The highest summits and largest glaciers of the Alps can be found in the Swiss Alps. The region is famous for its dramatic mountain landscapes, crystal-clear lakes, lush valleys, and picturesque villages. The Swiss Alps are a paradise for outdoor enthusiasts, offering world-class skiing in winter, exceptional hiking in summer, and a range of adventure sports like paragliding and mountain biking throughout the year.',
    bestTimeToVisit: 'December to March (skiing), June to September (hiking)',
    mustSeeAttractions: ['Matterhorn', 'Jungfraujoch', 'Lake Geneva', 'Interlaken', 'Zermatt']
  },
  {
    id: 20,
    name: 'Marrakech',
    country: 'Morocco',
    continent: 'Africa',
    climate: 'Arid',
    type: 'City',
    description: 'Vibrant city featuring a medieval medina, colorful souks, and traditional riads.',
    rating: 4.7,
    emoji: '🕌',
    image: 'https://images.unsplash.com/photo-1531652291485-431206c32556?q=80&w=1921&auto=format',
    fullDescription: 'Marrakech is a major city in the Kingdom of Morocco. It is the fourth largest city in the country, after Casablanca, Fes and Tangier. Located to the north of the foothills of the snow-capped Atlas Mountains, Marrakech is famous for its vibrant souks (marketplaces), gardens, palaces, and mosques. The medina is a densely packed, walled medieval city dating to the Berber Empire, with mazelike alleys where thriving souks sell traditional textiles, pottery, and jewelry. A symbol of the city, and visible for miles, is the Moorish minaret of 12th-century Koutoubia Mosque.',
    bestTimeToVisit: 'March to May, October to November',
    mustSeeAttractions: ['Jemaa el-Fnaa', 'Majorelle Garden', 'Bahia Palace', 'Koutoubia Mosque', 'Medina Souks']
  }
];

// Filter options
const continents = ['All', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
const climates = ['All', 'Tropical', 'Mediterranean', 'Temperate', 'Arid', 'Highland'];
const types = ['All', 'Beach', 'Mountain', 'City'];

// 3D Card effect component
const Card3D = ({ children }: { children: React.ReactNode }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setRotation({ x: rotateX, y: rotateY });
  };
  
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };
  
  return (
    <motion.div 
      className="preserve-3d"
      style={{ 
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: 'transform 0.1s ease'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [selectedClimate, setSelectedClimate] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [planePosition, setPlanePosition] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState<typeof destinationsData[0] | null>(null);
  
  // Plane animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPlanePosition(prev => (prev >= 100 ? -10 : prev + 0.5));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  // Filter destinations based on search term and filters
  const filteredDestinations = destinationsData.filter(destination => {
    const matchesSearch = 
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      destination.country.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesContinent = selectedContinent === 'All' || destination.continent === selectedContinent;
    const matchesClimate = selectedClimate === 'All' || destination.climate === selectedClimate;
    const matchesType = selectedType === 'All' || destination.type === selectedType;
    
    return matchesSearch && matchesContinent && matchesClimate && matchesType;
  });
  
  // Function to render star ratings
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">★</span>);
    }
    
    return <div className="flex">{stars}</div>;
  };

  const handleViewDetails = (destination: typeof destinationsData[0]) => {
    setSelectedDestination(destination);
  };

  return (
    <div className="container py-8 relative overflow-hidden">
      {/* Mountain silhouettes in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute bottom-0 w-full h-48 opacity-5"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none">
            <motion.path
              d="M0,200 Q80,100 200,250 Q280,300 400,200 Q520,100 600,150 Q680,200 800,120 Q920,50 1000,150 L1000,300 L0,300 Z"
              fill="currentColor"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
          </svg>
        </motion.div>
      </div>
      
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <motion.div
          className="absolute text-primary/20"
          style={{ left: '5%', top: '15%' }}
          animate={{ 
            y: [0, -20, 0, 10, 0],
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.1, 1, 0.9, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        >
          <Mountain size={80} />
        </motion.div>
        
        <motion.div
          className="absolute text-accent/20"
          style={{ right: '10%', top: '25%' }}
          animate={{ 
            y: [0, 20, 0, -20, 0],
            rotate: [0, -5, 0, 5, 0],
            scale: [1, 0.9, 1, 1.1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
        >
          <Sun size={60} />
        </motion.div>
      </div>
      
      <div className="flex flex-col relative z-20">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-4xl"
          >
            🌎
          </motion.span>
          <h1 className="text-3xl font-bold mb-2">
            <TypewriterText text="Explore Destinations" />
          </h1>
        </motion.div>
        
        <motion.p 
          className="text-muted-foreground mb-8 ml-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Discover amazing places around the world for your next adventure
        </motion.p>
        
        {/* Search and filters */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              className="pl-10 transition-all duration-300 hover:shadow-md focus:shadow-lg"
              placeholder="Search destinations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="continent" className="w-full lg:w-auto">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="continent">
                <Globe className="mr-2 h-4 w-4" /> Continent
              </TabsTrigger>
              <TabsTrigger value="climate">
                <Sun className="mr-2 h-4 w-4" /> Climate
              </TabsTrigger>
              <TabsTrigger value="type">
                <Mountain className="mr-2 h-4 w-4" /> Type
              </TabsTrigger>
            </TabsList>
            <TabsContent value="continent" className="mt-2">
              <div className="flex flex-wrap gap-2">
                {continents.map(continent => (
                  <Badge 
                    key={continent}
                    variant={selectedContinent === continent ? 'default' : 'outline'}
                    className="cursor-pointer transition-all duration-300 transform hover:scale-105"
                    onClick={() => setSelectedContinent(continent)}
                  >
                    {continent}
                  </Badge>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="climate" className="mt-2">
              <div className="flex flex-wrap gap-2">
                {climates.map(climate => (
                  <Badge 
                    key={climate}
                    variant={selectedClimate === climate ? 'default' : 'outline'}
                    className="cursor-pointer transition-all duration-300 transform hover:scale-105"
                    onClick={() => setSelectedClimate(climate)}
                  >
                    {climate}
                  </Badge>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="type" className="mt-2">
              <div className="flex flex-wrap gap-2">
                {types.map(type => (
                  <Badge 
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    className="cursor-pointer transition-all duration-300 transform hover:scale-105"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {/* Destinations grid with 3D effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredDestinations.map((destination, index) => (
              <motion.div 
                key={destination.id} 
                className="group"
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.05 * index,
                  type: "spring"
                }}
              >
                <Card3D>
                  <Card className="overflow-hidden card-shadow h-full transform transition-all duration-300 hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden">
                      <motion.img 
                        src={destination.image} 
                        alt={destination.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                        whileHover={{ scale: 1.1 }}
                      />
                      <motion.div 
                        className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full text-2xl"
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: 12,
                          transition: { duration: 0.3 }
                        }}
                      >
                        {destination.emoji}
                      </motion.div>
                      <motion.button
                        className="absolute bottom-2 left-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-2 rounded-full text-red-500"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toast.success(`Added ${destination.name} to favorites!`, {
                          icon: "❤️"
                        })}
                      >
                        <Heart size={16} />
                      </motion.button>
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg flex items-center gap-1">
                          <MapPin size={16} className="text-primary" />
                          {destination.name}
                        </h3>
                        <Badge variant="outline" className="transition-all duration-300 hover:bg-accent hover:text-accent-foreground">
                          {destination.type}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2 flex items-center">
                        <Globe size={12} className="mr-1" />
                        {destination.country}
                      </p>
                      <div className="flex items-center gap-1 mb-3">
                        {renderStarRating(destination.rating)}
                        <span className="text-sm text-muted-foreground ml-1">
                          {destination.rating}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {destination.description}
                      </p>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button 
                          variant="outline" 
                          className="w-full transform transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                          onClick={() => handleViewDetails(destination)}
                        >
                          <Calendar className="mr-2 h-4 w-4" /> View Details
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </Card3D>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredDestinations.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-6 inline-block"
            >
              🔍
            </motion.div>
            <p className="text-muted-foreground text-lg">
              No destinations found matching your criteria.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                className="mt-4 transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedContinent('All');
                  setSelectedClimate('All');
                  setSelectedType('All');
                }}
              >
                Reset Filters
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Destination Details Dialog */}
      <Dialog open={!!selectedDestination} onOpenChange={(open) => !open && setSelectedDestination(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <span className="text-3xl">{selectedDestination?.emoji}</span> 
              {selectedDestination?.name}
              <Badge className="ml-2">{selectedDestination?.type}</Badge>
            </DialogTitle>
            <DialogDescription className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              {selectedDestination?.country}, {selectedDestination?.continent}
            </DialogDescription>
          </DialogHeader>

          <div className="relative h-60 sm:h-72 w-full rounded-md overflow-hidden">
            {selectedDestination?.image && (
              <motion.img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>

          <div className="grid gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Rating</h4>
              <div className="flex items-center">
                {selectedDestination && renderStarRating(selectedDestination.rating)}
                <span className="ml-2 text-sm">{selectedDestination?.rating}/5.0</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">About</h4>
              <p className="text-sm text-muted-foreground">
                {selectedDestination?.fullDescription}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Best Time to Visit</h4>
              <p className="text-sm text-muted-foreground">
                {selectedDestination?.bestTimeToVisit}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1">Must-See Attractions</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {selectedDestination?.mustSeeAttractions.map((attraction, index) => (
                  <li key={index}>{attraction}</li>
                ))}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={() => {
              toast.success(`Added ${selectedDestination?.name} to your trip planner!`, {
                icon: "✈️"
              });
            }}>
              Add to Trip Planner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Destinations;
