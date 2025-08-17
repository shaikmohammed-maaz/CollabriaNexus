import React, { useState } from "react";

// Enhanced blog data with more variety and engaging content
const blogPosts = [
  {
    id: 1,
    title: "The Future of Digital Mining: Earn While You Sleep",
    date: "August 18, 2025",
    author: "Team MineVerse",
    category: "Getting Started",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop",
    excerpt: "Ever wondered what it's like to make money while binge-watching your favorite series or catching some Z's? Welcome to 24-hour continuous mining — the game-changer in passive earnings.",
    content: `The digital revolution has transformed how we think about earning money. Gone are the days when you needed to be physically present to generate income. Our advanced mining system represents the pinnacle of passive earning technology.

**How It Works:**
Our mining system operates on a revolutionary algorithm that ensures continuous operation. Unlike traditional mining that requires constant monitoring and expensive hardware, MineVerse runs entirely in the cloud. Your personal mining node works 24/7, processing transactions and generating rewards.

**The Mathematics of Passive Income:**
With our fixed daily rate system, you can predict your earnings with mathematical precision. Each mining session generates a baseline reward, with bonuses applied based on your referral network and consistency streaks.

**No More Hardware Hassles:**
Forget about:
• Expensive ASIC miners
• Skyrocketing electricity bills  
• Constant hardware maintenance
• Complex technical setups

**The Network Effect:**
Our referral system isn't just about invitations — it's about building a mining network. Each friend you refer doesn't just boost your rate; they become part of your extended mining collective, creating a compound effect that grows exponentially.

In this new era of digital wealth creation, your social connections become your most valuable asset.`,
  },
  {
    id: 2,
    title: "Advanced Mining Strategies: From Beginner to Pro",
    date: "August 17, 2025",
    author: "MineVerse Research Team",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    excerpt: "Ready to level up your mining game? These expert-tested strategies can multiply your daily earnings and accelerate your journey to financial freedom.",
    content: `Every successful miner follows a strategic approach. Here are the proven methods used by our top earners:

**1. The Early Bird Advantage**
Starting your mining session early in the day maximizes your earning window. Our data shows that miners who begin before 9 AM earn 23% more on average than those who start later.

**2. The Referral Multiplication Strategy**  
Each referral doesn't just add to your network — it multiplies your potential. With our tiered bonus system:
• 1-5 referrals: +10% base rate
• 6-15 referrals: +25% base rate  
• 16+ referrals: +40% base rate

**3. Consistency Compound Effect**
Daily mining creates momentum. Our algorithm rewards consistency with streak bonuses:
• 7-day streak: +5% bonus
• 30-day streak: +15% bonus
• 90-day streak: +30% bonus

**4. Community Intelligence**
Join our mining forums and Discord channels. Top miners share real-time insights about optimal mining windows, market conditions, and emerging opportunities.

**5. Portfolio Diversification**
Don't put all your coins in one basket. Our platform offers multiple mining algorithms — diversify across different coin types to minimize risk and maximize rewards.

**Pro Tip:** The most successful miners treat this as a long-term investment strategy, not a get-rich-quick scheme.`,
  },
  {
    id: 3,
    title: "Understanding Blockchain: The Technology Behind Your Earnings",
    date: "August 16, 2025",
    author: "Dr. Sarah Chen, Blockchain Architect",
    category: "Education",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop",
    excerpt: "Curious about the technology powering your mining rewards? Dive into the fascinating world of blockchain and discover how your participation helps secure the global digital economy.",
    content: `Blockchain technology is the backbone of all cryptocurrency operations, and understanding it helps you appreciate the value you're creating as a miner.

**What is Blockchain?**
Think of blockchain as a digital ledger that's shared across thousands of computers worldwide. Every transaction is recorded in "blocks" that are linked together in a "chain" — hence the name blockchain.

**Your Role as a Miner:**
When you mine on MineVerse, you're not just earning coins — you're participating in a global network that:
• Validates transactions
• Secures the network against fraud
• Maintains the integrity of the digital currency system
• Processes payments for millions of users worldwide

**The Mining Process Simplified:**
1. **Transaction Collection:** Your mining node collects pending transactions
2. **Verification:** Complex algorithms verify each transaction's legitimacy  
3. **Block Creation:** Valid transactions are bundled into a new block
4. **Network Consensus:** The network agrees on the new block's validity
5. **Reward Distribution:** You receive coins for your contribution

**Why Decentralization Matters:**
Unlike traditional banking systems controlled by single entities, blockchain networks are decentralized. This means:
• No single point of failure
• Transparent operations
• Lower transaction fees
• 24/7 global accessibility

**The Environmental Question:**
MineVerse uses energy-efficient Proof-of-Stake algorithms, consuming 99.9% less energy than traditional Bitcoin mining. Your mining activity actually contributes to a more sustainable blockchain ecosystem.

Understanding these fundamentals helps you appreciate that you're not just earning money — you're participating in the future of finance.`,
  },
  {
    id: 4,
    title: "Market Analysis: Crypto Trends Shaping 2025",
    date: "August 15, 2025", 
    author: "Marcus Rodriguez, Market Analyst",
    category: "Market Insights",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    excerpt: "The cryptocurrency landscape is evolving rapidly. Stay ahead of the curve with our analysis of the trends defining the digital asset market in 2025.",
    content: `The cryptocurrency market in 2025 is characterized by maturation, regulation, and unprecedented mainstream adoption. Here's what every miner should know:

**Institutional Adoption Surge:**
Major corporations and governments are now integrating cryptocurrency into their operations:
• Over 100 countries have launched central bank digital currencies (CBDCs)
• Fortune 500 companies hold an average of 12% of their treasury in crypto
• Traditional banks now offer cryptocurrency services to retail customers

**Regulatory Clarity:**
The regulatory landscape has significantly improved:
• Clear guidelines for cryptocurrency taxation
• Standardized compliance requirements for exchanges
• Legal framework for DeFi protocols and mining operations

**Technology Advancements:**
Mining efficiency has improved dramatically:
• Next-generation consensus mechanisms
• Layer 2 scaling solutions reducing transaction costs
• Quantum-resistant encryption protocols

**Market Predictions for Q4 2025:**
Based on current trends and adoption rates:
• Increased mining rewards due to network growth
• Greater price stability as markets mature
• New opportunities in emerging blockchain applications

**What This Means for Miners:**
• Higher baseline rewards as network value increases
• More predictable earnings patterns
• Enhanced security and reduced platform risk
• Growing utility for earned coins in real-world applications

**Risk Management:**
While opportunities abound, smart miners maintain:
• Diversified portfolios across multiple coins
• Regular withdrawal strategies
• Awareness of market cycles and volatility patterns

The future looks bright for those who approach mining with knowledge, strategy, and patience.`,
  },
  {
    id: 5,
    title: "Community Spotlight: Success Stories from Top Miners",
    date: "August 14, 2025",
    author: "Community Team",
    category: "Community",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
    excerpt: "Meet the miners who turned small daily rewards into life-changing income streams. Their strategies, challenges, and advice for newcomers.",
    content: `Success in mining isn't just about the technology — it's about the people who use it strategically. Here are inspiring stories from our community:

**Featured Miner: Alex Thompson**
*Started: January 2025 | Total Earned: 15,847 coins*

"I began with skepticism but decided to try mining for just one month. The key was treating it like a savings account — consistent daily deposits, regardless of market conditions. My referral network grew organically through genuine recommendations to friends who were also looking for passive income."

**Alex's Strategy:**
• Consistent daily mining for 8 months straight
• Built a referral network of 23 active miners
• Reinvested 30% of earnings back into mining boosts
• Diversified across three different coin types

**Featured Miner: Maria Santos**  
*Started: March 2025 | Total Earned: 12,203 coins*

"As a working mother, I needed income that didn't require constant attention. MineVerse became my 'digital piggy bank.' While my kids slept, my mining operation earned. The mobile app made it easy to check progress during lunch breaks."

**Maria's Approach:**
• Focused on referrals within parent communities
• Used earnings to supplement family income
• Maintained detailed records for tax purposes
• Participated actively in community forums

**Featured Miner: James Park**
*Started: February 2025 | Total Earned: 18,992 coins*

"I approached mining like a business. I tracked metrics, optimized timing, and treated my referral network as a professional relationship. The compound effect of consistent mining plus referral bonuses created exponential growth."

**James's Method:**
• Created spreadsheets to track performance
• Scheduled mining sessions for optimal times
• Provided ongoing support to his referral network
• Diversified mining across multiple platforms

**Common Success Factors:**
• **Consistency:** All successful miners maintain daily habits
• **Community:** Building genuine relationships, not just referrals
• **Patience:** Long-term thinking over quick gains
• **Learning:** Staying informed about platform updates and market trends

**Advice for New Miners:**
"Start small, stay consistent, and focus on building authentic connections. The technology handles the complexity — your job is simply to show up every day." - Alex Thompson

These success stories prove that with the right approach, mining can become a reliable income stream that grows over time.`,
  },
  {
    id: 6,
    title: "Security Best Practices: Protecting Your Digital Assets",
    date: "August 13, 2025",
    author: "Security Team",
    category: "Security", 
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    excerpt: "Your mining rewards are valuable digital assets. Learn how to protect them with industry-standard security practices and avoid common pitfalls.",
    content: `Digital asset security is paramount in the cryptocurrency world. Here's your comprehensive guide to keeping your mining rewards safe:

**Account Security Fundamentals:**

**1. Strong Password Policies**
• Use unique passwords of 16+ characters
• Include uppercase, lowercase, numbers, and symbols  
• Never reuse passwords across platforms
• Consider using a reputable password manager

**2. Two-Factor Authentication (2FA)**
• Enable 2FA on all accounts immediately
• Use authenticator apps rather than SMS when possible
• Keep backup codes in a secure, offline location
• Update authentication methods regularly

**3. Device Security**
• Keep all devices updated with latest security patches
• Use antivirus software on computers and mobile devices
• Avoid accessing accounts on public WiFi networks
• Log out of sessions when using shared devices

**Wallet Security Best Practices:**

**4. Withdrawal Strategies**
• Don't keep all coins on the mining platform
• Set up regular automatic withdrawals to personal wallets
• Use hardware wallets for long-term storage
• Diversify across multiple wallet types

**5. Private Key Management**  
• Never share private keys or seed phrases
• Store recovery phrases offline in multiple secure locations
• Use hardware wallets for significant amounts
• Test wallet recovery process with small amounts first

**Common Security Threats:**

**6. Phishing Prevention**
• Always verify URLs before entering credentials
• Be suspicious of unsolicited emails or messages
• Never click links in suspicious communications
• Bookmark official platform URLs

**7. Social Engineering Awareness**
• Be cautious about sharing mining success publicly
• Don't provide account information to "support" contacts
• Verify official communications through multiple channels
• Trust but verify all platform announcements

**Platform-Specific Security:**

**8. MineVerse Security Features**
• Enable email notifications for all account activities
• Regularly review account access logs
• Set up withdrawal limits and cooling-off periods
• Use IP address restrictions when available

**Emergency Procedures:**

**9. If Your Account is Compromised**
• Immediately change passwords and revoke active sessions
• Contact platform support through official channels
• Document all unauthorized activities
• Review and secure all connected accounts

**10. Regular Security Audits**
• Monthly review of account activities
• Quarterly update of all passwords and security settings  
• Annual review of wallet and storage strategies
• Stay informed about new security threats and solutions

**Remember:** Security is an ongoing process, not a one-time setup. The time invested in proper security measures far outweighs the potential losses from inadequate protection.

Your mining rewards represent real value — protect them accordingly.`,
  }
];

const BlogPage = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Getting Started', 'Strategy', 'Education', 'Market Insights', 'Community', 'Security'];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

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
      </div>

      {/* Category Filter */}
      <div className="max-w-5xl mx-auto mb-8">
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

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-[#1d1d2e] rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              {post.category && (
                <span className="inline-block bg-purple-600 text-xs px-2 py-1 rounded-full mb-2">
                  {post.category}
                </span>
              )}
              <h2 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h2>
              <div className="flex items-center text-xs text-gray-400 mb-3">
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span>{post.author}</span>
              </div>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-md text-sm font-medium"
                onClick={() => setSelectedPost(post)}
              >
                Read Full Article
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn p-4">
          <div className="bg-[#1d1d2e] max-w-4xl w-full rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
            {/* Header Image */}
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-64 object-cover"
            />
            {/* Content */}
            <div className="p-6">
              {selectedPost.category && (
                <span className="inline-block bg-purple-600 text-xs px-3 py-1 rounded-full mb-4">
                  {selectedPost.category}
                </span>
              )}
              <h2 className="text-3xl font-bold mb-3">{selectedPost.title}</h2>
              <div className="flex items-center text-sm text-gray-400 mb-6">
                <span>{selectedPost.date}</span>
                <span className="mx-2">•</span>
                <span>by {selectedPost.author}</span>
              </div>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
                {selectedPost.content}
              </div>
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-md text-white transition"
                >
                  Close
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md text-white transition">
                  Share Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
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
        .prose h1, .prose h2, .prose h3 {
          color: #fff;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .prose strong {
          color: #a855f7;
        }
        .prose ul {
          margin: 1em 0;
        }
        .prose li {
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
};

export default BlogPage;