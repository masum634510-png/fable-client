'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Browse.module.css';
import { API_URL } from '../../utils/api';

function BrowseEbooksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get initial genre from URL query params
  const initialGenre = searchParams.get('genre') || '';

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering and pagination state
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState(initialGenre);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Synchronize URL genre changes
  useEffect(() => {
    const g = searchParams.get('genre');
    if (g !== null) {
      setGenre(g);
      setPage(1);
    }
  }, [searchParams]);

  const fetchEbooks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        genre,
        minPrice,
        maxPrice,
        availability,
        sort,
        page,
        limit: 8
      });
      
      const res = await fetch(`${API_URL}/api/ebooks?${queryParams}`);
      const data = await res.json();
      
      if (res.ok) {
        setEbooks(data.ebooks);
        setTotalPages(data.pages);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch ebooks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, [page, sort, genre, availability]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEbooks();
  };

  const handleClearFilters = () => {
    setSearch('');
    setGenre('');
    setMinPrice('');
    setMaxPrice('');
    setAvailability('');
    setSort('newest');
    setPage(1);
    router.push('/browse');
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3>Filter & Search</h3>
        <form onSubmit={handleSearch} className={styles.filterForm}>
          <div className={styles.filterGroup}>
            <label>Search Title/Writer</label>
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label>Genre</label>
            <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }}>
              <option value="">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Horror">Horror</option>
              <option value="Non-Fiction">Non-Fiction</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Price Range</label>
            <div className={styles.priceInputs}>
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)} 
                min="0"
              />
              <span>-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
                min="0"
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Availability</label>
            <select value={availability} onChange={(e) => { setAvailability(e.target.value); setPage(1); }}>
              <option value="">All Ebooks</option>
              <option value="available">In Stock (Available)</option>
              <option value="sold">Sold Out</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Sort By</label>
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <button type="submit" className={styles.applyBtn}>Apply Filters</button>
          <button type="button" onClick={handleClearFilters} className={styles.clearBtn}>Clear</button>
        </form>
      </div>

      <div className={styles.mainContent}>
        <h2>Browse Ebooks</h2>
        
        {loading ? (
          <div className={styles.loadingGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className={styles.skeletonCard}></div>
            ))}
          </div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : ebooks.length === 0 ? (
          <div className={styles.noResults}>
            <p>No ebooks found matching your criteria.</p>
          </div>
        ) : (
          <>
            <motion.div 
              className={styles.ebookGrid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {ebooks.map(ebook => (
                <Link href={`/ebook/${ebook._id}`} key={ebook._id}>
                  <motion.div 
                    className={styles.ebookCard}
                    whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  >
                    <div className={styles.imageWrapper}>
                      <img src={ebook.coverImage} alt={ebook.title} />
                      {ebook.status === 'sold' && <span className={styles.soldBadge}>Sold Out</span>}
                    </div>
                    <div className={styles.cardInfo}>
                      <h4>{ebook.title}</h4>
                      <p className={styles.author}>By {ebook.writer?.fullName || 'Unknown'}</p>
                      <div className={styles.cardFooter}>
                        <span className={styles.genre}>{ebook.genre}</span>
                        <span className={styles.price}>${ebook.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className={styles.pageBtn}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  className={styles.pageBtn}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BrowseEbooks() {
  return (
    <Suspense fallback={<div>Loading browsing experience...</div>}>
      <BrowseEbooksContent />
    </Suspense>
  );
}
