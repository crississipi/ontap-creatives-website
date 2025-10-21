// scripts/insertProducts.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const productsData = [
  // Business Cards
  {
    name: 'Polyvinyl Business Card',
    price: 799,
    customPrice: 999,
    description: 'Upgrade the way you connect with the Polyvinyl Business Card — built from durable, high-quality polyvinyl that is waterproof, scratch-resistant, and reusable. Designed to last, it is the smarter choice over traditional paper cards. Pair it with NFC or QR code technology for instant sharing and effortless networking.',
    frontUrl: '/images/card-1/front.png',
    backUrl: '/images/card-1/back.png',
    variableFrontImg: '/images/card-5/front.png',
    variableBackImg: '/images/card-5/back.png',
    imgUrl: '',
    category: 'Business Cards'
  },
  {
    name: 'Carbon Fiber Digital Business Card',
    price: 999,
    customPrice: 1199,
    description: 'Upgrade your networking with the Carbon Fiber Digital Business Card — where luxury design meets smart technology. Crafted from premium carbon fiber, it offers a sleek, lightweight, and ultra-durable finish that sets you apart from the ordinary. Featuring NFC tap-to-share and QR code integration, you can exchange contact details, share your brand, and connect instantly — all with just one tap. Say goodbye to reprints and hello to a smarter, eco-friendly way to network.',
    frontUrl: '/images/card-2/front.png',
    backUrl: '/images/card-2/back.png',
    variableFrontImg: '',
    variableBackImg: '',
    imgUrl: '',
    category: 'Business Cards'
  },
  {
    name: 'Bamboo Digital Business Card',
    price: 1499,
    customPrice: 2000,
    description: 'Choose sustainability with style through the Bamboo Digital Business Card. Made from eco-friendly bamboo, this card blends durability, functionality, and modern design to ensure you stand out. Every piece features a distinct natural wood grain, offering a warm and elegant finish that highlights both professionalism and environmental responsibility.',
    frontUrl: '/images/card-3/front.png',
    backUrl: '/images/card-3/back.png',
    variableFrontImg: '',
    variableBackImg: '',
    imgUrl: '',
    category: 'Business Cards'
  },
  {
    name: 'Elite Digital Business Card',
    price: 1199,
    customPrice: 1499,
    description: 'The Elite Digital Business Card offers simplicity at its finest. With a smooth acrylic build and glass-like clarity, it\'s a professional essential that combines modern elegance with lasting durability — perfect for those who value clean, timeless design. Acrylic luxury. Digital convenience. Lasting impression',
    frontUrl: '/images/card-4/front-card.png',
    backUrl: '/images/card-4/back-card.png',
    variableFrontImg: '',
    variableBackImg: '',
    imgUrl: '',
    category: 'Business Cards'
  },
  // Other Products
  {
    name: 'INFOTAP',
    price: 499,
    customPrice: null,
    description: 'Say goodbye to bulky cards! Infotap turns your phone into a smart networking tool. Stick it on, tap, and share your world — whether it\'s Facebook, Instagram, YouTube, or your portfolio. Instant fun, and eco-friendly.',
    frontUrl: '',
    backUrl: '',
    variableFrontImg: '',
    variableBackImg: '',
    imgUrl: '/images/info-tag.png',
    category: 'Other Products'
  },
  {
    name: 'ID TAP',
    price: 1200,
    customPrice: null,
    description: 'ID Tap is designed for professionals and teams who want more than just a traditional ID. It doubles as a digital networking tool, enabling employees to represent the company while seamlessly sharing their digital identity.',
    frontUrl: '',
    backUrl: '',
    variableFrontImg: '',
    variableBackImg: '',
    imgUrl: '/images/id-tap.png',
    category: 'Other Products'
  },
  {
    name: 'Pet Badge',
    price: 0,
    customPrice: null,
    description: 'Pet identification and information badge with digital capabilities.',
    frontUrl: '',
    backUrl: '',
    variableFrontImg: '',
    variableBackImg: '',
    imgUrl: '/images/dog-tag.png',
    category: 'Other Products'
  },
  {
    name: 'POP UP Keychain',
    price: 499,
    customPrice: null,
    description: 'Interactive pop-up keychain with digital features.',
    frontUrl: '',
    backUrl: '',
    variableFrontImg: '',
    variableBackImg: '',
    imgUrl: '/images/key-chain.png',
    category: 'Other Products'
  },
  {
    name: 'QR Standee and Table Tap',
    price: 0,
    customPrice: null,
    description: 'QR code standee and table tap for digital interactions.',
    frontUrl: '',
    backUrl: '',
    variableFrontImg: '',
    variableBackImg: '',
    imgUrl: '/images/qr-standee.png',
    category: 'Other Products'
  }
]

async function insertProducts() {
  try {
    console.log('Starting to insert products...')
    
    // Clear existing products (optional - remove if you want to keep existing data)
    // await prisma.products.deleteMany()
    
    for (const productData of productsData) {
      const product = await prisma.products.create({
        data: productData
      })
      console.log(`Inserted: ${product.name}`)
    }
    
    console.log('All products inserted successfully!')
  } catch (error) {
    console.error('Error inserting products:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
insertProducts()