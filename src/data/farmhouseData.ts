export interface Room {
  id: string;
  name: string;
  subtitle: string;
  pricePerNight: number;
  priceFormatted: string;
  size: string;
  occupancy: string;
  view: string;
  image: string;
  description: string;
  amenities: string[];
}

export interface Experience {
  id: string;
  title: string;
  tagline: string;
  timing: string;
  iconName: string;
  description: string;
  image: string;
  included: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "all" | "property" | "suites" | "dining" | "surroundings";
  image: string;
  caption: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  guestName: string;
  origin: string;
  tripType: string;
  rating: number;
}

export const FARMHOUSE_INFO = {
  name: "YARKHA",
  tagline: "Stakna Farmhouse · Ladakh",
  subheading: "A Sanctuary on the Banks of the Turquoise Indus River",
  altitude: "3,200 m / 10,500 ft",
  locationName: "Stakna Village, Leh District, Ladakh 194201, India",
  phone: "+91 94191 78901",
  whatsapp: "+919419178901",
  email: "reservations@yarkhafarmhouse.com",
  coordinates: "34.0042° N, 77.6853° E",
  distanceToAirport: "25 minutes from Kushok Bakula Rimpochee Airport (Leh)",
  nearbyLandmarks: [
    "Stakna Monastery (Tiger's Nose) — 5 mins walk",
    "Thiksey Monastery — 10 mins drive",
    "Hemis Monastery — 15 mins drive",
    "Shey Palace & Fish Pond — 12 mins drive",
    "Sindhu Ghat & Indus River Confluence — 8 mins drive"
  ]
};

export const ROOMS: Room[] = [
  {
    id: "stok-kangri-suite",
    name: "The Stok Kangri Royal Suite",
    subtitle: "Panoramic Snow Peaks & Private Solar Deck",
    pricePerNight: 14500,
    priceFormatted: "₹14,500",
    size: "550 sq.ft.",
    occupancy: "2 Adults (1 Extra Bed on request)",
    view: "Stok Kangri Range & Stakna Rock",
    image: "/images/suite-stok.jpg",
    description: "Perched with unobstructed floor-to-ceiling views of the eternal snow peaks. Finished with hand-troweled earthen plaster, reclaimed poplar timber, plush goose down bedding, and a cozy cast-iron Bukhari heater.",
    amenities: [
      "Panoramic Himalayan View",
      "Traditional Bukhari Fireplace",
      "Private Sun Terrace",
      "King Plush Bed & Cashmere Throws",
      "Heated Stone Bathroom & Rain Shower",
      "Organic Herbal Teas & Copper Kettle",
      "High-speed Starlink WiFi",
      "Farmhouse Breakfast Included"
    ]
  },
  {
    id: "indus-riverfront-suite",
    name: "Indus Riverfront Deluxe Suite",
    subtitle: "Private Riverside Balcony & Willow Canopy",
    pricePerNight: 11800,
    priceFormatted: "₹11,800",
    size: "480 sq.ft.",
    occupancy: "2 Adults",
    view: "Turquoise Indus River & Poplar Trees",
    image: "/images/suite-riverfront.jpg",
    description: "Step out onto your private cedar balcony right above the whispering turquoise waters of the sacred Indus. Adorned with hand-carved Ladakhi pillars, antique chogtse low table, and warm sunlit reading nooks.",
    amenities: [
      "Riverfront Wooden Balcony",
      "Hand-carved Ladakhi Woodwork",
      "Sun-warmed Bay Window Lounge",
      "Underfloor Thermal Heating",
      "Fresh Spring Water Carafe",
      "Plush Robes & Organic Toiletries",
      "High-speed Starlink WiFi",
      "Farmhouse Breakfast Included"
    ]
  },
  {
    id: "apricot-orchard-heritage",
    name: "Apricot Orchard Heritage Suite",
    subtitle: "Nestled in Heritage Fruit Trees & Monastery Vista",
    pricePerNight: 9800,
    priceFormatted: "₹9,800",
    size: "400 sq.ft.",
    occupancy: "2 Adults",
    view: "Organic Orchard & Stakna Monastery",
    image: "/images/hero.jpg",
    description: "Bathed in morning sunlight as the bells of Stakna Monastery echo in the distance. Built using century-old rammed-earth techniques naturally regulating temperature, keeping the room pleasantly warm throughout cool Himalayan nights.",
    amenities: [
      "Monastery & Orchard Views",
      "Traditional Earthen Rammed-Wall Insulation",
      "Poplar Beamed Ceiling",
      "Handwoven Wool Blankets",
      "Complimentary Farm Harvest Basket",
      "En-suite Modern Solar Heated Bath",
      "High-speed Starlink WiFi",
      "Farmhouse Breakfast Included"
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: "stakna-sunrise",
    title: "Dawn Prayers at Stakna Monastery",
    tagline: "Spiritual awakening on the Tiger's Nose rock",
    timing: "05:45 AM · Daily",
    iconName: "Sun",
    description: "Cross our peaceful wooden footbridge over the Indus to attend the sacred morning chanting, conch blowing, and butter lamp rituals with the resident monks of Stakna.",
    image: "/images/stakna-valley.jpg",
    included: true
  },
  {
    id: "river-walk",
    title: "Indus Riverside Meditative Walks",
    tagline: "Serene trails through ancient willow & sea buckthorn groves",
    timing: "07:30 AM & 04:30 PM",
    iconName: "Compass",
    description: "Follow gentle trails along the crystal-clear turquoise waters. Spot migratory birds, explore ancient carved mani stone walls, and unwind in pristine nature.",
    image: "/images/suite-riverfront.jpg",
    included: true
  },
  {
    id: "organic-dining",
    title: "Farm-to-Table Ladakhi Culinary Journey",
    tagline: "Heirloom recipes cooked with ingredients picked an hour prior",
    timing: "Lunch & Dinner",
    iconName: "Utensils",
    description: "Savor wood-fired Khambir bread, hand-rolled Skyu, freshly gathered wild herbs, organic apricot preserves, and butter tea prepared in our solar kitchen.",
    image: "/images/dining.jpg",
    included: true
  },
  {
    id: "dark-sky-stargazing",
    title: "High-Altitude Dark Sky Stargazing",
    tagline: "Unrivaled Bortle-1 Milky Way clarity by the open bonfire",
    timing: "08:30 PM · Nightly",
    iconName: "Moon",
    description: "At 3,200m with zero light pollution, marvel at the galactic core through our computerized Dobsonian telescope while sipping steaming seabuckthorn mulled punch.",
    image: "/images/stargazing.jpg",
    included: true
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Yarkha Farmhouse Estate",
    category: "property",
    image: "/images/hero.jpg",
    caption: "Rammed earth and sustainable timber retreat perched beside the Indus with Stakna Monastery overlooking."
  },
  {
    id: "g2",
    title: "The Stok Kangri Suite",
    category: "suites",
    image: "/images/suite-stok.jpg",
    caption: "Unobstructed Himalayan vista, cast-iron wood fireplace, and handcrafted woolen textiles."
  },
  {
    id: "g3",
    title: "Indus River Balcony View",
    category: "suites",
    image: "/images/suite-riverfront.jpg",
    caption: "Wake up to tranquil turquoise waters and golden poplars right from your private timber terrace."
  },
  {
    id: "g4",
    title: "Al-Fresco Orchard Harvest Dining",
    category: "dining",
    image: "/images/dining.jpg",
    caption: "Organic farm breakfast beneath blooming apricot branches with freshly baked Khambir and mountain teas."
  },
  {
    id: "g5",
    title: "Stargazing Courtyard & Hearth",
    category: "property",
    image: "/images/stargazing.jpg",
    caption: "Cozy evenings gathered around the stone fire pit under a brilliant blanket of stars."
  },
  {
    id: "g6",
    title: "Stakna 'Tiger's Nose' Monastery & Valley",
    category: "surroundings",
    image: "/images/stakna-valley.jpg",
    caption: "Perched upon the solitary rocky promontory, just minutes away across our scenic wooden bridge."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote: "Staying at Yarkha was the pinnacle of our Ladakh journey. Waking up to the morning sun glowing on Stakna monastery and hearing the faint temple conch over the rushing Indus was pure magic.",
    guestName: "Ananya & Rohan Mehra",
    origin: "Bengaluru, India",
    tripType: "Couples Himalayan Retreat",
    rating: 5
  },
  {
    id: "t2",
    quote: "Far away from the hustle of Leh town, Yarkha is an architectural masterpiece. The earthen walls, the cast-iron fireplace, and the organic food picked straight from the garden make it unforgettable.",
    guestName: "Julian & Claire Dubois",
    origin: "Lyon, France",
    tripType: "Cultural & Trekking Stay",
    rating: 5
  },
  {
    id: "t3",
    quote: "The night sky here is unreal. We sat around the fire pit with hot sea buckthorn tea looking at the Milky Way stretching across Stok Kangri. Jigmat and the staff treat you like cherished family.",
    guestName: "Tenzin Wangchuk",
    origin: "New Delhi",
    tripType: "Solo Mindfulness Sabbatical",
    rating: 5
  }
];

export const FAQS = [
  {
    q: "How far is Yarkha from Leh city and airport?",
    a: "We are located in scenic Stakna village, approximately 25-30 minutes (21 km) from Kushok Bakula Rimpochee Airport (Leh). We provide seamless private airport transfers in heated 4x4 vehicles."
  },
  {
    q: "How do you assist with high-altitude acclimatization?",
    a: "Stakna sits at 3,200m (slightly lower and much greener than Leh town, offering better oxygen levels due to the surrounding Indus riverbanks and willow trees). We provide complimentary pulse oximeter monitoring, emergency medical oxygen concentrators, and herbal acclimatization teas."
  },
  {
    q: "What is the best time of year to visit Yarkha?",
    a: "May to October offers lush green barley fields, blossoming apricot and apple orchards, and warm sunny days (20-25°C). For winter enthusiasts, November to March offers snow-capped wonderland scenery, stargazing with unmatched atmospheric clarity, and cozy Bukhari fire heating."
  },
  {
    q: "Are meals included, and can you cater to dietary requirements?",
    a: "All room stays include our lavish Farmhouse Breakfast. Our culinary team accommodates vegetarian, vegan, gluten-free, and Jain requirements with 100% organic produce harvested right from our estate."
  },
  {
    q: "What activities can be arranged from the farmhouse?",
    a: "We organize private sunrise monastery visits, rafting on the Indus, day trips to Hemis & Thiksey, guided high-altitude bird watching, village walks, and stargazing telescope sessions."
  }
];
