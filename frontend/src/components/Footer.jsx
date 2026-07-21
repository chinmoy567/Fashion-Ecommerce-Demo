import { Camera, ThumbsUp, AtSign } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const columns = [
  {
    title: 'About Us',
    body: 'Premium clothing for modern Bangladesh.',
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'Shop', href: '/shop' },
      { label: 'Journal', href: '/blog' },
      { label: 'FAQ', href: '#' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Shipping', href: '#' },
    ],
  },
  {
    title: 'Contact',
    body: 'info@deerfit.com\n+880 1234 567890',
  },
]

export default function Footer() {
  const revealRef = useScrollReveal({ y: 24 })

  return (
    <footer className="mt-24 border-t border-white/10 bg-background">
      <div ref={revealRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {columns.map(col => (
            <div key={col.title} data-reveal>
              <h3 className="font-display font-semibold mb-4">{col.title}</h3>
              {col.links ? (
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <a href={link.href} className="hover:text-gold transition-colors">{link.label}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm whitespace-pre-line">{col.body}</p>
              )}
            </div>
          ))}
        </div>

        <div data-reveal className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/10 mt-12 pt-8">
          <p className="text-muted-foreground text-sm">&copy; 2026 DeerFit. All rights reserved.</p>
          <div className="flex gap-4 text-muted-foreground">
            <a href="#" aria-label="Instagram" className="hover:text-gold transition-colors"><Camera className="h-4 w-4" /></a>
            <a href="#" aria-label="Facebook" className="hover:text-gold transition-colors"><ThumbsUp className="h-4 w-4" /></a>
            <a href="#" aria-label="Contact" className="hover:text-gold transition-colors"><AtSign className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
