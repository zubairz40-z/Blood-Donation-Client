import React from "react";
import { Link } from "react-router";
import Logo from "../../Logo/Logo";

const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal bg-slate-900 base-content p-10 text-slate-50">
      {/* Brand */}
      <aside className="space-y-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10">
            <Logo />
          </div>
          
        </Link>

        <p className="max-w-xs ">
          <span className="font-semibold">LifeDrop Ltd.</span>
          <br />
          Connecting donors, saving lives since 2025.
        </p>

        {/* Social */}
        <div className="flex gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-circle"
            aria-label="Facebook"
            title="Facebook"
          >
            {/* Facebook icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.61.76-1.61 1.54V12h2.74l-.44 2.88h-2.3v6.99A10 10 0 0 0 22 12z" />
            </svg>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-circle"
            aria-label="Instagram"
            title="Instagram"
          >
            {/* Instagram icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-2.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z" />
            </svg>
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-circle"
            aria-label="X / Twitter"
            title="X / Twitter"
          >
            {/* X icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.8l-5.3-6.9L5.2 22H2l7.4-8.5L1 2h7l4.8 6.2L18.9 2zm-1.2 18h1.8L7.1 3.9H5.2L17.7 20z" />
            </svg>
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-circle"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            {/* LinkedIn icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.46v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
          </a>
        </div>
      </aside>

      {/* Platform */}
      <nav>
        <h6 className="footer-title">Platform</h6>
        <Link className="link link-hover" to="/donation-requests">
          Donation Requests
        </Link>
        <Link className="link link-hover" to="/funding">
          Funding
        </Link>
        <Link className="link link-hover" to="/search">
          Search Donors
        </Link>
        <Link className="link link-hover" to="/register">
          Become a Donor
        </Link>
      </nav>

      {/* Support */}
      <nav>
        <h6 className="footer-title">Support</h6>
        <Link className="link link-hover" to="/how-it-works">
          How it works
        </Link>
        <Link className="link link-hover" to="/faq">
          FAQ
        </Link>
        <Link className="link link-hover" to="/contact">
          Contact Us
        </Link>
        <Link className="link link-hover" to="/report">
          Report an issue
        </Link>
      </nav>

      {/* Legal */}
      <nav>
        <h6 className="footer-title">Legal</h6>
        <Link className="link link-hover" to="/terms">
          Terms of use
        </Link>
        <Link className="link link-hover" to="/privacy">
          Privacy policy
        </Link>
        <Link className="link link-hover" to="/cookies">
          Cookie policy
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
