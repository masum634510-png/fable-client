'use client';

import styles from './Home.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Discover & Read Original Ebooks</h1>
          <p>Join our community of passionate readers and talented writers. Explore a world of literary adventures crafted just for you.</p>
          <Link href="/browse" className={styles.ctaBtn}>
            Browse Ebooks
          </Link>
        </motion.div>
      </section>

      {/* Featured Ebooks */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured Ebooks</h2>
        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <motion.div key={item} className={styles.card} variants={itemVariants}>
              <img src="https://i.ibb.co/Placeholder/cover.jpg" alt="Cover" className={styles.cardImage} />
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Sample Ebook {item}</h3>
                <p className={styles.cardWriter}>By Author Name</p>
                <div className={styles.cardPrice}>$9.99</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Top Writers */}
      <section className={`${styles.section} ${styles.altBackground}`} style={{ backgroundColor: 'var(--secondary)' }}>
        <h2 className={styles.sectionTitle}>Top Writers</h2>
        <motion.div 
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[1, 2, 3].map((item) => (
            <motion.div key={item} className={styles.card} style={{ textAlign: 'center', padding: '2rem' }} variants={itemVariants}>
              <img 
                src="https://i.ibb.co/Placeholder/avatar.png" 
                alt="Writer" 
                style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '1rem' }} 
              />
              <h3 className={styles.cardTitle}>Writer Name {item}</h3>
              <p className={styles.cardWriter}>50 Sales</p>
            </motion.div>
          ))}
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
          viewport={{ once: true, amount: 0.2 }}
        >
          {['Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Horror', 'Non-Fiction', 'Thriller'].map((genre) => (
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
