'use client';

import styles from './Home.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { API_URL } from '../utils/api';

export default function Home() {
  const [featuredEbooks, setFeaturedEbooks] = useState([]);
  const [topWriters, setTopWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  const slides = [
    {
      title: "Discover & Read Original Ebooks",
      description: "Explore a universe of stories, hand-crafted by emerging writers and passionate authors worldwide. Start your literary journey today.",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop",
      ctaText: "Browse Ebooks",
      ctaLink: "/browse"
    },
    {
      title: "Empower Your Writing Career",
      description: "Are you an emerging writer? Upload your creations, publish securely, reach reader audiences globally and build your brand.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop",
      ctaText: "Become a Writer",
      ctaLink: "/register"
    },
    {
      title: "Interactive Reader Experience",
      description: "Save bookmarks, view transactions, explore multiple genres and purchase full access to high-quality books instantly.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop",
      ctaText: "Explore Now",
      ctaLink: "/browse"
    }
  ];

  const genresWithIcons = [
    { name: 'Fiction', icon: '📚' },
    { name: 'Mystery', icon: '🔍' },
    { name: 'Romance', icon: '💖' },
    { name: 'Sci-Fi', icon: '🚀' },
    { name: 'Fantasy', icon: '🪄' },
    { name: 'Horror', icon: '👻' },
    { name: 'Non-Fiction', icon: '💡' }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch featured ebooks (limit to 6)
        const ebooksRes = await fetch(`${API_URL}/api/ebooks?limit=6`);
        if (ebooksRes.ok) {
          const ebooksData = await ebooksRes.json();
          setFeaturedEbooks(ebooksData.ebooks || []);
        }

        // Fetch top writers using public writers endpoint
        const writersRes = await fetch(`${API_URL}/api/users/writers`);
        if (writersRes.ok) {
          const writersData = await writersRes.json();
          const writers = (writersData || []).slice(0, 3);
          setTopWriters(writers);
        }
      } catch (err) {
        console.error('Error fetching home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 14 } }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Section Banner Carousel */}
      <section className={styles.heroSection}>
        <motion.div 
          key={currentSlide}
          className={styles.heroContent}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.slide}>
            <div className={styles.slideLeft}>
              <h1>{slides[currentSlide].title}</h1>
              <p>{slides[currentSlide].description}</p>
              
              <Link href={slides[currentSlide].ctaLink} className={styles.ctaBtn}>
                <span>{slides[currentSlide].ctaText}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              {/* Carousel Indicators */}
              <div className="flex gap-2 mt-8">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'bg-indigo-600 dark:bg-indigo-400 w-8' : 'bg-gray-300 dark:bg-slate-700 w-2.5'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className={styles.slideRight}>
              <motion.img 
                src={slides[currentSlide].image} 
                alt={slides[currentSlide].title} 
                className={styles.bannerImage}
                initial={{ rotate: -2, scale: 0.95 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Ebooks */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured Ebooks</h2>
        {loading ? (
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className={`${styles.card} animate-pulse`}>
                <div style={{ height: '320px', background: 'rgba(148, 163, 184, 0.2)' }}></div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ height: '20px', background: 'rgba(148, 163, 184, 0.2)', width: '70%' }}></div>
                  <div style={{ height: '15px', background: 'rgba(148, 163, 184, 0.2)', width: '40%' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className={styles.grid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {featuredEbooks.map((ebook) => (
              <Link href={`/ebook/${ebook._id}`} key={ebook._id}>
                <motion.div className={styles.card} variants={itemVariants}>
                  <div className={styles.cardImageWrapper}>
                    <img src={ebook.coverImage} alt={ebook.title} className={styles.cardImage} />
                    <span className={styles.genreBadge}>{ebook.genre || 'Ebook'}</span>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{ebook.title}</h3>
                    <p className={styles.cardWriter}>
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {ebook.writer?.fullName || 'Anonymous Writer'}
                    </p>
                    <div className={styles.cardFooter}>
                      <div className={styles.cardPrice}>${(ebook.price || 0).toFixed(2)}</div>
                      <span className={styles.detailsBtn}>View Details →</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </section>

      {/* Top Writers Section */}
      <section className={styles.topWritersSection}>
        <h2 className={styles.sectionTitle}>Top Writers</h2>
        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {topWriters.length > 0 ? (
            topWriters.map((writer) => (
              <motion.div key={writer._id} className={styles.writerCard} variants={itemVariants}>
                <div className={styles.writerAvatarWrapper}>
                  <img 
                    src={writer.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=writer"} 
                    alt={writer.fullName} 
                    className={styles.writerAvatar}
                  />
                  <div className={styles.verifiedBadge} title="Verified Writer">✓</div>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">{writer.fullName}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                  Published Author & Writer
                </p>
              </motion.div>
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No writers registered yet.</p>
          )}
        </motion.div>
      </section>

      {/* Ebook Genres */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Explore Genres</h2>
        <motion.div 
          className={styles.genresGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {genresWithIcons.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <Link href={`/browse?genre=${item.name}`}>
                <div className={styles.genreCard}>
                  <span className={styles.genreIcon}>{item.icon}</span>
                  <span className="text-gray-900 dark:text-white font-bold">{item.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
