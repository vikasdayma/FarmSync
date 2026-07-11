'use client'

import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Sprout,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  type LucideIcon,
} from "lucide-react";


interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

interface FormFieldConfig {
  id: keyof Omit<ContactFormState, "message">;
  label: string;
  type: string;
  placeholder: string;
}



const fields: FormFieldConfig[] = [
  { id: "name", label: "Name", type: "text", placeholder: "Ramesh Patel" },
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
];


export default function Contact() {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div id="contact" className="bg-[#0c3d2d]  text-[#fbf9f2]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap');
        .ff-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .ff-body { font-family: 'Manrope', sans-serif; }
      `}</style>

     
      <section className="ff-body relative px-6 md:px-16 py-24 md:py-32 border-b border-[#25402e]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#C9E86B]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl"></div>
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left: intro */}
          <div>
            <span className="inline-block text-xs tracking-[0.2em] uppercase text-[#9fd98a] font-semibold mb-6">
              Get in touch
            </span>

            <h2 className="ff-display text-4xl md:text-5xl leading-[1.1] font-medium mb-6">
              Questions about your farm's next season?
            </h2>

            {/* signature: the growing line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "72px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-[3px] bg-[#d4f26a] mb-8 origin-left"
            />

            <p className="text-[#c9d6cc] text-base md:text-lg leading-relaxed max-w-md mb-10">
              Whether you're registering land, listing produce on the
              marketplace, or just curious how FarmSync works — write to us
              and we'll reply within a day.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:hello@farmsync.app"
                className="flex items-center gap-3 text-[#fbf9f2] hover:text-[#9fd98a] transition-colors w-fit"
              >
                <Mail size={18} className="text-[#7f9a85]" />
                <span>hello@farmsync.app</span>
              </a>
              <a
                href="tel:+910000000000"
                className="flex items-center gap-3 text-[#fbf9f2] hover:text-[#9fd98a] transition-colors w-fit"
              >
                <Phone size={18} className="text-[#7f9a85]" />
                <span>+91 00000 00000</span>
              </a>
              <div className="flex items-center gap-3 text-[#c9d6cc]">
                <MapPin size={18} className="text-[#7f9a85]" />
                <span>Madhya Pradesh, India</span>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full min-h-[380px] flex flex-col items-center justify-center text-center bg-[#14311f]/80 rounded-2xl border border-[#2c4a37] p-10"
              >
                <Sprout size={32} className="text-[#9fd98a] mb-4" />
                <h3 className="ff-display text-2xl mb-2">Message sent</h3>
                <p className="text-[#c9d6cc] max-w-xs">
                  Thanks for reaching out — someone from the team will follow
                  up soon.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#14311f]/80 rounded-2xl border border-[#2c4a37] p-8 md:p-10 space-y-6"
              >
                {fields.map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-xs tracking-wide uppercase text-[#7f9a85] mb-2"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      value={form[field.id]}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-[#345942] text-[#fbf9f2] placeholder:text-[#5c7566] py-2 outline-none focus:border-[#9fd98a] transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs tracking-wide uppercase text-[#7f9a85] mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us a bit about your farm or question..."
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-[#345942] text-[#fbf9f2] placeholder:text-[#5c7566] py-2 outline-none focus:border-[#9fd98a] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 bg-[#d4f26a] text-[#0e2818] font-semibold px-6 py-3 rounded-full hover:bg-[#e4fb8f] transition-colors"
                >
                  Send message
                  <ArrowUpRight
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>


 
    </div>
  );
}