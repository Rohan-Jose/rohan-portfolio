'use client';

import Navigation from '../../components/Navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  color: string;
  tags: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Exiled',
    description: 'An immersive Unreal Engine 5 Arcade Space Simulator for a Game Jam competition',
    imageUrl: 'rohan-portfolio/Exiled.png',
    color: '#3182CE', // Blue
    tags: ['Unreal Engine 5', 'Blender', 'C++']
  },
  {
    id: 2,
    title: 'Brick Breaker',
    description: 'A modern take on the classic brick breaker game built with Unreal Engine 5.',
    imageUrl: 'rohan-portfolio/BrickBreaker.png',
    color: '#805AD5', // Purple
    tags: ['Unity', 'C#', 'Game Development']
  }
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false); // Start with attempting to show video
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

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  return (
    <main 
      className="min-h-screen bg-black text-white overflow-hidden relative"
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
          className="fixed object-cover w-full h-full opacity-30 z-0"
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
          <source src="rohan-portfolio/background.mp4" type="video/mp4" />
          <source src="rohan-portfolio/background.mov" type="video/quicktime" />
          {/* Fallback text */}
          Your browser does not support video playback.
        </video>
      )}
      
      <div className="relative z-10">
        <Navigation />
        
        <div className="container mx-auto px-4 pt-24 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">My Projects</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Here's a selection of my recent work. Each project represents my passion for design and technology.
            </p>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-12 justify-center items-stretch mb-24">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden md:w-[45%]"
              >
                <div 
                  className="relative h-80 w-full overflow-hidden" 
                  style={{ backgroundColor: project.color }}
                >
                  {project.id === 1 || project.id === 2 ? (
                    <Image 
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-white font-bold text-xl">{project.title}</p>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="bg-white/10 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {project.id === 1 || project.id === 2 ? (
                      <button 
                        onClick={() => openProjectModal(project)}
                        className="animated-border-button bg-white/5 text-white px-4 py-2 rounded-md font-medium transition-colors hover:bg-white/10"
                      >
                        View Project
                      </button>
                    ) : (
                      <Link href={`/projects/${project.id}`} className="text-white underline underline-offset-4 hover:text-gray-300">
                        View Project
                      </Link>
                    )}
                    {project.id === 1 && (
                      <a 
                        href="https://team-black-star.itch.io/exiled" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="animated-border-button bg-white/5 text-white px-4 py-2 rounded-md font-medium transition-colors hover:bg-white/10"
                      >
                        Try out the game
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedProject && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg"
            onClick={closeProjectModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ borderWidth: 0 }}
            >
              <div className="relative h-80 w-full">
                <Image
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <button 
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white"
                  onClick={closeProjectModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-8 text-center backdrop-blur-sm bg-white/10">
                <h2 className="text-3xl font-bold mb-4">{selectedProject.title}</h2>
                <p className="text-gray-200 mb-8">{selectedProject.description}</p>
                
                <h3 className="text-xl font-semibold mb-4">Project Gallery</h3>
                
                <div className="space-y-8">
                  {selectedProject.id === 1 ? (
                    <>
                      <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-md">
                        <div className="relative h-64 w-full">
                          <Image
                            src="rohan-portfolio/Exiled2.png"
                            alt="Project screenshot 1"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-gray-200">We used Unreal Engine 5 and featured its Ray Tracing technology.</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-md">
                        <div className="relative h-64 w-full">
                          <Image
                            src="rohan-portfolio/Exiled3.png"
                            alt="Project screenshot 2"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-gray-200">We crafted a new and unique approach to flight movement that proves to be hard to master and maintains a sense of challenge to learn.</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-md">
                        <div className="relative h-64 w-full">
                          <Image
                            src="rohan-portfolio/Exiled4.png"
                            alt="Project screenshot 3"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-gray-200">The game was developed during a 1-week Game Jam, and we are still improving upon it due to its immense potential.</p>
                        </div>
                      </div>
                    </>
                  ) : selectedProject.id === 2 ? (
                    <>
                      <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-md">
                        <div className="relative h-64 w-full">
                          <Image
                            src="rohan-portfolio/BrickBreaker2.png"
                            alt="Project screenshot 1"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-gray-200">A work-in-progress, featuring modern physics and lighting technology for a more realistic experience.</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-md">
                        <div className="relative h-64 w-full">
                          <Image
                            src="rohan-portfolio/BrickBreaker3.png"
                            alt="Project screenshot 2"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-gray-200">Implemented various power-ups and special brick types to enhance the classic gameplay formula.</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-md">
                        <div className="relative h-64 w-full">
                          <Image
                            src="rohan-portfolio/BrickBreaker4.png"
                            alt="Project screenshot 3"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-gray-200">Features multiple levels with increasing difficulty and unique layouts for extended replay value.</p>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
} 