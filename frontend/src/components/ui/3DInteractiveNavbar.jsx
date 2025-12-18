import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Card3D from "./Card3D";
import {
  Home,
  UserPlus,
  CreditCard,
  Building,
  FileText,
  Users,
  BarChart,
  Settings,
  Menu,
  X
} from "lucide-react";

// ERP System navigation items
const navItems = [
  { title: "DASHBOARD", href: "/", icon: Home },
  { title: "ADMISSIONS", href: "/admissions", icon: UserPlus },
  { title: "FEES", href: "/fees", icon: CreditCard },
  { title: "HOSTEL", href: "/hostel", icon: Building },
  { title: "REPORTS", href: "/reports", icon: FileText },
];

// ERP feature components for mega dropdown
const erpFeatures = [
  {
    id: "ERP_001",
    title: "Student Management",
    description: "Comprehensive student information system",
    previewImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop",
    category: "Core Features",
    icon: Users
  },
  {
    id: "ERP_002",
    title: "Fee Collection",
    description: "Automated fee tracking and receipt generation",
    previewImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop",
    category: "Finance",
    icon: CreditCard
  },
  {
    id: "ERP_003",
    title: "Hostel Management",
    description: "Room allocation and occupancy tracking",
    previewImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
    category: "Facilities",
    icon: Building
  },
  {
    id: "ERP_004",
    title: "Reports & Analytics",
    description: "Real-time insights and data visualization",
    previewImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    category: "Analytics",
    icon: BarChart
  },
  {
    id: "ERP_005",
    title: "Admissions Portal",
    description: "Streamlined student enrollment process",
    previewImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    category: "Core Features",
    icon: UserPlus
  },
  {
    id: "ERP_006",
    title: "Settings & Configuration",
    description: "System customization and preferences",
    previewImage: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop",
    category: "System",
    icon: Settings
  },
];

/**
 * Menu Icon Component - Animated hamburger/close icon
 */
function MenuIcon({ isOpen = false }) {
  if (isOpen) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }

  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M1 6H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M1 11H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/**
 * ERP Logo Component
 */
function ERPLogo() {
  return (
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
      <span className="text-white font-bold text-xl">E</span>
    </div>
  );
}

/**
 * Decrypt Effect Component - Text animation effect
 */
function DecryptEffect({ text, startDecrypting = false }) {
  const [decodedText, setDecodedText] = useState(startDecrypting ? "" : text);

  useEffect(() => {
    let iteration = 0;
    let shouldAnimate = true;
    const frameRate = 24;
    const speed = startDecrypting ? 0.3 : 0.5;

    const interval = setInterval(() => {
      if (!shouldAnimate) return;

      setDecodedText(() => {
        const result = text.split("").map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }

          return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
            Math.floor(Math.random() * 62)
          ];
        }).join("");

        iteration += speed;

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        return result;
      });
    }, 1000 / frameRate);

    return () => {
      shouldAnimate = false;
      clearInterval(interval);
    };
  }, [text, startDecrypting]);

  return (
    <span className="inline-block font-medium">
      {decodedText}
    </span>
  );
}

/**
 * Stable Decrypt Effect - Continuous animation
 */
function StableDecryptEffect({ text }) {
  const [decodedText, setDecodedText] = useState(text);

  useEffect(() => {
    let iteration = 0;
    let shouldAnimate = true;
    const frameRate = 24;
    const speed = 0.5;

    const interval = setInterval(() => {
      if (!shouldAnimate) return;

      setDecodedText(() => {
        const result = text.split("").map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }

          return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
            Math.floor(Math.random() * 62)
          ];
        }).join("");

        iteration += speed;

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        return result;
      });
    }, 1000 / frameRate);

    return () => {
      shouldAnimate = false;
      clearInterval(interval);
    };
  }, [text]);

  return <span style={{ fontFamily: 'inherit' }}>{decodedText}</span>;
}

/**
 * Navbar Item Component
 */
function NavbarItem({ item }) {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === item.href;

  return (
    <Link
      to={item.href}
      className={`relative py-2 text-xs font-medium tracking-wider transition-colors ${
        isActive ? 'text-blue-400' : 'text-white/70 hover:text-white/100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="inline-block relative" style={{ width: `${item.title.length}ch` }}>
        {isHovered ? (
          <DecryptEffect text={item.title} />
        ) : (
          <span className="font-medium">{item.title}</span>
        )}
      </span>
    </Link>
  );
}

/**
 * Features Link Component with Mega Dropdown
 */
function FeaturesLink({ onDropdownChange }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const megaDropdownRef = useRef(null);
  const text = "FEATURES";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (megaDropdownRef.current) {
          megaDropdownRef.current.startClosingAnimation();
        } else {
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (onDropdownChange) {
      onDropdownChange(isDropdownOpen);
    }
  }, [isDropdownOpen, onDropdownChange]);

  const showDottedGrid = isHovered && !isDropdownOpen;

  return (
    <div
      className="relative h-full z-50 border-neutral-800"
      ref={dropdownRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style jsx>{`
        .features-button {
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 2.5rem;
          padding-right: 2.5rem;
          min-width: 180px;
          max-width: 180px;
          transition: color 0.3s ease;
        }

        .features-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #444 1px, transparent 1px);
          background-size: 8px 8px;
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
          z-index: 0;
          pointer-events: none;
        }

        .features-button.dotted-grid-active::before {
          opacity: 1;
        }

        .features-button-content {
          position: relative;
          z-index: 2;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .features-button-content span {
          color: white;
          transition: color 0.3s ease;
        }

        .features-button.dropdown-open .features-button-content span {
          color: black;
        }
      `}</style>
      <motion.button
        className={`features-button ${showDottedGrid ? 'dotted-grid-active' : ''} ${isDropdownOpen ? 'dropdown-open' : ''}`}
        onClick={() => {
          if (isDropdownOpen && megaDropdownRef.current) {
            megaDropdownRef.current.startClosingAnimation();
          } else {
            setIsDropdownOpen(true);
          }
        }}
      >
        {isDropdownOpen && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ zIndex: 1 }}
          />
        )}

        <div className="features-button-content">
          <div className="text-xs font-medium tracking-wider">
            {showDottedGrid ? (
              <StableDecryptEffect text={text} />
            ) : (
              <span>{text}</span>
            )}
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="fixed top-20 left-0 w-full bg-black border-b border-neutral-800 z-50 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "calc(100vh - 5rem)", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              opacity: { duration: 0.5 }
            }}
          >
            <MegaDropdown
              ref={megaDropdownRef}
              onClose={() => setIsDropdownOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Mega Dropdown Component - Full-screen feature showcase
 */
const MegaDropdown = React.forwardRef(({ onClose }, ref) => {
  const [visibleRows, setVisibleRows] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [lockedItem, setLockedItem] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const preloadImage = (src) => {
    if (loadedImages.has(src)) return;

    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setLoadedImages(prev => new Set(prev).add(src));
    };
  };

  useEffect(() => {
    if (hoveredItem) {
      const item = erpFeatures.find(item => item.id === hoveredItem);
      if (item) {
        preloadImage(item.previewImage);
      }
    }
  }, [hoveredItem]);

  useEffect(() => {
    const imagesToPreload = erpFeatures.slice(0, 4);
    imagesToPreload.forEach(item => {
      preloadImage(item.previewImage);
    });
  }, []);

  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref({ startClosingAnimation });
      } else {
        ref.current = { startClosingAnimation };
      }
    }
  }, [ref]);

  useEffect(() => {
    const rowsCount = Math.ceil(erpFeatures.length / 2);
    let currentRow = 0;

    const timer = setInterval(() => {
      if (currentRow < rowsCount) {
        setVisibleRows(prev => prev + 1);
        currentRow++;
      } else {
        clearInterval(timer);
      }
    }, 200);

    return () => clearInterval(timer);
  }, []);

  const startClosingAnimation = () => {
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (lockedItem) {
          setLockedItem(null);
        } else {
          startClosingAnimation();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [lockedItem]);

  const handleFeatureClick = (id) => {
    if (lockedItem === id) {
      setLockedItem(null);
    } else {
      setLockedItem(id);
      const item = erpFeatures.find(item => item.id === id);
      if (item) {
        preloadImage(item.previewImage);
      }
    }
  };

  const displayedFeature = lockedItem
    ? erpFeatures.find(item => item.id === lockedItem)
    : (hoveredItem ? erpFeatures.find(item => item.id === hoveredItem) : null);

  const rows = [];
  for (let i = 0; i < erpFeatures.length; i += 2) {
    const rowItems = erpFeatures.slice(i, i + 2);
    rows.push(rowItems);
  }

  return (
    <div className="h-full overflow-auto">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-[minmax(300px,1fr)_2fr] h-full"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.01,
              delayChildren: 0.05,
              ease: "easeOut"
            }
          }
        }}
      >
        <motion.div
          className="p-10 flex flex-col h-full"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: "easeOut" }
            }
          }}
        >
          <div className="text-xs text-neutral-500 mb-4">
            _ERP_FEATURES
          </div>
          <h2 className="text-[2.5rem] font-extralight leading-[1.1] mb-auto">
            Comprehensive tools for modern education management
          </h2>
          <div className="mt-auto mb-4 w-full">
            <Card3D
              content={
                <div className="flex p-10 flex-col h-full text-center">
                  {displayedFeature ? (
                    <>
                      <div className="text-xs text-neutral-500 mb-2">
                        {displayedFeature.id}
                      </div>
                      <div className="text-xl font-light mb-4">
                        {displayedFeature.title}
                      </div>
                      <div className="flex-1 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
                        <div className="relative w-full h-[100px]" style={{
                          backgroundImage: `url(${displayedFeature.previewImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-400 mb-4">
                        {displayedFeature.description}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-500">
                      <span>Hover over a feature to preview</span>
                    </div>
                  )}
                </div>
              }
              maxRotation={0.03}
              className="mx-auto w-full max-w-[400px] h-[300px]"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 h-full" style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}>
          {rows.slice(0, visibleRows).map((rowItems, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-1 sm:grid-cols-2 w-full">
              {rowItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    className={`relative border-t border-l border-neutral-800 text-center ${
                      rowIndex === rows.length - 1 ? 'border-b' : ''
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <motion.div
                      className="absolute top-0 left-0 w-0 h-[1px] bg-neutral-700"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    <motion.div
                      className="absolute top-0 left-0 w-[1px] h-0 bg-neutral-700"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    <div
                      className={`flex flex-col justify-center items-center h-full px-6 py-8 relative overflow-hidden cursor-pointer ${
                        lockedItem === item.id ? 'ring-1 ring-inset ring-white/20' : ''
                      }`}
                      onMouseEnter={() => {
                        if (!lockedItem) {
                          setHoveredItem(item.id);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!lockedItem) {
                          setHoveredItem(null);
                        }
                      }}
                      onClick={() => handleFeatureClick(item.id)}
                    >
                      <motion.div
                        className="absolute inset-0 bg-neutral-500/20"
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{
                          scaleX: (hoveredItem === item.id && !lockedItem) || lockedItem === item.id ? 1 : 0
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />

                      <div className="mb-4 relative z-10">
                        <IconComponent size={32} className="text-blue-400" />
                      </div>

                      <div className="text-xs text-neutral-500 mb-2 font-mono relative z-10 h-4 flex items-center justify-center">
                        <div className="w-full text-center" style={{ minWidth: `${(`/ ${item.id}`).length}ch` }}>
                          {(hoveredItem === item.id && !lockedItem) || lockedItem === item.id ? (
                            <DecryptEffect text={`/ ${item.id}`} startDecrypting={true} />
                          ) : (
                            `/ ${item.id}`
                          )}
                        </div>
                      </div>
                      <div className="text-white text-[17px] font-extralight relative z-10">
                        {item.title}
                      </div>
                      <div className="text-xs text-neutral-400 mt-2 relative z-10">
                        {item.category}
                      </div>
                      {lockedItem === item.id && (
                        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-white animate-pulse" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});

/**
 * Main 3D Interactive Navbar Component
 */
export function ThreeDInteractiveNavbar() {
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-black text-white border border-neutral-800">
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[auto_auto_1fr_auto] items-center h-20">
        {/* Logo Section */}
        <div className="px-4 md:px-10 h-full flex items-center border-r border-neutral-800">
          <Link to="/" className="flex items-center gap-3">
            <ERPLogo />
            <div>
              <span className="font-bold text-lg tracking-wide">ERP SYSTEM</span>
              <p className="text-xs text-neutral-500">Education Management</p>
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="px-4 h-full flex md:hidden items-center justify-end">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <MenuIcon isOpen={isMobileMenuOpen} />
          </button>
        </div>

        {/* Features Link - Desktop */}
        <div className="border-r border-neutral-800 h-full hidden md:block">
          <FeaturesLink onDropdownChange={setIsNavDropdownOpen} />
        </div>

        {/* Navigation Items - Desktop */}
        <div className="hidden md:flex items-center h-full pl-10">
          <div className="grid grid-flow-col auto-cols-auto gap-x-10">
            {navItems.map((item) => (
              <NavbarItem key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed top-20 left-0 right-0 z-50 bg-black border-t border-neutral-800 overflow-hidden max-h-[calc(100vh-5rem)]"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="py-4 px-6 flex flex-col space-y-6 overflow-y-auto max-h-[calc(100vh-5rem)]">
              {/* Features dropdown toggle */}
              <div className="py-2 border-b border-neutral-800">
                <button
                  onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                  className="flex items-center justify-between w-full py-3"
                >
                  <span className="text-sm tracking-wide">FEATURES</span>
                </button>

                <AnimatePresence>
                  {isNavDropdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 px-2">
                        {erpFeatures.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 text-white/70 hover:text-white text-sm py-2"
                            >
                              <IconComponent size={18} className="text-blue-400" />
                              <span>{item.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Main navigation items */}
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="flex items-center gap-3 text-sm font-medium tracking-wider text-white/70 hover:text-white py-2"
                  >
                    <IconComponent size={18} />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default ThreeDInteractiveNavbar;
