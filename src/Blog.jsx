import React, { useState } from "react";


// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "The Future of Digital Mining: Earn While You Sleep",
    date: "August 2025",
    author: "Team MineVerse",
    image:
      "https://www.shutterstock.com/image-vector/crypto-currency-news-golden-bitcoin-260nw-773520289.jpg",
    excerpt:
      "Ever wondered what it’s like to make money while binge-watching your favorite series or catching some Z’s? Welcome to 24-hour continuous mining — the game-changer in passive earnings.",
    content: `
      Our mining system is designed to keep working for you, even when you’re offline. 
      With a fixed daily rate, your earnings grow slowly but steadily, showing live updates so you can watch your balance increase in real time.

      Why is this exciting? Because you no longer need expensive equipment, high electricity bills, or complex setups. 
      All you need is an account and a bit of patience.

      And here’s the best part — refer your friends, and you’ll get a mining rate boost. The more friends you invite, the faster your coins grow.

      In this digital gold rush, the only limit is how connected you are.
    `,
  },
  {
    id: 2,
    title: "5 Pro Tips to Maximize Your Mining Rewards",
    date: "August 2025",
    author: "MineVerse Experts",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLnfqmMJxmTpx8W2l0O9vRHBY6EA-RlBtP4g&s",
    excerpt:
      "Want to mine faster? These simple strategies can give you a head start in the race for coins.",
    content: `
      1. **Start Early** – The sooner you begin your 24-hour session, the sooner it resets.
      2. **Use Referrals** – Each referral increases your rate for the next session.
      3. **Stay Consistent** – Daily mining builds momentum.
      4. **Engage with the Community** – Learn new hacks from fellow miners.
      5. **Track Your Stats** – Use the live dashboard to keep an eye on your progress.
    `,
  },
];

const BlogPage = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="bg-[#0f0f1a] min-h-screen text-white px-6 py-10 pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        📰 The MineVerse Blog
      </h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-[#1d1d2e] rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/40 transition"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-xs text-gray-400 mb-2">
                {post.date} · by {post.author}
              </p>
              <p className="text-gray-300 text-sm mb-3">{post.excerpt}</p>
              <button
                className="text-purple-400 text-sm hover:underline"
                onClick={() => setSelectedPost(post)}
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-[#1d1d2e] max-w-3xl w-full rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            {/* Header Image */}
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-64 object-cover"
            />
            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
              <p className="text-xs text-gray-400 mb-4">
                {selectedPost.date} · by {selectedPost.author}
              </p>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {selectedPost.content}
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Style */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default BlogPage;
