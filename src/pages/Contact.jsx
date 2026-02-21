import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitContactMessage, resetContactSubmit } from "../actions/customerActions";

const Contact = () => {
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector((state) => state.contactSubmit);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  // Reset Redux state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetContactSubmit());
    };
  }, [dispatch]);

  // Map Django field-level errors from the Redux error payload
  useEffect(() => {
    if (error && typeof error === "object" && !error.message) {
      const mapped = {};
      for (const [key, val] of Object.entries(error)) {
        mapped[key] = Array.isArray(val) ? val.join(" ") : val;
      }
      setFieldErrors(mapped);
    }
  }, [error]);

  // Clear form on success
  useEffect(() => {
    if (success) {
      setForm({ name: "", email: "", message: "" });
      setFieldErrors({});
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = "Please enter your name.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email address.";
    if (!form.message.trim() || form.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetContactSubmit());

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    dispatch(submitContactMessage(form));
  };

  // Generic server error (non-field errors or network failure)
  const genericError =
    error && (typeof error === "string" || error.detail || error.message)
      ? error.detail || error.message || error
      : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-8 text-center">
        Contact
      </h1>

      <div className="space-y-6">
        {/* Contact Info */}
        <div className="border border-black p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest font-medium">Get in Touch</h2>
          <div className="space-y-2 text-xs text-gray-600">
            <p>Email: info@soundwaveaudio.co.ke</p>
            <p>Phone: +254 (0) 724 013 583</p>
            <p>Address: Park Road Business Center, Ring Road, Ngara, Nairobi, Kenya</p>
          </div>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="border border-green-600 bg-green-50 p-4 text-xs text-green-700">
            ✓ Your message has been received. We'll get back to you shortly!
          </div>
        )}

        {/* Generic Server Error */}
        {genericError && (
          <div className="border border-red-500 bg-red-50 p-4 text-xs text-red-600">
            {genericError}
          </div>
        )}

        {/* Contact Form */}
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              disabled={loading || success}
              className={`w-full px-4 py-3 text-xs border focus:outline-none focus:border-gray-600 disabled:opacity-50 ${
                fieldErrors.name ? "border-red-500" : "border-black"
              }`}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              disabled={loading || success}
              className={`w-full px-4 py-3 text-xs border focus:outline-none focus:border-gray-600 disabled:opacity-50 ${
                fieldErrors.email ? "border-red-500" : "border-black"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Message"
              rows="6"
              value={form.message}
              onChange={handleChange}
              disabled={loading || success}
              className={`w-full px-4 py-3 text-xs border focus:outline-none focus:border-gray-600 disabled:opacity-50 ${
                fieldErrors.message ? "border-red-500" : "border-black"
              }`}
            />
            {fieldErrors.message && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;