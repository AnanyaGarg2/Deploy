import React, { useEffect, useState } from 'react';
import { Search, Download, Play, BookOpen, Clock, Star, Filter, ChevronRight } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  downloadUrl: string;
  genre: string;
  pages: number;
  rating: number;
  language: string;
  chapters: number;
}

const BooksPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [downloadingBooks, setDownloadingBooks] = useState<Set<string>>(new Set());
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?userId=1");

        if (!response.ok) {
          throw new Error(`Error fetching posts: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        const formattedBooks = data.map((item: any, index: number) => ({
          id: item.id.toString(),
          title: item.title,
          author: `Author ${item.userId}`,
          description: item.body,
          coverUrl: `https://picsum.photos/300/400?random=${index + 1}`,
          downloadUrl: "#",
          genre: ["Fiction", "Romance", "History", "Philosophy"][index % 4],
          pages: 120 + index * 10,
          rating: (4 + (index % 2) * 0.5).toFixed(1),
          language: "English",
          chapters: 10 + index,
        }));

        setBooks(formattedBooks);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const genres = [
    'All',
    'Horror',
    'Romance',
    'Philosophy',
    'Fantasy',
    'Economics',
    'Science Fiction',
    'Biography',
    'History',
    'Self-Help',
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleDownload = async (bookId: string) => {
    setDownloadingBooks((prev) => new Set([...prev, bookId]));

    // Simulate download process
    setTimeout(() => {
      setDownloadingBooks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookId);
        return newSet;
      });
      alert('Book downloaded! Redirecting to upload page for audio conversion...');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <BookOpen size={40} className="text-silver" />
          <h1 className="text-4xl font-bold text-white font-serif">Book Library</h1>
        </div>
        <p className="text-xl text-gray-400 font-light">
          Download free books and convert them to audiobooks
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-silver"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors duration-200">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-3">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre === 'All' ? null : genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              (selectedGenre === genre || (!selectedGenre && genre === 'All'))
                ? 'bg-silver text-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-silver'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {loading ? (
        <p className="text-center text-gray-400">Loading books...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:bg-gray-800 transition-all duration-300"
            >
              <div className="relative mb-4">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                  {book.genre}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 font-serif line-clamp-2">
                {book.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3 font-light">by {book.author}</p>

              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Star size={12} className="text-silver" />
                  <span>{book.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{book.pages} pages</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen size={12} />
                  <span>{book.chapters} chapters</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-3 font-light">
                {book.description}
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(book.id)}
                  disabled={downloadingBooks.has(book.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                    downloadingBooks.has(book.id)
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-silver text-black hover:bg-white'
                  }`}
                >
                  <Download size={16} />
                  <span>
                    {downloadingBooks.has(book.id) ? 'Downloading...' : 'Download'}
                  </span>
                </button>
                <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
