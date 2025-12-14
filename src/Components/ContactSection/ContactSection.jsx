import React, { useState } from "react";
import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // for now: just clear + you can add toast later
    console.log("Contact Form Submitted:", form);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="bg-secondary  py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-secondary">
            Contact Us
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Need help? Let’s talk
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-50 sm:text-base">
            If you have questions about registration, donation requests, or the
            platform, send us a message. Our team will respond as soon as
            possible.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* LEFT: Contact Info */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900">Contact details</h3>
            <p className="mt-2 text-sm text-slate-600">
              Reach us quickly using the details below.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary/10 text-secondary">
                  <FiPhoneCall className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Hotline</p>
                  <p className="font-semibold text-slate-900">+95352242424</p>
                  <p className="text-xs text-slate-500">Available: 9AM – 9PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary/10 text-secondary">
                  <FiMail className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Email</p>
                  <p className="font-semibold text-slate-900">
                    support@blooddonate.com
                  </p>
                  <p className="text-xs text-slate-500">
                    We reply within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary/10 text-secondary">
                  <FiMapPin className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Address</p>
                  <p className="font-semibold text-slate-900">
                    Dhaka, Bangladesh
                  </p>
                  <p className="text-xs text-slate-500">
                    (Put your office location later)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-secondary/10 p-5">
              <p className="text-sm font-semibold text-slate-900">
                Emergency tip
              </p>
              <p className="mt-1 text-sm text-slate-700">
                For urgent needs, create a blood request from the dashboard so
                donors can respond quickly.
              </p>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900">
              Send us a message
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Fill out the form and we’ll get back to you soon.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows={5}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-secondary/20 transition hover:opacity-90 active:scale-[0.98]"
              >
                Send Message
              </button>

              <p className="text-center text-xs text-slate-500">
                By submitting, you agree to be contacted about your request.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
