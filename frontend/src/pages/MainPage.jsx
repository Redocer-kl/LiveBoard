import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MainPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-indigo-600"
          >
            CollabBoard
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {['Features', 'How It Works', 'Examples', 'Testimonials', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-gray-700 hover:text-indigo-600 transition-colors">
                {item}
              </a>
            ))}
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Sign Up
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 px-6 py-4 bg-white rounded-lg shadow-lg"
          >
            <div className="flex flex-col space-y-4">
              {['Features', 'How It Works', 'Examples', 'Testimonials', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(' ', '-')}`} 
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
                <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  Sign In
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>


      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="md:w-1/2 mb-10 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Collaborate in Real-Time with Our Digital Whiteboard
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Create, share, and brainstorm with your team from anywhere. Perfect for remote teams, educators, and creative professionals.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                Start Drawing Now
              </button>
              <button className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                Watch Demo
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:w-1/2 flex justify-center"
          >
            <div className="relative">
              <div className="w-80 h-64 bg-white rounded-xl shadow-2xl flex items-center justify-center border-2 border-indigo-100">
                <div className="text-center p-6">
                  <div className="text-indigo-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium">Interactive Whiteboard Preview</p>
                  <p className="text-gray-500 text-sm mt-2">Real-time collaboration with multiple users</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-200 rounded-lg opacity-50 animate-pulse"></div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-pulse delay-300"></div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our whiteboard comes packed with everything you need for effective collaboration and creativity.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Real-Time Collaboration', 
                description: 'Work together with your team in real-time, no matter where they are located.',
                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
              },
              { 
                title: 'Multiple Drawing Tools', 
                description: 'Choose from pens, markers, shapes, and more to express your ideas.',
                icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
              },
              { 
                title: 'Unlimited Canvases', 
                description: 'Create as many boards as you need and organize them into projects.',
                icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
              },
              { 
                title: 'Export & Share', 
                description: 'Download your creations as images or PDFs, or share them with a link.',
                icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
              },
              { 
                title: 'Templates Library', 
                description: 'Get started quickly with our collection of pre-designed templates.',
                icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
              },
              { 
                title: 'Version History', 
                description: 'Never lose an idea with automatic version history and restore points.',
                icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-6 bg-indigo-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Getting started with CollabBoard is simple and straightforward.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create an Account', description: 'Sign up for free in just a few seconds with your email.' },
              { step: '2', title: 'Start a New Board', description: 'Create a blank canvas or choose from our templates.' },
              { step: '3', title: 'Invite & Collaborate', description: 'Share the link with teammates and start creating together.' },
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm text-center"
              >
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Users Say</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied users.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: 'Sarah Johnson', 
                role: 'Product Designer',
                comment: 'This whiteboard app has completely transformed how our remote team brainstorms and collaborates on ideas.',
                avatar: 'SJ'
              },
              { 
                name: 'Michael Chen', 
                role: 'Education Director',
                comment: 'My students love using CollabBoard for group projects. The real-time collaboration is seamless and intuitive.',
                avatar: 'MC'
              },
              { 
                name: 'Jessica Williams', 
                role: 'Project Manager',
                comment: 'We tried several whiteboard tools, but this one stands out for its simplicity and powerful features.',
                avatar: 'JW'
              },
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl shadow-sm"
              >
                <div className="flex items-center mb-4">

                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Start Creating?</h2>
            <p className="text-indigo-100 max-w-3xl mx-auto mb-8">
              Join thousands of users who are already collaborating on CollabBoard. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-md">
                Sign Up Free
              </button>
              <button className="px-8 py-3 border border-white text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CollabBoard</h3>
            <p className="text-gray-400">
              The ultimate real-time collaboration whiteboard for teams and educators.
            </p>
          </div>
          
          {[
            {
              title: 'Product',
              links: ['Features', 'Examples', 'Pricing', 'API']
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Contact']
            },
            {
              title: 'Resources',
              links: ['Documentation', 'Tutorials', 'Support', 'Community']
            }
          ].map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} CollabBoard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
