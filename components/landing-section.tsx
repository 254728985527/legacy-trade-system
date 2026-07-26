export function LandingSection() {
  return (
    <div className="w-full bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
            AI-Powered Trading Intelligence
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience next-generation digit prediction powered by advanced machine learning algorithms. Real-time analysis, unprecedented accuracy, and strategic insights at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition transform hover:scale-105">
              Start Trading Now
            </button>
            <button className="px-8 py-3 border-2 border-amber-500 text-amber-400 hover:bg-amber-500/10 font-bold rounded-lg transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-amber-400">Platform Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Real-Time Analysis',
                desc: 'Live market predictions updated every second with cutting-edge AI'
              },
              {
                icon: '📊',
                title: 'Advanced Metrics',
                desc: 'Confidence scores, pattern matching, and signal strength indicators'
              },
              {
                icon: '🎯',
                title: 'High Accuracy',
                desc: 'Industry-leading prediction accuracy with proven track record'
              },
              {
                icon: '💰',
                title: 'Risk Management',
                desc: 'Smart tools to protect your capital and optimize returns'
              },
              {
                icon: '🔐',
                title: 'Secure Trading',
                desc: 'Enterprise-grade security and encrypted transactions'
              },
              {
                icon: '📱',
                title: 'Multi-Platform',
                desc: 'Seamless trading experience on desktop, tablet, and mobile'
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-slate-800/50 rounded-lg border border-amber-500/20 hover:border-amber-500/50 transition hover:bg-slate-700/50">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h4 className="text-lg font-bold text-amber-400 mb-2">{feature.title}</h4>
                <p className="text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: 'Active Traders', value: '50K+' },
              { label: 'Daily Predictions', value: '2.5M+' },
              { label: 'Success Rate', value: '87%' },
              { label: 'Supported Markets', value: '100+' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-lg border border-amber-500/30">
                <div className="text-4xl font-bold text-amber-400 mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-amber-400">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Connect',
                desc: 'Link your trading account and set preferences'
              },
              {
                step: '02',
                title: 'Analyze',
                desc: 'AI engine processes market data in real-time'
              },
              {
                step: '03',
                title: 'Predict',
                desc: 'Get digit predictions with confidence scores'
              },
              {
                step: '04',
                title: 'Trade',
                desc: 'Execute trades with optimized risk parameters'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="p-6 bg-slate-800/50 rounded-lg border border-amber-500/20">
                  <div className="text-4xl font-bold text-amber-500 mb-2">{item.step}</div>
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                    <div className="text-amber-500 text-2xl">→</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-amber-400">Trusted by Traders</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Alex Johnson',
                role: 'Professional Trader',
                text: 'The prediction accuracy is exceptional. This platform transformed my trading strategy.'
              },
              {
                name: 'Maria Garcia',
                role: 'Fintech Analyst',
                text: 'Best AI trading tool I\'ve used. The real-time metrics are incredibly valuable.'
              },
              {
                name: 'James Chen',
                role: 'Risk Manager',
                text: 'Outstanding security and reliability. Highly recommend to anyone serious about trading.'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="p-6 bg-slate-800/50 rounded-lg border border-amber-500/20">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-amber-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-4 text-white">Ready to Elevate Your Trading?</h3>
          <p className="text-xl text-white/90 mb-8">Join thousands of successful traders using AI-powered digit predictions</p>
          <button className="px-10 py-4 bg-black text-amber-400 font-bold rounded-lg hover:bg-slate-900 transition transform hover:scale-105 text-lg">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 py-8 px-4 sm:px-6 lg:px-8 border-t border-amber-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-amber-400 mb-3">Platform</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-3">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition">About</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-3">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Disclaimer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-amber-400 mb-3">Support</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-amber-400 transition">Help Center</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Contact</a></li>
                <li><a href="#" className="hover:text-amber-400 transition">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-500/20 pt-8 text-center text-slate-500">
            <p>&copy; 2024 Last Digit Prediction. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
