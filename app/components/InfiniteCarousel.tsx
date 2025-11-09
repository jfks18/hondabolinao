'use client';

// Perfect Infinite Loop Carousel Component
// This shows how to create a seamless infinite scrolling carousel

interface CarouselItem {
  id: string;
  title: string;
  image: string;
  price: string;
  badge?: string;
}

interface InfiniteCarouselProps {
  items: CarouselItem[];
  speed?: 'slow' | 'normal' | 'fast';
}

export default function InfiniteCarousel({ items, speed = 'normal' }: InfiniteCarouselProps) {
  // Duplicate the items for seamless loop
  const duplicatedItems = [...items, ...items];
  
  const getSpeedClass = () => {
    switch (speed) {
      case 'slow': return 'infinite-scroll-slow';
      case 'fast': return 'infinite-scroll-fast';
      default: return '';
    }
  };

  // Debug: log to see if component is rendering
  console.log('InfiniteCarousel rendering with', items.length, 'items');

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Perfect Infinite Loop Carousel
        </h2>
        <p className="text-gray-600">Seamless scrolling with no flicker or jumps</p>
      </div>

      {/* The carousel wrapper - this is the key! */}
      <div className="carousel-wrapper" style={{border: '2px solid red', padding: '10px'}}>
        <div 
          className="infinite-scroll-debug"
        >
          {duplicatedItems.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="carousel-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              style={{
                flex: '0 0 auto',
                width: '320px',
                margin: '0 24px',
                border: '1px solid blue'
              }}
            >
              <div className="relative">
                {/* Badge if exists */}
                {item.badge && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full z-10">
                    {item.badge}
                  </div>
                )}
                
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 text-center">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                </div>
                
                {/* Image */}
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-center h-32">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Price */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{item.price}</div>
                    <p className="text-xs text-gray-500">Starting price</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Speed Controls */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-600 mb-4">Hover to pause • Different speeds available</p>
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          <span>Slow: 40s per loop</span>
          <span>Normal: 25s per loop</span>
          <span>Fast: 15s per loop</span>
        </div>
      </div>
    </div>
  );
}

// Example usage:
export const sampleCarouselItems: CarouselItem[] = [
 
  {
    id: '2',
    title: 'Honda CLICK125',
    image: 'https://cms.hondaph.com/images/products/680623a88004a.png',
    price: '₱81,900',
    badge: '🥈 #2'
  },
  {
    id: '3',
    title: 'Honda Wave RSX',
    image: 'https://cms.hondaph.com/images/products/65a9dbdb95398.png',
    price: '₱62,900',
    badge: '🥉 #3'
  },
  {
    id: '4',
    title: 'Honda Winner X',
    image: 'https://cms.hondaph.com/images/products/65add5514243d.png',
    price: '₱123,900',
    badge: '🏆 PROMO'
  },
  {
    id: '5',
    title: 'Honda PCX160',
    image: 'https://cms.hondaph.com/images/products/681892ec564cb.png',
    price: '₱133,400',
    badge: '⭐ Premium'
  }
];