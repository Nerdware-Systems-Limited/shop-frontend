const Contact = () => (
  <div className="max-w-2xl mx-auto px-4 py-20">
    <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-8 text-center">Contact</h1>
    <div className="space-y-6">
      <div className="border border-black p-6 space-y-4">
        <h2 className="text-xs uppercase tracking-widest font-medium">Get in Touch</h2>
        <div className="space-y-2 text-xs text-gray-600">
          <p>Email: info@soundsltd.com</p>
          <p>Phone: +254 (0) 700 000 000</p>
          <p>Address: Nairobi, Kenya</p>
        </div>
      </div>
      
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full px-4 py-3 text-xs border border-black focus:outline-none focus:border-gray-600"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 text-xs border border-black focus:outline-none focus:border-gray-600"
        />
        <textarea
          placeholder="Message"
          rows="6"
          className="w-full px-4 py-3 text-xs border border-black focus:outline-none focus:border-gray-600"
        />
        <button
          type="submit"
          className="w-full px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  </div>
);

export default Contact;