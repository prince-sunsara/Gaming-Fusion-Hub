// Blog Details page showing full blog post with related articles
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  ChevronUp,
} from "lucide-react";
import { getBlogById, getRelatedBlogs } from "../data/blogs";

const BlogDetails = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Load blog data
  useEffect(() => {
    const blogData = getBlogById(blogId);
    if (blogData) {
      setBlog(blogData);
      const related = getRelatedBlogs(blogData.id, 3);
      setRelatedBlogs(related);
    }
  }, [blogId]);

  // Handle scroll for reading progress and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, currentProgress)));
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog.title;
    const text = blog.excerpt;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      setShowShareMenu(false);
      // You could show a toast notification here
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
      setShowShareMenu(false);
    } else if (navigator.share) {
      navigator.share({ title, text, url });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render markdown-like content with basic formatting
  const renderContent = (content) => {
    return content.split("\n").map((paragraph, index) => {
      // Handle headings
      if (paragraph.startsWith("# ")) {
        return (
          <h1
            key={index}
            className="text-3xl md:text-4xl font-bold gradient-text mb-6 mt-8"
          >
            {paragraph.substring(2)}
          </h1>
        );
      }
      if (paragraph.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-2xl md:text-3xl font-bold text-white mb-4 mt-6"
          >
            {paragraph.substring(3)}
          </h2>
        );
      }
      if (paragraph.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-xl md:text-2xl font-bold text-primary-300 mb-3 mt-5"
          >
            {paragraph.substring(4)}
          </h3>
        );
      }
      if (paragraph.startsWith("#### ")) {
        return (
          <h4
            key={index}
            className="text-lg md:text-xl font-bold text-accent-300 mb-2 mt-4"
          >
            {paragraph.substring(5)}
          </h4>
        );
      }

      // Handle lists
      if (paragraph.startsWith("- ")) {
        return (
          <li key={index} className="text-gray-300 mb-2 ml-6 list-disc">
            {paragraph.substring(2)}
          </li>
        );
      }

      // Handle bold text
      const boldText = paragraph.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-white font-bold">$1</strong>'
      );

      // Handle empty paragraphs
      if (paragraph.trim() === "") {
        return <br key={index} />;
      }

      // Regular paragraphs
      return (
        <p
          key={index}
          className="text-gray-300 mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: boldText }}
        />
      );
    });
  };

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Article not found
          </h2>
          <Link
            to="/blogs"
            className="btn-gaming px-6 py-3 rounded-lg font-semibold"
          >
            <span>Browse Articles</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <div
          className="h-1 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link
            to="/blogs"
            className="hover:text-primary-300 transition-colors duration-300 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>
          <span>/</span>
          <span className="text-white truncate">{blog.title}</span>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-6">
            <span className="bg-primary-500/20 text-primary-300 px-3 py-1 rounded-full capitalize font-medium">
              {blog.category}
            </span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.publishDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views.toLocaleString()} views</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold gradient-text mb-6 leading-tight">
            {blog.title}
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-b border-dark-600 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isLiked
                    ? "text-red-400 bg-red-500/20 hover:bg-red-500/30"
                    : "text-gray-400 hover:text-red-400 hover:bg-red-500/20"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span>{blog.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isBookmarked
                    ? "text-yellow-400 bg-yellow-500/20 hover:bg-yellow-500/30"
                    : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/20"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                />
                <span>Save</span>
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-lg transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>

              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-20 overflow-hidden">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-dark-700 transition-colors duration-300 text-gray-300"
                  >
                    <Twitter className="w-4 h-4 text-blue-400" />
                    <span>Share on Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-dark-700 transition-colors duration-300 text-gray-300"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>Share on Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-dark-700 transition-colors duration-300 text-gray-300"
                  >
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    <span>Share on LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-dark-700 transition-colors duration-300 text-gray-300"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="text-gray-300 leading-relaxed">
            {renderContent(blog.content)}
          </div>
        </article>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-dark-600">
          <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="bg-dark-700 hover:bg-primary-500/20 text-gray-400 hover:text-primary-300 px-3 py-1 rounded-lg text-sm transition-all duration-300 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Info */}
        <div className="mt-8 p-6 bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {blog.author.charAt(0)}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{blog.author}</h4>
              <p className="text-gray-400 text-sm">
                Gaming Enthusiast & Content Creator
              </p>
              <p className="text-gray-300 text-sm mt-2">
                Passionate about gaming technology and sharing insights with the
                community.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-8">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  to={`/blog/${relatedBlog.slug}`}
                  className="gaming-card bg-dark-800/50 backdrop-blur-md rounded-xl border border-dark-700 hover:border-primary-500/50 overflow-hidden transition-all duration-300 group"
                >
                  <div className="relative h-32 bg-gradient-to-br from-primary-900/30 to-accent-900/30 flex items-center justify-center">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {relatedBlog.category === "technology"
                        ? "⚡"
                        : relatedBlog.category === "reviews"
                        ? "⭐"
                        : "📝"}
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-xs bg-primary-500/20 text-primary-300 px-2 py-1 rounded capitalize">
                      {relatedBlog.category}
                    </span>
                    <h4 className="text-white font-bold mt-2 mb-2 line-clamp-2 group-hover:text-primary-300 transition-colors duration-300">
                      {relatedBlog.title}
                    </h4>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {relatedBlog.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>{relatedBlog.readTime}</span>
                      <span>{relatedBlog.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shadow-primary-500/25 z-30"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowShareMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default BlogDetails;
