import Link from 'next/link';
import Navigation from './components/Navigation';
import ParticleEffect from './components/canvas/ParticleEffect';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative">
      <Navigation />
      <ParticleEffect />
      
      <div className="container mx-auto px-4 pt-24 flex flex-col items-center justify-center z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-thin tracking-tight mb-4">
            Rohan Jose
          </h1>
          <h2 className="text-xl md:text-3xl font-light mb-8">
            Designer & Developer
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            I create beautiful, functional digital experiences with a focus on user interaction and visual design.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link 
              href="/projects" 
              className="animated-border-button bg-white text-black px-6 py-3 rounded-md font-medium transition-colors hover:bg-gray-200"
            >
              View My Work
            </Link>
            <Link 
              href="/contact" 
              className="animated-border-button border border-white text-white px-6 py-3 rounded-md font-medium transition-colors hover:bg-white/10"
            >
              Contact Me
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">About Me</h3>
            <p className="text-gray-300">
              I'm a passionate creative professional with expertise in both design and development. 
              My work spans across various digital mediums, bringing ideas to life with clean code and striking visuals.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Skills</h3>
            <ul className="grid grid-cols-2 gap-2 text-gray-300">
              <li>Unreal Engine 5</li>
              <li>Cybersecurity</li>
              <li>SwiftUI</li>
              <li>Blender</li>
              <li>Full-stack Development</li>
              <li>Database</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            href="rohan-portfolio/Resume 2024.pdf" 
            target="_blank" 
            className="animated-border-button border border-white text-white px-6 py-3 rounded-md font-medium transition-colors hover:bg-white/10"
          >
            Download Resume
          </Link>
        </div>
      </div>
    </main>
  );
}
