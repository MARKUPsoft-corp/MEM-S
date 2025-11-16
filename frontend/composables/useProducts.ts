// Composable pour gérer tous les produits du site
export const useProducts = () => {
  // Tous les produits du site (à terme, cela viendra d'une API)
  const allProducts = [
    // Produits Featured (pour compatibilité avec FeaturedProductsSection)
    {
      id: 1001,
      name: 'Boubou Premium Blanc',
      slug: 'boubou-premium-blanc',
      description: 'Boubou premium blanc élégant, parfait pour les occasions spéciales.',
      category: { id: 1, name: 'Boubous', slug: 'boubous', order: 1 },
      price: 45000,
      discount_price: undefined,
      is_new: true,
      featured: true,
      stock: 10,
      images: [
        { id: 10001, image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&h=1000&fit=crop&q=80', is_primary: true, order: 1 },
        { id: 10002, image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&h=1000&fit=crop&q=80', is_primary: false, order: 2 }
      ],
      variants: [],
      created_at: '2025-01-01'
    },
    {
      id: 1002,
      name: 'Costume Africain Moderne',
      slug: 'costume-africain-moderne',
      description: 'Costume africain moderne avec finitions impeccables.',
      category: { id: 3, name: 'Costumes', slug: 'costumes', order: 3 },
      price: 60000,
      discount_price: undefined,
      is_new: true,
      featured: true,
      stock: 5,
      images: [
        { id: 10003, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop&q=80', is_primary: true, order: 1 }
      ],
      variants: [],
      created_at: '2025-01-02'
    },
    {
      id: 1003,
      name: 'Robe Africaine Élégante',
      slug: 'robe-africaine-elegante',
      description: 'Robe africaine élégante pour femme.',
      category: { id: 6, name: 'Robes', slug: 'robes', order: 6 },
      price: 38000,
      discount_price: undefined,
      is_new: true,
      featured: true,
      stock: 8,
      images: [
        { id: 10004, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&q=80', is_primary: true, order: 1 }
      ],
      variants: [],
      created_at: '2025-01-03'
    },
    {
      id: 1004,
      name: 'Sac à Main Élégant',
      slug: 'sac-a-main-elegant',
      description: 'Sac à main élégant fait main.',
      category: { id: 8, name: 'Sacs', slug: 'sacs', order: 8 },
      price: 28000,
      discount_price: undefined,
      is_new: true,
      featured: true,
      stock: 15,
      images: [
        { id: 10005, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=1000&fit=crop&q=80', is_primary: true, order: 1 }
      ],
      variants: [],
      created_at: '2025-01-04'
    },
    {
      id: 1005,
      name: 'Babouches Cuir Premium',
      slug: 'babouches-cuir-premium',
      description: 'Babouches en cuir premium artisanales.',
      category: { id: 11, name: 'Babouches Cuir', slug: 'babouches-cuir', order: 11 },
      price: 20000,
      discount_price: undefined,
      is_new: true,
      featured: true,
      stock: 12,
      images: [
        { id: 10006, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop&q=80', is_primary: true, order: 1 }
      ],
      variants: [],
      created_at: '2025-01-05'
    },
    {
      id: 1006,
      name: 'Ensemble Lin Naturel',
      slug: 'ensemble-lin-naturel',
      description: 'Ensemble en lin naturel confortable.',
      category: { id: 9, name: 'Chemises Lin', slug: 'chemises-lin', order: 9 },
      price: 35000,
      discount_price: undefined,
      is_new: true,
      featured: true,
      stock: 10,
      images: [
        { id: 10007, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1000&fit=crop&q=80', is_primary: true, order: 1 }
      ],
      variants: [],
      created_at: '2025-01-06'
    },
    
    // Boubous (12 produits)
    ...Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Boubou Traditionnel ${i + 1}`,
      slug: `boubou-traditionnel-${i + 1}`,
      description: `Magnifique boubou traditionnel africain ${i + 1}, confectionné avec des tissus de haute qualité. Parfait pour les occasions spéciales.`,
      category: { id: 1, name: 'Boubous', slug: 'boubous', order: 1 },
      price: 45000 + (i * 5000),
      discount_price: i % 3 === 0 ? 40000 + (i * 4000) : undefined,
      is_new: i < 6,
      featured: i < 2,
      stock: 10,
      images: [
        { id: i * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 },
        { id: i * 10 + 2, image: `https://images.unsplash.com/photo-${1622445275463 + i}?w=800&h=1000&fit=crop&q=80`, is_primary: false, order: 2 }
      ],
      variants: [
        { id: i * 3 + 1, size: 'M', color: 'Noir', sku: `BOU-${i + 1}-M`, stock: 5 },
        { id: i * 3 + 2, size: 'L', color: 'Noir', sku: `BOU-${i + 1}-L`, stock: 3 },
        { id: i * 3 + 3, size: 'XL', color: 'Noir', sku: `BOU-${i + 1}-XL`, stock: 2 }
      ],
      created_at: `2025-01-${String(i + 1).padStart(2, '0')}`
    })),
    
    // Gandouras (8 produits)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: i + 13,
      name: `Gandoura Élégante ${i + 1}`,
      slug: `gandoura-elegante-${i + 1}`,
      description: `Gandoura élégante ${i + 1} pour homme, style moderne et traditionnel. Confort et élégance garantis.`,
      category: { id: 2, name: 'Gandouras', slug: 'gandouras', order: 2 },
      price: 35000 + (i * 3000),
      discount_price: i % 2 === 0 ? 30000 + (i * 2500) : undefined,
      is_new: i < 4,
      featured: i === 0 || i === 3,
      stock: 8,
      images: [
        { id: (i + 12) * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i + 12}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 }
      ],
      variants: [
        { id: (i + 12) * 3 + 1, size: 'M', color: 'Beige', sku: `GAN-${i + 1}-M`, stock: 4 },
        { id: (i + 12) * 3 + 2, size: 'L', color: 'Beige', sku: `GAN-${i + 1}-L`, stock: 4 }
      ],
      created_at: `2025-01-${String(i + 13).padStart(2, '0')}`
    })),
    
    // Costumes (6 produits)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: i + 21,
      name: `Costume Moderne ${i + 1}`,
      slug: `costume-moderne-${i + 1}`,
      description: `Costume moderne ${i + 1} pour homme d'affaires. Coupe impeccable et finitions soignées.`,
      category: { id: 3, name: 'Costumes', slug: 'costumes', order: 3 },
      price: 95000 + (i * 8000),
      discount_price: i % 2 === 0 ? 85000 + (i * 7000) : undefined,
      is_new: i < 3,
      featured: i === 1,
      stock: 5,
      images: [
        { id: (i + 20) * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i + 20}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 }
      ],
      variants: [
        { id: (i + 20) * 3 + 1, size: 'M', color: 'Noir', sku: `COS-${i + 1}-M`, stock: 2 },
        { id: (i + 20) * 3 + 2, size: 'L', color: 'Noir', sku: `COS-${i + 1}-L`, stock: 3 }
      ],
      created_at: `2025-01-${String(i + 21).padStart(2, '0')}`
    })),
    
    // Chemises Hommes (8 produits)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: i + 27,
      name: `Chemise Africaine ${i + 1}`,
      slug: `chemise-africaine-${i + 1}`,
      description: `Chemise africaine ${i + 1} pour homme. Motifs traditionnels et coupe moderne.`,
      category: { id: 4, name: 'Chemises', slug: 'chemises', order: 4 },
      price: 25000 + (i * 2000),
      discount_price: i % 3 === 0 ? 22000 + (i * 1500) : undefined,
      is_new: i < 4,
      featured: i === 2,
      stock: 12,
      images: [
        { id: (i + 26) * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i + 26}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 }
      ],
      variants: [
        { id: (i + 26) * 3 + 1, size: 'M', color: 'Blanc', sku: `CHE-${i + 1}-M`, stock: 6 },
        { id: (i + 26) * 3 + 2, size: 'L', color: 'Blanc', sku: `CHE-${i + 1}-L`, stock: 6 }
      ],
      created_at: `2025-01-${String(i + 27).padStart(2, '0')}`
    })),
    
    // Pantalons Hommes (6 produits)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: i + 35,
      name: `Pantalon Traditionnel ${i + 1}`,
      slug: `pantalon-traditionnel-${i + 1}`,
      description: `Pantalon traditionnel ${i + 1} pour homme. Confortable et élégant.`,
      category: { id: 5, name: 'Pantalons', slug: 'pantalons', order: 5 },
      price: 30000 + (i * 3000),
      discount_price: i % 2 === 0 ? 27000 + (i * 2500) : undefined,
      is_new: i < 3,
      featured: false,
      stock: 10,
      images: [
        { id: (i + 34) * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i + 34}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 }
      ],
      variants: [
        { id: (i + 34) * 3 + 1, size: 'M', color: 'Noir', sku: `PAN-${i + 1}-M`, stock: 5 },
        { id: (i + 34) * 3 + 2, size: 'L', color: 'Noir', sku: `PAN-${i + 1}-L`, stock: 5 }
      ],
      created_at: `2025-02-${String(i + 1).padStart(2, '0')}`
    })),
    
    // Robes (10 produits)
    ...Array.from({ length: 10 }, (_, i) => ({
      id: i + 41,
      name: `Robe Africaine ${i + 1}`,
      slug: `robe-africaine-${i + 1}`,
      description: `Robe africaine ${i + 1} pour femme. Design authentique et moderne.`,
      category: { id: 6, name: 'Robes', slug: 'robes', order: 6 },
      price: 55000 + (i * 4000),
      discount_price: i % 3 === 0 ? 50000 + (i * 3500) : undefined,
      is_new: i < 5,
      featured: i === 0 || i === 4,
      stock: 8,
      images: [
        { id: (i + 40) * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i + 40}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 }
      ],
      variants: [
        { id: (i + 40) * 3 + 1, size: 'S', color: 'Rouge', sku: `ROB-${i + 1}-S`, stock: 4 },
        { id: (i + 40) * 3 + 2, size: 'M', color: 'Rouge', sku: `ROB-${i + 1}-M`, stock: 4 }
      ],
      created_at: `2025-02-${String(i + 11).padStart(2, '0')}`
    })),
    
    // Ensembles (8 produits)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: i + 51,
      name: `Ensemble Élégant ${i + 1}`,
      slug: `ensemble-elegant-${i + 1}`,
      description: `Ensemble élégant ${i + 1} pour femme. Coordination parfaite.`,
      category: { id: 7, name: 'Ensembles', slug: 'ensembles', order: 7 },
      price: 75000 + (i * 5000),
      discount_price: i % 2 === 0 ? 68000 + (i * 4500) : undefined,
      is_new: i < 4,
      featured: i === 1,
      stock: 6,
      images: [
        { id: (i + 50) * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i + 50}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 }
      ],
      variants: [
        { id: (i + 50) * 3 + 1, size: 'M', color: 'Bleu', sku: `ENS-${i + 1}-M`, stock: 3 },
        { id: (i + 50) * 3 + 2, size: 'L', color: 'Bleu', sku: `ENS-${i + 1}-L`, stock: 3 }
      ],
      created_at: `2025-02-${String(i + 21).padStart(2, '0')}`
    })),
    
    // Sacs & Accessoires (6 produits)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: i + 59,
      name: `Sac Traditionnel ${i + 1}`,
      slug: `sac-traditionnel-${i + 1}`,
      description: `Sac traditionnel ${i + 1} fait main. Artisanat de qualité.`,
      category: { id: 8, name: 'Sacs', slug: 'sacs', order: 8 },
      price: 15000 + (i * 2000),
      discount_price: i % 3 === 0 ? 12000 + (i * 1500) : undefined,
      is_new: i < 3,
      featured: i === 2,
      stock: 15,
      images: [
        { id: (i + 58) * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i + 58}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 }
      ],
      variants: [],
      created_at: `2025-03-${String(i + 1).padStart(2, '0')}`
    })),
    
    // Chemises en Lin (8 produits)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: i + 65,
      name: `Chemise Lin ${i + 1}`,
      slug: `chemise-lin-${i + 1}`,
      description: `Chemise en lin ${i + 1} naturel et respirant. Parfait pour l'été.`,
      category: { id: 9, name: 'Chemises Lin', slug: 'chemises-lin', order: 9 },
      price: 35000 + (i * 3000),
      discount_price: i % 2 === 0 ? 32000 + (i * 2500) : undefined,
      is_new: i < 4,
      featured: i === 0 || i === 3,
      stock: 10,
      images: [
        { id: (i + 64) * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i + 64}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 }
      ],
      variants: [
        { id: (i + 64) * 3 + 1, size: 'M', color: 'Beige', sku: `LIN-CHE-${i + 1}-M`, stock: 5 },
        { id: (i + 64) * 3 + 2, size: 'L', color: 'Beige', sku: `LIN-CHE-${i + 1}-L`, stock: 5 }
      ],
      created_at: `2025-03-${String(i + 7).padStart(2, '0')}`
    })),
    
    // Pantalons en Lin (6 produits)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: i + 73,
      name: `Pantalon Lin ${i + 1}`,
      slug: `pantalon-lin-${i + 1}`,
      description: `Pantalon en lin ${i + 1} confortable et élégant.`,
      category: { id: 10, name: 'Pantalons Lin', slug: 'pantalons-lin', order: 10 },
      price: 40000 + (i * 4000),
      discount_price: i % 3 === 0 ? 36000 + (i * 3500) : undefined,
      is_new: i < 3,
      featured: i === 1,
      stock: 8,
      images: [
        { id: (i + 72) * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i + 72}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 }
      ],
      variants: [
        { id: (i + 72) * 3 + 1, size: 'M', color: 'Blanc', sku: `LIN-PAN-${i + 1}-M`, stock: 4 },
        { id: (i + 72) * 3 + 2, size: 'L', color: 'Blanc', sku: `LIN-PAN-${i + 1}-L`, stock: 4 }
      ],
      created_at: `2025-03-${String(i + 15).padStart(2, '0')}`
    })),
    
    // Babouches en Cuir (8 produits)
    ...Array.from({ length: 8 }, (_, i) => ({
      id: i + 79,
      name: `Babouche Cuir ${i + 1}`,
      slug: `babouche-cuir-${i + 1}`,
      description: `Babouche en cuir ${i + 1} artisanale. Confort et style.`,
      category: { id: 11, name: 'Babouches Cuir', slug: 'babouches-cuir', order: 11 },
      price: 25000 + (i * 2000),
      discount_price: i % 2 === 0 ? 22000 + (i * 1500) : undefined,
      is_new: i < 4,
      featured: i === 0 || i === 2,
      stock: 12,
      images: [
        { id: (i + 78) * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i + 78}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 }
      ],
      variants: [
        { id: (i + 78) * 3 + 1, size: '40', color: 'Marron', sku: `BAB-CUI-${i + 1}-40`, stock: 6 },
        { id: (i + 78) * 3 + 2, size: '42', color: 'Marron', sku: `BAB-CUI-${i + 1}-42`, stock: 6 }
      ],
      created_at: `2025-03-${String(i + 21).padStart(2, '0')}`
    })),
    
    // Babouches Brodées (6 produits)
    ...Array.from({ length: 6 }, (_, i) => ({
      id: i + 87,
      name: `Babouche Brodée ${i + 1}`,
      slug: `babouche-brodee-${i + 1}`,
      description: `Babouche brodée ${i + 1} fait main. Élégance artisanale.`,
      category: { id: 12, name: 'Babouches Brodées', slug: 'babouches-brodees', order: 12 },
      price: 30000 + (i * 3000),
      discount_price: i % 3 === 0 ? 27000 + (i * 2500) : undefined,
      is_new: i < 3,
      featured: i === 1,
      stock: 10,
      images: [
        { id: (i + 86) * 10 + 1, image: `https://images.unsplash.com/photo-${1617127365659 + i + 86}?w=800&h=1000&fit=crop&q=80`, is_primary: true, order: 1 }
      ],
      variants: [
        { id: (i + 86) * 3 + 1, size: '39', color: 'Or', sku: `BAB-BRO-${i + 1}-39`, stock: 5 },
        { id: (i + 86) * 3 + 2, size: '41', color: 'Or', sku: `BAB-BRO-${i + 1}-41`, stock: 5 }
      ],
      created_at: `2025-03-${String(i + 29).padStart(2, '0')}`
    }))
  ]

  // Fonction pour récupérer un produit par son slug
  const getProductBySlug = (slug: string) => {
    return allProducts.find(product => product.slug === slug) || null
  }

  // Fonction pour récupérer tous les produits
  const getAllProducts = () => {
    return allProducts
  }

  // Fonction pour récupérer les produits par catégorie
  const getProductsByCategory = (categorySlug: string) => {
    return allProducts.filter(product => product.category.slug === categorySlug)
  }

  return {
    allProducts,
    getProductBySlug,
    getAllProducts,
    getProductsByCategory
  }
}
