'use client';

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import Navigation from '../../components/Navigation';
import { motion } from 'framer-motion';
import ParticleEffect from '../../components/canvas/ParticleEffect';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Ensure video plays when component mounts
    if (videoRef.current) {
      // Handle video loading
      videoRef.current.addEventListener('loadeddata', () => {
        console.log("Video loaded successfully");
        setVideoLoaded(true);
        setVideoError(false);
      });
      
      // Handle video errors
      videoRef.current.addEventListener('error', (e) => {
        console.error("Video error:", e);
        setVideoError(true);
      });
      
      // Try to play the video
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
        setVideoError(true);
      });
    }
    
    // Set a timeout to show fallback if video doesn't load within 3 seconds
    const timeoutId = setTimeout(() => {
      if (!videoLoaded) {
        console.log("Video loading timeout - showing fallback");
        setVideoError(true);
      }
    }, 3000);
    
    return () => clearTimeout(timeoutId); // Clean up timeout on component unmount
  }, [videoLoaded]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('https://rohan-jose.github.io/rohan-portfolio/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main 
      className="min-h-screen bg-black text-white relative overflow-hidden"
      style={{
        backgroundImage: videoError ? 
          'linear-gradient(to bottom right, #1e3a8a, #6b21a8, #000000)' : 
          'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="auto"
          className="fixed object-cover w-full h-full opacity-20 z-0"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            objectFit: 'cover'
          }}
          onError={() => setVideoError(true)}
        >
          {/* Use mp4 as primary source which has better browser support */}
          <source src="https://rohan-jose.github.io/rohan-portfolio/background.mp4" type="video/mp4" />
          <source src="https://rohan-jose.github.io/rohan-portfolio/background.mov" type="video/quicktime" />
          {/* Fallback text */}
          Your browser does not support video playback.
        </video>
      )}
      
      <Navigation />
      <ParticleEffect />
      
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Me</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out using the form below or through my contact details.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            {submitSuccess ? (
              <div className="bg-green-500/20 border border-green-500 p-4 rounded-md mb-6">
                <p className="text-green-300">Thank you for your message! I'll get back to you soon.</p>
              </div>
            ) : null}
            {submitError ? (
              <div className="bg-red-500/20 border border-red-500 p-4 rounded-md mb-6">
                <p className="text-red-300">Error: {submitError}</p>
              </div>
            ) : null}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-white text-black font-medium py-3 rounded-xl transition-all ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-200'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Email</h3>
                <a href="mailto:rohanjose0310@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                  rohanjose0310@gmail.com
                </a>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Phone</h3>
                <a href="tel:+13128234057" className="text-gray-300 hover:text-white transition-colors">
                  +1 (312) 823-4057
                </a>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Social Media</h3>
                <div className="flex space-x-4">
                  <a href="https://www.linkedin.com/in/rohan-jose-691b87211/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Location</h3>
                <p className="text-gray-300">
                  Chicago, IL<br />
                  United States
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
} 