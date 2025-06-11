import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Top Roadmaps</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="#" className="footer-link">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="#" className="footer-link">
                  Data Science
                </Link>
              </li>
              <li>
                <Link to="#" className="footer-link">
                  Mobile Development
                </Link>
              </li>
              <li>
                <Link to="#" className="footer-link">
                  DevOps
                </Link>
              </li>
              <li>
                <Link to="#" className="footer-link">
                  Cybersecurity
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Resources</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="#" className="footer-link">
                  HTML Tutorial
                </Link>
              </li>
              <li>
                <Link to="#" className="footer-link">
                  CSS Tutorial
                </Link>
              </li>
              <li>
                <Link to="#" className="footer-link">
                  JavaScript Tutorial
                </Link>
              </li>
              <li>
                <Link to="#" className="footer-link">
                  Python Tutorial
                </Link>
              </li>
              <li>
                <Link to="#" className="footer-link">
                  Database Tutorial
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Community</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="#" className="footer-link">
                  Forums
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="footer-link">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="footer-link">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-white">Learn with Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/login" className="footer-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="footer-link">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/roadmaps" className="footer-link">
                  Browse Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="footer-link">
                  Favorites
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2023-2024 Hutech.IO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
