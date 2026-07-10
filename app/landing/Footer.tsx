import { Github, Instagram, Linkedin, LucideIcon, Sprout, Twitter } from "lucide-react";
import React from 'react'
interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}
const Footer = () => {
  const footerLinks: Record<string, string[]> = {
    Product: ["Marketplace", "Farm registration", "Dashboard", "Pricing"],
    Company: ["About", "Careers", "Blog"],
    Support: ["Help centre", "Contact", "Status"],
  };
  
  const socials: SocialLink[] = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ];
  
  return (
   <footer
        className="ff-body bg-[#0c3d2d] relative px-6 md:px-16 pt-16 pb-8 overflow-hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent, transparent 38px, rgba(159,217,138,0.05) 38px, rgba(159,217,138,0.05) 39px)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-12 pb-14">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout size={22} className="text-[#9fd98a]" />
                <span className="ff-display text-xl">FarmSync</span>
              </div>
              <p className="text-[#8fa696] text-sm leading-relaxed max-w-[240px]">
                A digital home for Indian farms — registration, marketplace,
                and everything in between.
              </p>
            </div>

            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-xs tracking-[0.15em] uppercase text-[#7f9a85] mb-4">
                  {heading}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-[#c9d6cc] hover:text-[#9fd98a] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="h-px bg-[#25402e]" />

          <div className="pt-6 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6b8377]">
              © {new Date().getFullYear()} FarmSync. Built in Madhya Pradesh.
            </p>

            <div className="flex items-center gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-[#7f9a85] hover:text-[#9fd98a] transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
  )
}

   export  default Footer