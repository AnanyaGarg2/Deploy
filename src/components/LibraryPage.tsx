
import React, { useState } from 'react';
import { Play, Heart, MoreHorizontal, Plus, Search, Filter, BookOpen, FlaskConical } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  creator: string;
  duration?: string;
  coverUrl: string;
  audioUrl?: string;
}

interface LibraryPageProps {
  onPlayTrack: (track: Track) => void;
}

const LibraryPage: React.FC<LibraryPageProps> = ({ onPlayTrack }) => {
  const [activeTab, setActiveTab] = useState<'books' | 'research'>('books');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');

  const getTabClasses = (tabName: 'books' | 'research') =>
    `px-4 py-2 text-lg font-semibold border-b-2 transition-colors duration-200 ${
      activeTab === tabName
        ? 'border-black text-black'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`;

  // Sample Data
  const books = [
    { id: 1, title: "Deep Learning Basics", author: "Ian Goodfellow", cover: "https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=150" },
    { id: 2, title: "Clean Code", author: "Robert C. Martin", cover: "https://images.pexels.com/photos/2067569/pexels-photo-2067569.jpeg?auto=compress&cs=tinysrgb&w=150" },
    { id: 3, title: "React Explained", author: "Zac Gordon", cover: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=150" },
    { id: 4, title: "The Pragmatic Programmer", author: "Andy Hunt", cover: "https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=150" },
  ];

  const researchPapers = [
    { id: 1, title: "AI-Driven Policy Models", author: "MIT Research Group", cover: "https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=150", desc: "Exploring how AI transforms law and policy frameworks." },
    { id: 2, title: "Quantum Machine Learning", author: "Stanford AI Lab", cover: "https://images.pexels.com/photos/2067569/pexels-photo-2067569.jpeg?auto=compress&cs=tinysrgb&w=150", desc: "Study on leveraging quantum mechanics for ML acceleration." },
    { id: 3, title: "Ethics in Automation", author: "Oxford Digital Society", cover: "https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=150", desc: "Analyzing bias and responsibility in AI decision-making." },
  ];

  // Apply search and filter
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    book.author.toLowerCase().includes(filterAuthor.toLowerCase())
  );

  const filteredResearch = researchPapers.filter(paper =>
    (paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     paper.author.toLowerCase().includes(searchQuery.toLowerCase())) &&
    paper.author.toLowerCase().includes(filterAuthor.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Your Library</h1>
        <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 flex items-center space-x-2">
          <Plus size={20} />
          <span>Add New</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-gray-300">
        <div className="flex justify-center space-x-8">
          <button onClick={() => setActiveTab('books')} className={getTabClasses('books')}>
            <div className="flex items-center space-x-2">
              <BookOpen size={20} />
              <span>Books</span>
            </div>
          </button>
          <button onClick={() => setActiveTab('research')} className={getTabClasses('research')}>
            <div className="flex items-center space-x-2">
              <FlaskConical size={20} />
              <span>Research</span>
            </div>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={activeTab === 'books' ? "Search books..." : "Search papers..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Filter by author..."
              value={filterAuthor}
              onChange={(e) => setFilterAuthor(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>

      {/* --- BOOKS TAB --- */}
      {activeTab === 'books' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="group bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <img src={book.cover} alt={book.title} className="w-full h-48 object-cover rounded-xl mb-4" />
              <h3 className="text-lg font-semibold text-black">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{book.author}</p>
              <div className="flex items-center justify-between">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <Heart size={16} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <MoreHorizontal size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- RESEARCH TAB --- */}
      {activeTab === 'research' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResearch.map((paper) => (
            <div key={paper.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200">
              <img src={paper.cover} alt={paper.title} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">{paper.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{paper.author}</p>
              <p className="text-gray-700 text-sm">{paper.desc}</p>
              <div className="flex justify-end mt-4 space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <Heart size={16} className="text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <MoreHorizontal size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
