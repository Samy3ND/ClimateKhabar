import React from "react"
import { Link } from "react-router-dom"


const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-emerald-900 via-emerald-950 to-black text-gray-200 py-12">
      <div className="container mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">
            About Climate Khabar
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Climate Khabar brings you verified news and local stories on climate
            change, environment, and sustainability in Nepal and beyond.  
            Our goal is to inspire informed action for a greener future.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">
            Quick Links
          </h2>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to={"/"} className="hover:text-emerald-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to={"/about"} className="hover:text-emerald-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to={"/news"} className="hover:text-emerald-400 transition-colors">
                News Articles
              </Link>
            </li>
            <li>
              <Link to={"/"} className="hover:text-emerald-400 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-white">
            Contact Us
          </h2>
          <p className="text-gray-400 text-sm">
            Kathmandu, Nepal
          </p>
          <p className="text-gray-400 text-sm">Email: info@climatekhabar.com</p>
          <p className="text-gray-400 text-sm">Phone: +977 980 000 0000</p>
        </div>
      </div>

      {/* Social + Copyright */}
      <div className="mt-10 border-t border-emerald-800 pt-6 text-center text-gray-400 text-sm">
        <p className="text-gray-300">Follow us on:</p>
        <div className="flex justify-center space-x-6 mt-3 text-gray-400">
          <a href="#" className="hover:text-emerald-400 transition-colors">Facebook</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Instagram</a>
        </div>
        <p className="mt-6 text-gray-500">
          &copy; {new Date().getFullYear()} Climate Khabar. All rights reserved.
        </p>
        <p className="mt-4 text-gray-500">
  Developed by{" "}
  <a
    href="https://kcsamyog.com.np"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 hover:text-gray-400 transition-colors"
  >
    Samyog
  </a>
</p>
      </div>
    </footer>
  )
}




export default Footer
