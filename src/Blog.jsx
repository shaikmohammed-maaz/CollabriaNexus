import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Search, 
  Filter, 
  Loader, 
  FileChartColumn,
  Star,
  TrendingUp,
  Eye,
  Share2,
  Bookmark,
  ArrowUp,
  Menu,
  X,
  Grid,
  List,
  ExternalLink
} from "lucide-react";

// Import your Firebase service
import { fetchAllBlogs } from "./Services/blogService";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  
  const blogsPerPage = 6;

  // Fetch blogs from Firebase
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const fetchedBlogs = await fetchAllBlogs();
        // Filter only published blogs
        const publishedBlogs = fetchedBlogs.filter(blog => blog.status === 'published');
        setBlogs(publishedBlogs);
      } catch (err) {
        setError('Failed to load blogs. Please try again later.');
        console.error('Error loading blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Get unique categories from blogs
  const categories = ['All', ...new Set(blogs.map(blog => blog.category).filter(Boolean))];

  // Filter and search blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Sort blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishedAt || b.updatedAt || 0) - new Date(a.publishedAt || a.updatedAt || 0);
      case 'oldest':
        return new Date(a.publishedAt || a.updatedAt || 0) - new Date(b.publishedAt || b.updatedAt || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const paginatedBlogs = sortedBlogs.slice(startIndex, startIndex + blogsPerPage);

  // Format date
  const formatDate = (date) => {
    if (!date) return 'No date';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="bg-[#0f0f1a] min-h-screen text-white px-6 py-10 pt-20">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader className="animate-spin h-12 w-12 text-purple-500 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0f0f1a] min-h-screen text-white px-6 py-10 pt-20">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f1a] min-h-screen text-white px-6 py-10 pt-20">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          📰 MineVerse Blog
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Stay updated with the latest insights, strategies, and trends in digital mining and cryptocurrency
        </p>
        <div className="mt-6 text-sm text-gray-400">
          {blogs.length} {blogs.length === 1 ? 'article' : 'articles'} available
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full bg-[#1d1d2e] border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 h-4 w-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#1d1d2e] border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition text-sm ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#1d1d2e] hover:bg-purple-600 text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="max-w-6xl mx-auto mb-6">
        <p className="text-gray-400 text-sm">
          Showing {paginatedBlogs.length} of {sortedBlogs.length} articles
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* No Results */}
      {sortedBlogs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">No articles found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md transition"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Blog Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedBlogs.map((blog) => (
          <article
            key={blog.id}
            className="bg-[#1d1d2e] rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 group"
          >
            {blog.imageUrl && (
              <div className="relative overflow-hidden">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {blog.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                )}
              </div>
            )}
            
            <div className="p-5">
              {blog.category && (
                <span className="inline-block bg-purple-600 text-xs px-2 py-1 rounded-full mb-3">
                  {blog.category}
                </span>
              )}
              
              <h2 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors">
                {blog.title}
              </h2>
              
              <div className="flex items-center text-xs text-gray-400 mb-3 gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(blog.publishedAt || blog.updatedAt)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{blog.author}</span>
                </div>
                
                {blog.readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{blog.readingTime}</span>
                  </div>
                )}
              </div>
              
              {blog.excerpt && (
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
              )}
              
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-[#2d2d3e] text-xs px-2 py-1 rounded text-gray-300"
                    >
                      <Tag className="h-2 w-2" />
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{blog.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
              
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-md text-sm font-medium"
                onClick={() => setSelectedPost(blog)}
              >
                Read Full Article
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 bg-[#1d1d2e] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-md transition ${
                    currentPage === pageNum
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#1d1d2e] text-gray-300 hover:bg-purple-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 bg-[#1d1d2e] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Modal for Full Article */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn p-4">
          <div className="bg-[#1d1d2e] max-w-4xl w-full rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            {selectedPost.imageUrl && (
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {selectedPost.featured && (
                  <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
                {selectedPost.category && (
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    {selectedPost.category}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{selectedPost.title}</h1>
              
              <div className="flex items-center text-sm text-gray-400 mb-6 gap-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>by {selectedPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedPost.publishedAt || selectedPost.updatedAt)}</span>
                </div>
                {selectedPost.readingTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{selectedPost.readingTime}</span>
                  </div>
                )}
              </div>
              
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-[#2d2d3e] text-sm px-3 py-1 rounded-full text-gray-300"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content || selectedPost.excerpt || 'No content available.'}
                </div>
              </div>
              
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-md text-white transition"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: selectedPost.title,
                        text: selectedPost.excerpt,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      // You could add a toast notification here
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md text-white transition"
                >
                  Share Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #fff;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .prose strong {
          color: #a855f7;
        }
        .prose ul, .prose ol {
          margin: 1em 0;
        }
        .prose li {
          margin: 0.5em 0;
        }
        .prose a {
          color: #a855f7;
          text-decoration: underline;
        }
        .prose p {
          margin: 1em 0;
          line-height: 1.7;
        }
      `}</style>
    </div>
  );
};

export default BlogPage;