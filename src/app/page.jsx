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
        const ebooksData = await ebooksRes.json();
        if (ebooksRes.ok) {
          setFeaturedEbooks(ebooksData.ebooks);
        }

        // Fetch top writers (Fetch writers and sort or get from user list)
        const usersRes = await fetch(`${API_URL}/api/users`);
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          // Filter writers and mock/sort by sales (since database has transaction info)
          const writers = usersData.filter(u => u.role === 'writer').slice(0, 3);
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
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <motion.div 
          key={currentSlide}
          className={styles.heroContent}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.slide}>
            <div className={styles.slideLeft}>
              <h1>{slides[currentSlide].title}</h1>
              <p>{slides[currentSlide].description}</p>
              <Link href={slides[currentSlide].ctaLink} className={styles.ctaBtn}>
                {slides[currentSlide].ctaText}
              </Link>
              
              {/* Carousel Indicators */}
              <div className="flex gap-2 mt-8">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'bg-indigo-600 w-8' : 'bg-gray-300 dark:bg-gray-700'}`}
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
                transition={{ duration: 0.6 }}
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
                <div style={{ height: '350px', background: 'var(--border)' }}></div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ height: '20px', background: 'var(--border)', width: '70%' }}></div>
                  <div style={{ height: '15px', background: 'var(--border)', width: '40%' }}></div>
                  <div style={{ height: '20px', background: 'var(--border)', width: '30%', marginTop: '1rem' }}></div>
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
                  <img src={ebook.coverImage} alt={ebook.title} className={styles.cardImage} />
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{ebook.title}</h3>
                    <p className={styles.cardWriter}>By {ebook.writer?.fullName || 'Anonymous'}</p>
                    <div className={styles.cardPrice}>${ebook.price.toFixed(2)}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </section>

      {/* Top Writers */}
      <section className={styles.section} style={{ backgroundColor: 'var(--secondary)', borderRadius: '24px', margin: '2rem auto' }}>
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
              <motion.div key={writer._id} className={styles.card} style={{ textAlign: 'center', padding: '2rem', alignItems: 'center' }} variants={itemVariants}>
                <img 
                  src={writer.profilePicture || "https://i.ibb.co/Placeholder/avatar.png"} 
                  alt={writer.fullName} 
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1.5rem', border: '4px solid var(--primary)' }} 
                />
                <h3 className={styles.cardTitle}>{writer.fullName}</h3>
                <p className={styles.cardWriter} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Writer & Creator</p>
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
          {['Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Horror', 'Non-Fiction'].map((genre) => (
            <motion.div key={genre} variants={itemVariants}>
              <Link href={`/browse?genre=${genre}`}>
                <div className={styles.genreCard}>{genre}</div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
