import { useEffect, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { setProducts, setLoading } from '../store/slices/productSlice'
import { getProducts } from '../api/product'
import { gsap } from '@/lib/gsap'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'

const categories = [
  { name: 'Men', slug: 'mens-clothing' },
  { name: 'Women', slug: 'womens-clothing' },
  { name: 'Kids', slug: 'kids-clothing' },
  { name: 'Accessories', slug: 'accessories' },
]

export default function Home() {
  const dispatch = useDispatch()
  const { products } = useSelector(state => state.products)
  const heroRef = useRef(null)
  const categoryReveal = useScrollReveal()
  const productReveal = useScrollReveal()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    dispatch(setLoading(true))
    try {
      const response = await getProducts({ featured: 'true', limit: 8 })
      dispatch(setProducts(response.data.data))
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const targets = heroRef.current.querySelectorAll('[data-hero]')
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.1 }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div ref={heroRef} className="relative overflow-hidden bg-gold-glow bg-gradient-to-b from-secondary/40 to-background py-28 sm:py-36">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p data-hero className="text-gold text-sm tracking-[0.3em] uppercase mb-4">New Season Arrivals</p>
          <h1 data-hero className="font-display text-5xl sm:text-7xl font-bold mb-6 text-balance">
            Welcome to DeerFit
          </h1>
          <p data-hero className="text-lg text-muted-foreground mb-10 text-balance">
            Discover the latest trends in Bangladesh clothing
          </p>
          <div data-hero>
            <Button
              size="lg"
              className="bg-gold text-black hover:bg-gold-light h-12 px-8 text-base"
              render={<Link to="/shop" />} nativeButton={false}
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div ref={categoryReveal} className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 data-reveal className="font-display text-3xl font-bold mb-10">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map(cat => (
            <motion.div key={cat.slug} data-reveal whileHover={{ y: -4 }}>
              <Link
                to={`/shop?category=${cat.slug}`}
                className="block bg-card ring-1 ring-white/10 hover:ring-gold/40 p-6 rounded-xl text-center transition-colors"
              >
                <h3 className="font-display font-semibold text-lg">{cat.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div ref={productReveal} className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 data-reveal className="font-display text-3xl font-bold mb-10">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={{ ...product, images: product.image ? [product.image] : [] }} />
          ))}
        </div>
      </div>
    </div>
  )
}
