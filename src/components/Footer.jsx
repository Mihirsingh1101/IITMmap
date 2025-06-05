// src/components/Footer.jsx
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { icon: FaFacebookF, href: "https://www.facebook.com/IITMandi", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com/IITMandi", label: "Twitter" },
    { icon: FaInstagram, href: "https://www.instagram.com/iitmandi/", label: "Instagram" },
  ];

  return (
    <footer className="bg-brand-primary text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Institute Info */}
          <div className="md:col-span-1 text-center md:text-left">
            <img src="/IIT_logo.png" alt="IIT Mandi Logo" className="h-16 mx-auto md:mx-0 mb-4" />
            <h2 className="text-2xl font-semibold text-white">IIT Mandi</h2>
            <p className="mt-2 text-sm">
              Indian Institute of Technology Mandi, Kamand, Himachal Pradesh - 175075, India
            </p>
          </div>

          {/* Quick Links & Contact */}
          <div className="md:col-span-1 text-center">
            <h3 className="text-lg font-semibold text-brand-accent mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="https://iitmandi.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Official Website</a></li>
              <li><a href="https://iitmandi.ac.in/academics" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Academics</a></li>
              <li><a href="https://iitmandi.ac.in/administration/advrt/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Social Media & Contact */}
          <div className="md:col-span-1 text-center md:text-right">
            <h3 className="text-lg font-semibold text-brand-accent mb-4">Connect With Us</h3>
            <div className="flex justify-center md:justify-end space-x-5 mb-4">
              {socialLinks.map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}
                   className="text-gray-400 hover:text-white transition-colors">
                  <link.icon size={22} />
                </a>
              ))}
            </div>
            <a href="mailto:contact@iitmandi.ac.in" className="inline-flex items-center text-sm hover:text-white transition-colors">
              <FaEnvelope className="mr-2" /> contact@iitmandi.ac.in
            </a>
            <a href="https://maps.google.com/?q=IIT+Mandi" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-sm hover:text-white transition-colors">
                <FaMapMarkerAlt className="mr-2" /> View on Map
            </a>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-700 text-center text-sm">
          <p>© {new Date().getFullYear()} Indian Institute of Technology Mandi. All rights reserved.</p>
          <p className="mt-1">Designed with passion.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;