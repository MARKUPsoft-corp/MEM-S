import type { Collection, Category, Product } from '../types/product'

export const INITIAL_COLLECTIONS: Collection[] = [
  { id: 1, name: 'Hommes', slug: 'men', description: 'Collection masculine traditionnelle', order: 1 },
  { id: 2, name: 'Femmes', slug: 'women', description: 'Collection féminine élégante', order: 2 },
  { id: 3, name: 'Babouches', slug: 'babouches', description: 'Babouches traditionnelles en cuir', order: 3 },
  { id: 4, name: 'Lins', slug: 'lins', description: 'Collection en lin léger', order: 4 }
]

export const INITIAL_CATEGORIES: (Category & { collectionSlug: string })[] = [
  { id: 1, name: 'Boubous', slug: 'boubous', order: 1, collection: INITIAL_COLLECTIONS[0], collectionSlug: 'men' },
  { id: 2, name: 'Gandouras', slug: 'gandouras', order: 2, collection: INITIAL_COLLECTIONS[0], collectionSlug: 'men' },
  { id: 3, name: 'Costumes', slug: 'costumes', order: 3, collection: INITIAL_COLLECTIONS[0], collectionSlug: 'men' },
  { id: 4, name: 'Chemises', slug: 'chemises', order: 4, collection: INITIAL_COLLECTIONS[0], collectionSlug: 'men' },
  { id: 5, name: 'Pantalons', slug: 'pantalons', order: 5, collection: INITIAL_COLLECTIONS[0], collectionSlug: 'men' },
  { id: 6, name: 'Robes', slug: 'robes', order: 6, collection: INITIAL_COLLECTIONS[1], collectionSlug: 'women' },
  { id: 7, name: 'Ensembles', slug: 'ensembles', order: 7, collection: INITIAL_COLLECTIONS[1], collectionSlug: 'women' },
  { id: 8, name: 'Sacs', slug: 'sacs', order: 8, collection: INITIAL_COLLECTIONS[1], collectionSlug: 'women' },
  { id: 9, name: 'Chemises Lin', slug: 'chemises-lin', order: 9, collection: INITIAL_COLLECTIONS[3], collectionSlug: 'lins' },
  { id: 10, name: 'Pantalons Lin', slug: 'pantalons-lin', order: 10, collection: INITIAL_COLLECTIONS[3], collectionSlug: 'lins' },
  { id: 11, name: 'Babouches Cuir', slug: 'babouches-cuir', order: 11, collection: INITIAL_COLLECTIONS[2], collectionSlug: 'babouches' },
  { id: 12, name: 'Babouches Brodées', slug: 'babouches-brodees', order: 12, collection: INITIAL_COLLECTIONS[2], collectionSlug: 'babouches' }
]

// Vraies images Unsplash de haute qualité vérifiées
const unsplashBoubous = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b',
  'https://images.unsplash.com/photo-1445205170230-053b83016050',
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae',
  'https://images.unsplash.com/photo-1558769132-cb1aea1f1f57',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5',
  'https://images.unsplash.com/photo-1467043237213-65f2da53396f',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
  'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3',
]

const unsplashMenFashion = [
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
  'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
  'https://images.unsplash.com/photo-1520975954732-35dd22299614',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
]

const unsplashWomenFashion = [
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e',
  'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3',
]

const unsplashBags = [
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa',
  'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d',
  'https://images.unsplash.com/photo-1575032617751-6ddec2089882',
  'https://images.unsplash.com/photo-1591561954557-26941169b49e',
]

const unsplashLinen = [
  'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
  'https://images.unsplash.com/photo-1603252109303-2751441dd157',
  'https://images.unsplash.com/photo-1562157873-818bc0726f68',
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0',
  'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e',
]

const unsplashShoes = [
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77',
  'https://images.unsplash.com/photo-1608256246200-53e635b5b65f',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  'https://images.unsplash.com/photo-1533867617858-e7b97e060509',
]

const buildProducts = (): Product[] => {
  const products: Product[] = []
  let id = 1

  // 1. Boubous (12)
  const catBoubous = INITIAL_CATEGORIES[0]
  for (let i = 1; i <= 12; i++) {
    const imgUrl = unsplashBoubous[(i - 1) % unsplashBoubous.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Boubou Traditionnel ${i}`,
      slug: `boubou-traditionnel-${i}`,
      description: `Magnifique boubou traditionnel africain ${i}, confectionné avec des tissus de haute qualité. Parfait pour les occasions spéciales.`,
      category: catBoubous,
      price: 45000 + (i * 5000),
      discount_price: i % 3 === 0 ? 40000 + (i * 4000) : undefined,
      is_new: i <= 6,
      is_featured: i <= 2,
      stock: 10,
      images: [
        { id: 1, image: imgUrl, is_primary: true, order: 1 },
        { id: 2, image: imgUrl, is_primary: false, order: 2 }
      ],
      variants: [],
      created_at: new Date(Date.now() - i * 86400000).toISOString()
    })
  }

  // 2. Gandouras (8)
  const catGandouras = INITIAL_CATEGORIES[1]
  for (let i = 1; i <= 8; i++) {
    const imgUrl = unsplashMenFashion[(i - 1) % unsplashMenFashion.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Gandoura Élégante ${i}`,
      slug: `gandoura-elegante-${i}`,
      description: `Gandoura élégante ${i} pour homme, style moderne et traditionnel. Confort et élégance garantis.`,
      category: catGandouras,
      price: 35000 + (i * 3000),
      discount_price: i % 2 === 0 ? 30000 + (i * 2500) : undefined,
      is_new: i <= 4,
      is_featured: i === 1 || i === 4,
      stock: 8,
      images: [{ id: 1, image: imgUrl, is_primary: true, order: 1 }],
      variants: [],
      created_at: new Date(Date.now() - (i + 12) * 86400000).toISOString()
    })
  }

  // 3. Costumes (6)
  const catCostumes = INITIAL_CATEGORIES[2]
  for (let i = 1; i <= 6; i++) {
    const imgUrl = unsplashMenFashion[(i + 1) % unsplashMenFashion.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Costume Moderne ${i}`,
      slug: `costume-moderne-${i}`,
      description: `Costume moderne ${i} pour homme d'affaires. Coupe impeccable et finitions soignées.`,
      category: catCostumes,
      price: 95000 + (i * 8000),
      discount_price: i % 2 === 0 ? 85000 + (i * 7000) : undefined,
      is_new: i <= 3,
      is_featured: i === 2,
      stock: 5,
      images: [{ id: 1, image: imgUrl, is_primary: true, order: 1 }],
      variants: [],
      created_at: new Date(Date.now() - (i + 20) * 86400000).toISOString()
    })
  }

  // 4. Chemises Hommes (8)
  const catChemises = INITIAL_CATEGORIES[3]
  for (let i = 1; i <= 8; i++) {
    const imgUrl = unsplashMenFashion[(i + 2) % unsplashMenFashion.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Chemise Africaine ${i}`,
      slug: `chemise-africaine-${i}`,
      description: `Chemise africaine ${i} pour homme. Motifs traditionnels et coupe moderne.`,
      category: catChemises,
      price: 25000 + (i * 2000),
      discount_price: i % 3 === 0 ? 22000 + (i * 1500) : undefined,
      is_new: i <= 4,
      is_featured: i === 3,
      stock: 12,
      images: [{ id: 1, image: imgUrl, is_primary: true, order: 1 }],
      variants: [],
      created_at: new Date(Date.now() - (i + 26) * 86400000).toISOString()
    })
  }

  // 5. Pantalons Hommes (6)
  const catPantalons = INITIAL_CATEGORIES[4]
  for (let i = 1; i <= 6; i++) {
    const imgUrl = unsplashMenFashion[(i + 3) % unsplashMenFashion.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Pantalon Traditionnel ${i}`,
      slug: `pantalon-traditionnel-${i}`,
      description: `Pantalon traditionnel ${i} pour homme. Confortable et élégant.`,
      category: catPantalons,
      price: 30000 + (i * 3000),
      discount_price: i % 2 === 0 ? 27000 + (i * 2500) : undefined,
      is_new: i <= 3,
      is_featured: false,
      stock: 10,
      images: [{ id: 1, image: imgUrl, is_primary: true, order: 1 }],
      variants: [],
      created_at: new Date(Date.now() - (i + 34) * 86400000).toISOString()
    })
  }

  // 6. Robes (10)
  const catRobes = INITIAL_CATEGORIES[5]
  for (let i = 1; i <= 10; i++) {
    const imgUrl = unsplashWomenFashion[(i - 1) % unsplashWomenFashion.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Robe Africaine ${i}`,
      slug: `robe-africaine-${i}`,
      description: `Robe africaine ${i} pour femme. Design authentique et moderne.`,
      category: catRobes,
      price: 55000 + (i * 4000),
      discount_price: i % 3 === 0 ? 50000 + (i * 3500) : undefined,
      is_new: i <= 5,
      is_featured: i === 1 || i === 5,
      stock: 8,
      images: [{ id: 1, image: imgUrl, is_primary: true, order: 1 }],
      variants: [],
      created_at: new Date(Date.now() - (i + 40) * 86400000).toISOString()
    })
  }

  // 7. Ensembles (8)
  const catEnsembles = INITIAL_CATEGORIES[6]
  for (let i = 1; i <= 8; i++) {
    const imgUrl = unsplashWomenFashion[(i + 2) % unsplashWomenFashion.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Ensemble Élégant ${i}`,
      slug: `ensemble-elegant-${i}`,
      description: `Ensemble élégant ${i} pour femme. Coordination parfaite.`,
      category: catEnsembles,
      price: 75000 + (i * 5000),
      discount_price: i % 2 === 0 ? 68000 + (i * 4500) : undefined,
      is_new: i <= 4,
      is_featured: i === 2,
      stock: 6,
      images: [{ id: 1, image: imgUrl, is_primary: true, order: 1 }],
      variants: [],
      created_at: new Date(Date.now() - (i + 50) * 86400000).toISOString()
    })
  }

  // 8. Sacs (6)
  const catSacs = INITIAL_CATEGORIES[7]
  for (let i = 1; i <= 6; i++) {
    const imgUrl = unsplashBags[(i - 1) % unsplashBags.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Sac Traditionnel ${i}`,
      slug: `sac-traditionnel-${i}`,
      description: `Sac traditionnel ${i} fait main. Artisanat de qualité.`,
      category: catSacs,
      price: 15000 + (i * 2000),
      discount_price: i % 3 === 0 ? 12000 + (i * 1500) : undefined,
      is_new: i <= 3,
      is_featured: i === 3,
      stock: 15,
      images: [{ id: 1, image: imgUrl, is_primary: true, order: 1 }],
      variants: [],
      created_at: new Date(Date.now() - (i + 58) * 86400000).toISOString()
    })
  }

  // 9. Chemises en Lin (8)
  const catChemisesLin = INITIAL_CATEGORIES[8]
  for (let i = 1; i <= 8; i++) {
    const imgUrl = unsplashLinen[(i - 1) % unsplashLinen.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Chemise Lin ${i}`,
      slug: `chemise-lin-${i}`,
      description: `Chemise en lin ${i} naturel et respirant. Parfait pour l'été.`,
      category: catChemisesLin,
      price: 35000 + (i * 3000),
      discount_price: i % 2 === 0 ? 32000 + (i * 2500) : undefined,
      is_new: i <= 4,
      is_featured: i === 1 || i === 4,
      stock: 10,
      images: [{ id: 1, image: imgUrl, is_primary: true, order: 1 }],
      variants: [],
      created_at: new Date(Date.now() - (i + 64) * 86400000).toISOString()
    })
  }

  // 10. Pantalons en Lin (6)
  const catPantalonsLin = INITIAL_CATEGORIES[9]
  for (let i = 1; i <= 6; i++) {
    const imgUrl = unsplashLinen[(i + 2) % unsplashLinen.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Pantalon Lin ${i}`,
      slug: `pantalon-lin-${i}`,
      description: `Pantalon en lin ${i} confortable et élégant.`,
      category: catPantalonsLin,
      price: 40000 + (i * 4000),
      discount_price: i % 3 === 0 ? 36000 + (i * 3500) : undefined,
      is_new: i <= 3,
      is_featured: i === 2,
      stock: 8,
      images: [{ id: 1, image: imgUrl, is_primary: true, order: 1 }],
      variants: [],
      created_at: new Date(Date.now() - (i + 72) * 86400000).toISOString()
    })
  }

  // 11. Babouches Cuir (8)
  const catBabouchesCuir = INITIAL_CATEGORIES[10]
  for (let i = 1; i <= 8; i++) {
    const imgUrl = unsplashShoes[(i - 1) % unsplashShoes.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Babouche Cuir ${i}`,
      slug: `babouche-cuir-${i}`,
      description: `Babouche en cuir ${i} artisanale. Confort et style.`,
      category: catBabouchesCuir,
      price: 25000 + (i * 2000),
      discount_price: i % 2 === 0 ? 22000 + (i * 1500) : undefined,
      is_new: i <= 4,
      is_featured: i === 1 || i === 3,
      stock: 12,
      images: [{ id: 1, image: imgUrl, is_primary: true, order: 1 }],
      variants: [],
      created_at: new Date(Date.now() - (i + 78) * 86400000).toISOString()
    })
  }

  // 12. Babouches Brodées (6)
  const catBabouchesBrodees = INITIAL_CATEGORIES[11]
  for (let i = 1; i <= 6; i++) {
    const imgUrl = unsplashShoes[(i + 2) % unsplashShoes.length] + '?w=800&h=1000&fit=crop&q=80'
    products.push({
      id: id++,
      name: `Babouche Brodée ${i}`,
      slug: `babouche-brodee-${i}`,
      description: `Babouche brodée ${i} fait main. Élégance artisanale.`,
      category: catBabouchesBrodees,
      price: 30000 + (i * 3000),
      discount_price: i % 3 === 0 ? 27000 + (i * 2500) : undefined,
      is_new: i <= 3,
      is_featured: i === 2,
      stock: 10,
      images: [{ id: 1, image: imgUrl, is_primary: true, order: 1 }],
      variants: [],
      created_at: new Date(Date.now() - (i + 86) * 86400000).toISOString()
    })
  }

  return products
}

export const INITIAL_PRODUCTS: Product[] = buildProducts()
