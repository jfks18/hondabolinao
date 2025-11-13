'use client';

import { useState, useMemo } from 'react';
import ProductCard, { Product } from './ProductCard';
import { useCart } from './CartContext';
import { useInventory } from '../contexts/InventoryContext';

const sampleProducts: Product[] = [
  // Scooters
  {
    id: '1',
    name: 'Honda NAVi',
    price: 58900.00,
    rating: 4.5,
    reviews: 127,
    isNew: false,
    isOnSale: false,
    category: 'Scooters',
    image: 'https://cms.hondaph.com/images/products/686c67e20e69f.png',
    colors: [
      { name: 'Shasta White', hex: '#F8F8FF' },
      { name: 'Patriot Red', hex: '#DC143C' },
      { name: 'Black', hex: '#1C1C1C' },
      { name: 'Ranger Green R', hex: '#355E3B' }
    ],
    specifications: {
      engine: '4-stroke, OHC, Single Cylinder',
      displacement: '109.51cc',
      fuelSystem: 'PGM-FI (Programmed Fuel Injection)',
      transmission: 'Automatic V-Matic',
      brakes: 'Front: Disc, Rear: Drum',
      tires: 'Front: 90/90-12, Rear: 90/90-12'
    }
  },
  {
    id: '2',
    name: 'Honda BeAT (Playful)',
    price: 72400.00,
    rating: 4.8,
    reviews: 89,
    isNew: false,
    isOnSale: false,
    category: 'Scooters',
    image: 'https://cms.hondaph.com/images/products/689d3f4dd42e8.png',
    colors: [
      { name: 'Fighting Red', hex: '#DC143C' },
      { name: 'Pearl Sylvestris Gray', hex: '#708090' },
      { name: 'Pearl Tourmaline Purple', hex: '#9966CC' }
    ],
    specifications: {
      engine: '4-Stroke, SOHC, Air-Cooled, eSP',
      displacement: '110cc',
      fuelSystem: 'PGM-FI (Programmed Fuel Injection)',
      transmission: 'Automatic (V-Matic)',
      brakes: 'Front: Hydraulic Disc, Rear: Mechanical Leading Trailing Drum',
      tires: 'Front: 80/90-14 M/C 40P (Tubeless), Rear: 90/90-14 M/C 46P (Tubeless)'
    }
  },
  {
    id: '3',
    name: 'Honda BeAT (Premium)',
    price: 74400.00,
    rating: 4.6,
    reviews: 234,
    isNew: false,
    isOnSale: false,
    category: 'Scooters',
    image: 'https://cms.hondaph.com/images/products/689daa417aebb.png',
    colors: [
      { name: 'Matte Axis Gray Metallic', hex: '#708090' },
      { name: 'Pearl Arctic White', hex: '#F8F8FF' },
      { name: 'Matte Summit Silver Metallic', hex: '#C0C0C0' }
    ],
    specifications: {
      engine: '4-stroke, SOHC, eSP',
      displacement: '109.51cc',
      fuelSystem: 'PGM-FI (Programmed Fuel Injection)',
      transmission: 'Automatic V-Matic',
      brakes: 'Front: Disc, Rear: Drum',
      tires: 'Front: 90/90-14, Rear: 90/90-14'
    }
  },
  {
    id: '4',
    name: 'Honda CLICK125',
    price: 81900.00,
    rating: 4.3,
    reviews: 156,
    isNew: false,
    isOnSale: false,
    category: 'Scooters',
    image: 'https://cms.hondaph.com/images/products/680623a88004a.png',
    colors: [
      { name: 'Pearl Arctic White', hex: '#F8F8FF' },
      { name: 'Pearl Sylvestris Gray', hex: '#708090' },
      { name: 'Stellar Blue Metallic', hex: '#4682B4' },
      { name: 'Obsidian Black Metallic', hex: '#1C1C1C' }
    ],
    specifications: {
      engine: '4-stroke, SOHC, eSP',
      displacement: '124.89cc',
      fuelSystem: 'PGM-FI (Programmed Fuel Injection)',
      transmission: 'Automatic V-Matic',
      brakes: 'Front: Disc, Rear: Drum',
      tires: 'Front: 90/90-14, Rear: 100/90-14'
    }
  },
  {
    id: '5',
    name: 'Honda CLICK125 (Special Edition)',
    price: 84900.00,
    rating: 4.9,
    reviews: 67,
    isNew: false,
    isOnSale: false,
    category: 'Scooters',
    image: 'https://cms.hondaph.com/images/products/68061739348f8.png',
    colors: [
      { name: 'Obsidian Black Metallic', hex: '#1C1C1C' },
      { name: 'Pearl Arctic White', hex: '#F8F8FF' },
      { name: 'Pearl Crimson Red', hex: '#DC143C' }
    ],
    specifications: {
      engine: '4-stroke, SOHC, eSP',
      displacement: '124.89cc',
      fuelSystem: 'PGM-FI (Programmed Fuel Injection)',
      transmission: 'Automatic V-Matic',
      brakes: 'Front: Disc, Rear: Drum',
      tires: 'Front: 90/90-14, Rear: 100/90-14'
    }
  },
  {
    id: '6',
    name: 'Honda Giorno+',
    price: 101900.00,
    rating: 4.7,
    reviews: 43,
    isNew: false,
    isOnSale: false,
    category: 'Scooters',
    image: 'https://cms.hondaph.com/images/products/6790d446f3664.png',
    colors: [
      { name: 'Virgin Beige', hex: '#F5E6D3' },
      { name: 'Matte Gunpowder Black Metallic', hex: '#2C2C2C' },
      { name: 'Pearl Jubilee White', hex: '#F8F8FF' },
      { name: 'Piquant Orange', hex: '#FF6B35' }
    ],
    specifications: {
      engine: '4-Stroke, 4-Valve, SOHC, Liquid-Cooled, eSP+',
      displacement: '125cc',
      fuelSystem: 'PGM-FI (Programmed Fuel Injection)',
      transmission: 'Automatic (V-Matic)',
      brakes: 'Front: Hydraulic Disc, Rear: Mechanical Leading Trailing',
      tires: 'Front: 100/90-12 59J (Tubeless), Rear: 100/90-12 64J (Tubeless)'
    }
  },
  {
    id: '16',
    name: 'Honda CLICK160',
    price: 116900.00,
    rating: 4.6,
    reviews: 67,
    isNew: false,
    isOnSale: false,
    category: 'Scooters',
    image: 'https://cms.hondaph.com/images/products/66e14d3b6c453.png',
    colors: [
      { name: 'Matte Cosmo Silver Metallic', hex: '#8E9AAF' },
      { name: 'Matte Gunpowder Black Metallic', hex: '#2F3136' },
      { name: 'Matte Solar Red Metallic', hex: '#D32F2F' }
    ],
    specifications: {
      engine: '4-Stroke, 4-Valve, SOHC, Liquid-Cooled, eSP+',
      displacement: '157cc',
      fuelSystem: 'PGM-FI (Programmed Fuel Injection)',
      transmission: 'Automatic (V-Matic)',
      brakes: 'Front: Hydraulic Disc, Rear: Mechanical Leading Trailing',
      tires: 'Front: 100/80-14 M/C 48P (Tubeless), Rear: 120/70-14 M/C 61P (Tubeless)'
    }
  },
  {
    id: '17',
    name: 'Honda PCX160 (Standard Type)',
    price: 133400.00,
    rating: 4.8,
    reviews: 89,
    isNew: false,
    isOnSale: false,
    category: 'Scooters',
    image: 'https://cms.hondaph.com/images/products/681892ec564cb.png',
    colors: [
      { name: 'Vortex Red Metallic', hex: '#B91C1C' },
      { name: 'Pearl Fadeless White', hex: '#FAFAFA' },
      { name: 'Matte Bullet Silver', hex: '#8C92AC' }
    ],
    specifications: {
      engine: '4-Stroke, 4-Valve, SOHC, Liquid-Cooled, eSP+',
      displacement: '157cc',
      fuelSystem: 'PGM-FI (Programmed Fuel Injection)',
      transmission: 'Automatic',
      brakes: 'Front: Hydraulic Disc, Rear: Hydraulic Disc',
      tires: 'Front: 110/70-14MC 50P (Tubeless), Rear: 130/70-13MC 63P (Tubeless)'
    }
  },
  {
    id: '18',
    name: 'Honda PCX160 (RoadSync)',
    price: 154900.00,
    rating: 4.9,
    reviews: 56,
    isNew: false,
    isOnSale: false,
    category: 'Scooters',
    image: 'https://cms.hondaph.com/images/products/6818664a0d981.png',
    colors: [
      { name: 'Matte Gunpowder Black Metallic', hex: '#2C2C2C' },
      { name: 'Pearl Fadeless White', hex: '#FAFAFA' }
    ],
    specifications: {
      engine: '4-Stroke, 4-Valve, SOHC, Liquid-Cooled, eSP+',
      displacement: '157cc',
      fuelSystem: 'PGM-FI (Programmed Fuel Injection)',
      transmission: 'Automatic (V-Matic)',
      brakes: 'Front: Hydraulic Disc, Rear: Mechanical Leading Trailing',
      tires: 'Front: 100/80-14 M/C 48P (Tubeless), Rear: 120/70-14 M/C 61P (Tubeless)'
    }
  },
  {
    id: '19',
    name: 'ADV160',
    price: 166900.00,
    rating: 4.7,
    reviews: 78,
    isNew: false,
    isOnSale: false,
    category: 'Scooters',
    image: 'https://cms.hondaph.com/images/products/63d089a4674af.png',
    colors: [
      { name: 'Matte Gunpowder Black Metallic', hex: '#2C2C2C' },
      { name: 'Matte Solar Red Metallic', hex: '#B91C1C' },
      { name: 'Matte Pearl Crater White', hex: '#F5F5F5' }
    ],
    specifications: {
      engine: '4-Stroke, 4-Valve, SOHC, Liquid-Cooled, eSP+',
      displacement: '157cc',
      fuelSystem: 'PGM-FI (Programmed Fuel Injection)',
      transmission: 'Automatic',
      brakes: 'Front: Hydraulic Disc with ABS, Rear: Hydraulic Disc',
      tires: 'Front: 110/80-14M/C 53P (Tubeless), Rear: 130/70-13M/C 57P (Tubeless)'
    }
  },
  {
    id: '20',
    name: 'Honda ADV350',
    price: 306000.00,
    rating: 4.9,
    reviews: 34,
    isNew: false,
    isOnSale: false,
    category: 'Scooters',
    image: 'https://cms.hondaph.com/images/products/685f504fe9dd4.png',
    colors: [
      { name: 'Matte Gunpowder Black Metallic', hex: '#2C2C2C' },
      { name: 'Moscato Red Metallic', hex: '#8B2635' }
    ],
    specifications: {
      engine: '4-stroke, SOHC',
      displacement: '330cc',
      fuelSystem: 'PGM-FI (Programmed Fuel Injection)',
      transmission: 'Automatic V-Matic',
      brakes: 'Front: Disc, Rear: Disc',
      tires: 'Front: 120/70-15, Rear: 150/70-13'
    }
  },

  // Business
  {
    id: '7',
    name: 'TMX125 Alpha',
    price: 56900.00,
    rating: 4.4,
    reviews: 98,
    isNew: false,
    isOnSale: false,
    category: 'Business',
    image: 'https://hondaph.com/cms/images/products/60175d417e08f.png',
    colors: [
      { name: 'Force Silver Metallic', hex: '#A8A8A8' },
      { name: 'Pearl Nightstar Black', hex: '#1C1C1C' },
      { name: 'Candy Luster Red', hex: '#DC143C' }
    ],
    specifications: {
      engine: '4-Stroke, Over Head Valve (OHV)',
      displacement: '125cc',
      fuelSystem: 'Carburetor',
      transmission: '5-Speed, Constant Mesh (N-1-2-3-4-5)',
      brakes: 'Front: Mechanical Leading Trailing (Drum Brake), Rear: Mechanical Leading Trailing (Drum Brake)',
      tires: 'Front: 2.50 x 18 40L, Rear: 2.75 x 18 48L'
    }
  },
  {
    id: '8',
    name: 'TMX SUPREMO',
    price: 78900.00,
    rating: 4.6,
    reviews: 76,
    isNew: false,
    isOnSale: false,
    category: 'Business',
    image: 'https://cms.hondaph.com/images/products/646f044978f07.png',
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Candy Ruby Red', hex: '#DC143C' }
    ],
    specifications: {
      engine: '4-Stroke, SOHC, Air-Cooled',
      displacement: '149cc',
      fuelSystem: 'Carburetor',
      transmission: '5-Speed, Constant Mesh (N-1-2-3-4-5)',
      brakes: 'Front: Mechanical Leading Trailing (Drum), Rear: Mechanical Leading Trailing (Drum)',
      tires: 'Front: 80/100 - 18 M/C 47P (With Tube), Rear: 90/90 - 18 M/C 51P (With Tube)'
    }
  },

  // Underbone
  {
    id: '9',
    name: 'Honda Wave RSX (Drum)',
    price: 62900.00,
    rating: 4.3,
    reviews: 134,
    isNew: false,
    isOnSale: false,
    category: 'Underbone',
    image: 'https://cms.hondaph.com/images/products/65a9dbdb95398.png',
    colors: [
      { name: 'Infinity Red', hex: '#DC143C' },
      { name: 'Poseidon Black Metallic', hex: '#1C1C1C' }
    ],
    specifications: {
      engine: '4-Stroke, SOHC, Air-Cooled',
      displacement: '109cc',
      fuelSystem: 'PGM-FI',
      transmission: 'Manual, 4-Speed Constant Mesh',
      brakes: 'Front: Mechanical Leading Trailing, Rear: Mechanical Leading Trailing',
      tires: 'Front: 70/90-17M/C 38P (Tube Type), Rear: 80/90-17M/C 50P (Tube Type)'
    }
  },
  {
    id: '10',
    name: 'Wave RSX (DISC)',
    price: 64900.00,
    rating: 4.4,
    reviews: 112,
    isNew: false,
    isOnSale: false,
    category: 'Underbone',
    image: 'https://cms.hondaph.com/images/products/65a9d86129932.png',
    colors: [
      { name: 'Matte Galaxy Black Metallic', hex: '#2C2C2C' },
      { name: 'Pearl Iceberg White', hex: '#FFFEF7' }
    ],
    specifications: {
      engine: '4-Stroke, SOHC, Air-Cooled',
      displacement: '109cc',
      fuelSystem: 'PGM-FI',
      transmission: 'Manual, 4-Speed Constant Mesh',
      brakes: 'Front: Hydraulic Disc, Rear: Mechanical Leading Trailing',
      tires: 'Front: 70/90-17M/C 38P (Tube Type), Rear: 80/90-17M/C 50P (Tube Type)'
    }
  },
  {
    id: '11',
    name: 'Honda XRM125 DS',
    price: 71900.00,
    rating: 4.5,
    reviews: 87,
    isNew: false,
    isOnSale: false,
    category: 'Underbone',
    image: 'https://cms.hondaph.com/images/products/66a49536d9621.png',
    colors: [
      { name: 'Fighting Red', hex: '#DC143C' },
      { name: 'Black', hex: '#000000' },
      { name: 'Aura Blue R', hex: '#1E3A8A' }
    ],
    specifications: {
      engine: '4-Stroke, SOHC, Air-Cooled',
      displacement: '125cc',
      fuelSystem: 'PGM-FI',
      transmission: 'Manual, 4-Speed Constant Mesh',
      brakes: 'Front: Disc, Rear: Drum',
      tires: 'Front: 2.50-17 43L (Tube Type), Rear: 2.50-17 43L (Tube Type)'
    }
  },
  {
    id: '12',
    name: 'Honda XRM125 DSX',
    price: 75400.00,
    rating: 4.6,
    reviews: 95,
    isNew: false,
    isOnSale: false,
    category: 'Underbone',
    image: 'https://cms.hondaph.com/images/products/66a47990eb9ff.png',
    colors: [
      { name: 'Ross White', hex: '#FFFFFF' }
    ],
    specifications: {
      engine: '4-Stroke, SOHC, Air-Cooled',
      displacement: '125cc',
      fuelSystem: 'PGM-FI',
      transmission: 'Manual, 4-Speed Constant Mesh',
      brakes: 'Front: Disc, Rear: Disc',
      tires: 'Front: 2.50-17 43L (Tube Type), Rear: 2.50-17 43L (Tube Type)'
    }
  },
  {
    id: '13',
    name: 'Honda XRM125 MOTARD',
    price: 76900.00,
    rating: 4.7,
    reviews: 68,
    isNew: false,
    isOnSale: false,
    category: 'Underbone',
    image: 'https://cms.hondaph.com/images/products/66a46e84c6c40.png',
    colors: [
      { name: 'Black', hex: '#000000' }
    ],
    specifications: {
      engine: '4-Stroke, SOHC, Air-Cooled',
      displacement: '125cc',
      fuelSystem: 'PGM-FI',
      transmission: 'Manual, 4-Speed Constant Mesh',
      brakes: 'Front: Disc, Rear: Disc',
      tires: 'Front: 70/90-17M/C 38P (Tube Type), Rear: 80/90-17M/C 50P (Tube Type)'
    }
  },
  {
    id: '14',
    name: 'Honda RS125',
    price: 75900.00,
    rating: 4.5,
    reviews: 82,
    isNew: false,
    isOnSale: false,
    category: 'Underbone',
    image: 'https://cms.hondaph.com/images/products/66e26447df321.png',
    colors: [
      { name: 'Matte Axis Gray Metallic', hex: '#6B7280' },
      { name: 'Victory Red', hex: '#DC143C' }
    ],
    specifications: {
      engine: '4-Stroke, SOHC, Air-Cooled',
      displacement: '125cc',
      fuelSystem: 'PGM-Fi',
      transmission: 'Manual, 4-Speed, Constant Mesh',
      brakes: 'Front: Hydraulic Disc, Rear: Drum',
      tires: 'Front: 70/90 - 17 M/C 38P, Rear: 80/90 - 17 M/C 50P'
    }
  },

  // On Road Sports
  {
    id: '15',
    name: 'Honda CBR150R',
    price: 183900.00,
    rating: 4.8,
    reviews: 45,
    isNew: false,
    isOnSale: false,
    category: 'On Road Sports',
    image: 'https://cms.hondaph.com/images/products/67de317939e0a.png',
    colors: [
      { name: 'Winning Red (Honda Tri-Color)', hex: '#DC143C' }
    ],
    specifications: {
      engine: '4-Stroke, 4-Valve, DOHC, Liquid-Cooled',
      displacement: '149cc',
      fuelSystem: 'PGM-FI',
      transmission: 'Manual, 6-Speed Constant Mesh',
      brakes: 'Front: Hydraulic Disk, Rear: Hydraulic Disk',
      tires: 'Front: 100/80-17M/C 52P (Tubeless), Rear: 130/70-17M/C 62P (Tubeless)'
    }
  },

  // Winner X Variants (Featured in Promo)
  {
    id: '21',
    name: 'Honda Winner X (Standard)',
    price: 123900.00,
    rating: 4.7,
    reviews: 156,
    isNew: false,
    isOnSale: true,
    category: 'Underbone',
    image: 'https://cms.hondaph.com/images/products/65add5514243d.png',
    colors: [
      { name: 'Pearl Iceberg White', hex: '#FFFEF7' },
      { name: 'Infinity Red', hex: '#DC143C' }
    ],
    specifications: {
      engine: '4-Stroke, 4-Valve, DOHC, Liquid-Cooled',
      displacement: '149cc',
      fuelSystem: 'PGM-FI',
      transmission: 'Manual, 6-Speed Constant Mesh',
      brakes: 'Front: Hydraulic Disc, Rear: Hydraulic Disc',
      tires: 'Front: 90/80-17M/C 46P (Tubeless), Rear: 120/70-17M/C 58P (Tubeless)'
    }
  },
  {
    id: '22',
    name: 'Honda Winner X (ABS Premium)',
    price: 129900.00,
    rating: 4.8,
    reviews: 98,
    isNew: false,
    isOnSale: true,
    category: 'Underbone',
    image: 'https://cms.hondaph.com/images/products/65adec5ede9eb.png',
    colors: [
      { name: 'Matte Galaxy Black Metallic', hex: '#2C2C2C' },
      { name: 'Matte Meteoric Red Metallic', hex: '#8B0000' }
    ],
    specifications: {
      engine: '4-Stroke, 4-Valve, DOHC, Liquid-Cooled',
      displacement: '149cc',
      fuelSystem: 'PGM-FI',
      transmission: 'Manual, 6-Speed Constant Mesh',
      brakes: 'Front: Hydraulic Disc with ABS, Rear: Hydraulic Disc',
      tires: 'Front: 90/80-17M/C 46P (Tubeless), Rear: 120/70-17M/C 58P (Tubeless)'
    }
  },
  {
    id: '23',
    name: 'Honda Winner X (ABS Racing Type)',
    price: 131900.00,
    rating: 4.9,
    reviews: 67,
    isNew: false,
    isOnSale: true,
    category: 'Underbone',
    image: 'https://cms.hondaph.com/images/products/65adeedc4981f.png',
    colors: [
      { name: 'Infinity Red', hex: '#DC143C' }
    ],
    specifications: {
      engine: '4-Stroke, 4-Valve, DOHC, Liquid-Cooled',
      displacement: '149cc',
      fuelSystem: 'PGM-FI',
      transmission: 'Manual, 6-Speed Constant Mesh',
      brakes: 'Front: Hydraulic Disc with ABS, Rear: Hydraulic Disc',
      tires: 'Front: 90/80-17M/C 46P (Tubeless), Rear: 120/70-17M/C 58P (Tubeless)'
    }
  }
];

const categories = ['All', 'Scooters', 'Business', 'Underbone', 'On Road Sports', 'Off-Road Sports', 'Big Bikes'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' }
];

interface ProductGridProps {
  onAddToWishlist: (product: Product) => void;
}

export default function ProductGrid({ onAddToWishlist }: ProductGridProps) {
  const { addItem } = useCart();
  const { inventory, loading: inventoryLoading, source } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'colors'>('grid');

  // Motorcycle model names mapping
  const motorcycleNames: { [key: string]: string } = {
    '1': 'Honda NAVi',
    '2': 'Honda BeAT (Playful)', 
    '3': 'Honda BeAT (Premium)',
    '4': 'Honda CLICK125',
    '5': 'Honda CLICK125 (Special Edition)',
    '6': 'Honda Giorno+',
    '7': 'TMX125 Alpha',
    '8': 'TMX SUPREMO',
    '9': 'Honda Wave RSX (Drum)',
    '10': 'Wave RSX (DISC)',
    '11': 'Honda XRM125 DS',
    '12': 'Honda XRM125 DSX',
    '13': 'Honda XRM125 MOTARD',
    '14': 'Honda RS125',
    '15': 'Honda CBR150R',
    '16': 'Honda CLICK160',
    '17': 'Honda PCX160 (Standard Type)',
    '18': 'Honda PCX160 (RoadSync)',
    '19': 'ADV160',
    '20': 'Honda ADV350',
    '21': 'Honda Winner X (Standard)',
    '22': 'Honda Winner X (ABS Premium)',
    '23': 'Honda Winner X (ABS Racing Type)'
  };

  // Convert inventory data to Product format
  const realProducts = useMemo(() => {
    const productMap = new Map<string, Product>();

    inventory.forEach(item => {
      const modelId = item.modelId;
      const productName = motorcycleNames[modelId] || `Honda Model ${modelId}`;
      
      if (!productMap.has(modelId)) {
        // Find the sample product for this model to get additional info
        const sampleProduct = sampleProducts.find(p => p.id === modelId);
        
        productMap.set(modelId, {
          id: modelId,
          name: productName,
          price: sampleProduct?.price || 0,
          rating: sampleProduct?.rating || 4.5,
          reviews: sampleProduct?.reviews || 0,
          isNew: sampleProduct?.isNew || false,
          isOnSale: sampleProduct?.isOnSale || false,
          category: sampleProduct?.category || 'Motorcycles',
          image: sampleProduct?.image || 'https://via.placeholder.com/400x300',
          colors: [],
          specifications: sampleProduct?.specifications || {},
          stockInfo: {
            totalStock: 0,
            availableColors: 0,
            isAvailable: false
          }
        });
      }

      const product = productMap.get(modelId)!;
      
      // Add ALL colors to show full range (available and out of stock)
      // Ensure colors array is initialized
      if (!product.colors) {
        product.colors = [];
      }
      const existingColor = product.colors.find(c => c.name === item.colorName);
      if (!existingColor) {
        product.colors.push({
          name: item.colorName,
          hex: item.colorHex,
          stock: item.quantity
        });
      } else {
        // Update stock if color already exists
        existingColor.stock = item.quantity;
      }
      
      // Update stock info
      product.stockInfo!.totalStock += item.quantity;
      product.stockInfo!.availableColors = product.colors?.filter(c => c.stock && c.stock > 0).length || 0;
      product.stockInfo!.isAvailable = product.stockInfo!.totalStock > 0;
    });

    return Array.from(productMap.values()).filter(product => 
      (product.colors?.length || 0) > 0
    );
  }, [inventory]);

  // Use real products if available, otherwise fallback to sample
  const products = realProducts.length > 0 ? realProducts : sampleProducts;

  // Group products by color availability
  const groupProductsByColor = (products: Product[]) => {
    const colorGroups: { [key: string]: { hex: string; products: Product[] } } = {};
    
    products.forEach(product => {
      if (product.colors && product.colors.length > 0) {
        product.colors.forEach(color => {
          if (!colorGroups[color.name]) {
            colorGroups[color.name] = {
              hex: color.hex,
              products: []
            };
          }
          if (!colorGroups[color.name].products.find(p => p.id === product.id)) {
            colorGroups[color.name].products.push(product);
          }
        });
      }
    });
    
    return colorGroups;
  };

  const filteredProducts = products.filter(product => 
    selectedCategory === 'All' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0);
      default:
        return 0;
    }
  });

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            MOTORCYCLES FOR SALE IN THE PHILIPPINES
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover Honda's complete lineup of motorcycles and scooters designed for Filipino riders
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-red-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${
                    viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${
                    viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  ☰
                </button>
                <button
                  onClick={() => setViewMode('colors')}
                  className={`px-3 py-2 ${
                    viewMode === 'colors' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'
                  }`}
                  title="Group by Colors"
                >
                  🎨
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            Showing {sortedProducts.length} products
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </div>
        </div>

        {/* Product Display */}
        {viewMode === 'colors' ? (
          /* Color Grouped View */
          <div className="space-y-8">
            {Object.entries(groupProductsByColor(sortedProducts))
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([colorName, colorData]) => (
                <div key={colorName} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                        style={{ backgroundColor: colorData.hex }}
                      ></div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{colorName}</h3>
                        <p className="text-gray-600">{colorData.products.length} models available</p>
                      </div>
                    </div>
                    <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-semibold">
                      {colorData.products.length} Models
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {colorData.products.map(product => (
                      <div key={`${colorName}-${product.id}`} className="transform hover:scale-105 transition-transform">
                        <ProductCard
                          product={product}
                          onAddToCart={addItem}
                          onAddToWishlist={onAddToWishlist}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          /* Regular Grid/List View */
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addItem}
                onAddToWishlist={onAddToWishlist}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Load More Products
          </button>
        </div>
      </div>
    </section>
  );
}