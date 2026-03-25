"use client";

import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Web3Forms Public Access Key
    // Note: User must get this key directly from web3forms.com by entering rajna.pusalkar51@gmail.com
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    
    if (!accessKey) {
      setStatus("error");
      setErrorMessage("System Log: Missing NEXT_PUBLIC_WEB3FORMS_KEY in your deployment environment variables.");
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: "New Contact Inquiry - India Energy Law Association",
          from_name: formData.name,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Not provided",
          message: formData.message,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(result.message || "Failed to transmit message securely.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("A network drop occurred while submitting the form.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
      {status === "success" ? (
        <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in duration-700">
          <CheckCircle className="w-16 h-16 text-[var(--color-brand-primary)] mb-6" />
          <h3 className="text-3xl font-serif text-[var(--color-headings)] mb-4">Message Received</h3>
          <p className="text-[var(--color-foreground)] font-sans">
            Thank you for reaching out to the India Energy Law Association. We will review your inquiry backing the future of energy law and get back to you shortly.
          </p>
          <button 
            onClick={() => setStatus("idle")}
            className="mt-8 px-8 py-3 rounded-full border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors duration-300 font-sans tracking-widest text-xs uppercase"
          >
            Compose Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {status === "error" && (
            <div className="flex items-start gap-3 bg-red-50/50 p-4 rounded-xl border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-sans">{errorMessage}</p>
            </div>
          )}

          {/* Name & Email Row */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-2">
              <label htmlFor="name" className="text-xs font-sans uppercase tracking-widest text-gray-500 ml-2">Full Name *</label>
              <input 
                id="name"
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/60 border border-gray-200 focus:border-[var(--color-brand-primary)] outline-none rounded-2xl px-6 py-4 transition-all duration-300 placeholder:text-gray-400 font-sans"
                placeholder="Ex. Ayesha Mehra"
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <label htmlFor="email" className="text-xs font-sans uppercase tracking-widest text-gray-500 ml-2">Email Address *</label>
              <input 
                id="email"
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/60 border border-gray-200 focus:border-[var(--color-brand-primary)] outline-none rounded-2xl px-6 py-4 transition-all duration-300 placeholder:text-gray-400 font-sans"
                placeholder="ayesha@example.com"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-xs font-sans uppercase tracking-widest text-gray-500 ml-2">Phone Number (Optional)</label>
            <div className="w-full bg-white/60 border border-gray-200 focus-within:border-[var(--color-brand-primary)] outline-none rounded-2xl px-6 py-4 transition-all duration-300 font-sans">
              <PhoneInput
                international
                defaultCountry="IN"
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value?.toString() || "" })}
                className="custom-phone-input"
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label htmlFor="message" className="text-xs font-sans uppercase tracking-widest text-gray-500 ml-2">Your Message *</label>
            <textarea 
              id="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white/60 border border-gray-200 focus:border-[var(--color-brand-primary)] outline-none rounded-2xl px-6 py-4 transition-all duration-300 placeholder:text-gray-400 font-sans resize-none"
              placeholder="How can we collaborate on the future of energy law?"
            />
          </div>

          <button 
            type="submit"
            disabled={status === "submitting"}
            className="group mt-4 relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 bg-[var(--color-brand-primary)] text-white font-sans uppercase tracking-widest text-sm shadow-[0_4px_30px_rgba(34,139,34,0.3)] transition-all duration-300 hover:bg-[var(--color-brand-tertiary)] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-3 transition-transform duration-300 group-hover:-translate-y-0.5">
              {status === "submitting" ? "Authenticating & Sending..." : "Send Secure Message"}
              <Send className="w-4 h-4" />
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
