// App.js
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Menu, X, Github, Linkedin, FileText, Code, Palette, Zap } from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // --- State for data loaded from JSON files ---
  const [portfolioData, setPortfolioData] = useState({
    name: "Načítám...",
    tagline: "",
    bio: "",
    contact: {
      email: "",
      phone: "",
      address: "",
      github: "",
      linkedin: ""
    },
    skills: [],
    projects: [],
    articles: [],
    about: {
      text: ""
    }
    // Removed 'hours' as it wasn't consistently used in the UI components provided
  });

  // --- Cyberpunk Theme Definition ---
  const cyberpunkTheme = {
    primary: '#00ffff',       // Cyan
    secondary: '#ff00ff',     // Magenta
    accent: '#ffff00',        // Yellow
    background: '#0a0a0a',    // Very Dark
    cardBg: '#1a1a1a',        // Darker Card
    text: '#e0e0e0',          // Light Text
    textSecondary: '#a0a0a0', // Secondary Text
    footerBg: '#000000',      // Pure Black Footer
    borderGlow: `0 0 5px ${'#00ffff'}, 0 0 10px ${'#00ffff'}40`, // Glowing border effect
    gridPattern: `linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)`,
    gridSize: '20px 20px'
  };

  const theme = cyberpunkTheme;

  // --- Load data from JSON files ---
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all required data files concurrently
        const [
          generalInfoRes,
          skillsRes,
          projectsRes,
          articlesRes,
          aboutRes
        ] = await Promise.all([
          fetch('/data/generalInfo.json'),
          fetch('/data/skills.json'),
          fetch('/data/projects.json'),
          fetch('/data/articles.json'),
          fetch('/data/about.json')
        ]);

        // Check if all responses are ok
        if (!generalInfoRes.ok || !skillsRes.ok || !projectsRes.ok || !articlesRes.ok || !aboutRes.ok) {
            throw new Error('Failed to load one or more data files.');
        }

        // Parse JSON data
        const generalInfoData = await generalInfoRes.json();
        const skillsData = await skillsRes.json();
        const projectsData = await projectsRes.json();
        const articlesData = await articlesRes.json();
        const aboutData = await aboutRes.json();

        // Combine data into the structure expected by the components
        const loadedData = {
          name: generalInfoData.name || "Vojtěch Tabačík",
          tagline: generalInfoData.tagline || "",
          bio: generalInfoData.bio || "", // Assuming bio is in generalInfo
          contact: {
            email: generalInfoData.contact?.email || "",
            phone: generalInfoData.contact?.phone || "",
            address: generalInfoData.contact?.address || "",
            github: generalInfoData.contact?.github || "",
            linkedin: generalInfoData.contact?.linkedin || ""
          },
          skills: skillsData,
          projects: projectsData,
          articles: articlesData,
          about: {
            text: aboutData.text || ""
            // image: aboutData.image || "" // If you add image support later
          }
          // hours: generalInfoData.hours || [] // If you use hours, uncomment and adjust
        };

        setPortfolioData(loadedData);
      } catch (error) {
        console.error("Error loading portfolio data:", error);
        // Optionally, set an error state to display a message to the user
      }
    };

    loadData();
  }, []); // Empty dependency array means this runs once on mount


  // --- Components ---

  const Navigation = () => (
    <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: theme.background, borderColor: theme.primary, boxShadow: theme.borderGlow }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div
                className="w-10 h-10 rounded flex items-center justify-center font-bold text-lg"
                style={{ backgroundColor: theme.secondary, color: theme.background, boxShadow: theme.borderGlow }}
              >
                VT
              </div>
              <span
                className="ml-3 text-xl font-bold"
                style={{ color: theme.primary, textShadow: `0 0 5px ${theme.primary}80` }}
              >
                {portfolioData.name} {/* Uses loaded data */}
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {['Domů', 'Dovednosti', 'Projekty', 'Blog', 'O mně', 'Kontakt'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  const sectionMap = {
                    'Domů': 'home',
                    'Dovednosti': 'skills',
                    'Projekty': 'projects',
                    'Blog': 'blog',
                    'O mně': 'about',
                    'Kontakt': 'contact'
                  };
                  setActiveSection(sectionMap[item]);
                }}
                className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                style={{
                  color: activeSection === {
                    'Domů': 'home',
                    'Dovednosti': 'skills',
                    'Projekty': 'projects',
                    'Blog': 'blog',
                    'O mně': 'about',
                    'Kontakt': 'contact'
                  }[item] ? theme.accent : theme.textSecondary,
                  textShadow: activeSection === {
                    'Domů': 'home',
                    'Dovednosti': 'skills',
                    'Projekty': 'projects',
                    'Blog': 'blog',
                    'O mně': 'about',
                    'Kontakt': 'contact'
                  }[item] ? `0 0 8px ${theme.accent}` : 'none'
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              style={{ color: theme.primary }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3" style={{ backgroundColor: theme.cardBg, borderTop: `1px solid ${theme.primary}` }}>
            {['Domů', 'Dovednosti', 'Projekty', 'Blog', 'O mně', 'Kontakt'].map((item) => {
              const sectionMap = {
                'Domů': 'home',
                'Dovednosti': 'skills',
                'Projekty': 'projects',
                'Blog': 'blog',
                'O mně': 'about',
                'Kontakt': 'contact'
              };
              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveSection(sectionMap[item]);
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
                  style={{
                    color: activeSection === sectionMap[item] ? theme.accent : theme.text,
                    backgroundColor: activeSection === sectionMap[item] ? `${theme.accent}20` : 'transparent'
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );

  const Hero = () => (
    <div
      className="relative py-20 overflow-hidden"
      style={{
        backgroundColor: theme.background,
        backgroundImage: theme.gridPattern,
        backgroundSize: theme.gridSize
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1
            className="text-4xl md:text-6xl font-extrabold mb-6"
            style={{ color: theme.primary, textShadow: `0 0 10px ${theme.primary}80` }}
          >
            {portfolioData.name} {/* Uses loaded data */}
          </h1>
          <p
            className="text-xl mb-10 max-w-3xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            {portfolioData.tagline} {/* Uses loaded data */}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveSection('projects')}
              className="px-8 py-3 rounded font-bold transition-all duration-300 border"
              style={{
                backgroundColor: 'transparent',
                borderColor: theme.primary,
                color: theme.primary,
                boxShadow: `0 0 8px ${theme.primary}40`,
                textShadow: `0 0 5px ${theme.primary}80`
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = `${theme.primary}20`;
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Prohlédnout projekty
            </button>
            <button
              onClick={() => setActiveSection('contact')}
              className="px-8 py-3 rounded font-bold transition-all duration-300 border"
              style={{
                backgroundColor: 'transparent',
                borderColor: theme.secondary,
                color: theme.secondary,
                boxShadow: `0 0 8px ${theme.secondary}40`,
                textShadow: `0 0 5px ${theme.secondary}80`
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = `${theme.secondary}20`;
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Kontaktovat
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Skills = () => (
    <div
      className="py-16"
      style={{
        backgroundColor: theme.background,
        backgroundImage: theme.gridPattern,
        backgroundSize: theme.gridSize
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: theme.primary, textShadow: `0 0 5px ${theme.primary}80` }}
          >
            Technické Dovednosti
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Soubor technologií a nástrojů, které používám k vytváření moderních webových aplikací.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Uses loaded data */}
          {portfolioData.skills && portfolioData.skills.map((skill, index) => (
            <div
              key={index}
              className="p-6 rounded-lg"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.primary}`,
                boxShadow: theme.borderGlow
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium" style={{ color: theme.text }}>{skill.name}</span>
                <span style={{ color: theme.accent }}>{skill.level}%</span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: `${theme.textSecondary}40` }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${skill.level}%`,
                    backgroundColor: theme.primary,
                    boxShadow: `0 0 5px ${theme.primary}`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Projects = () => (
    <div
      className="py-16"
      style={{
        backgroundColor: theme.background,
        backgroundImage: theme.gridPattern,
        backgroundSize: theme.gridSize
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: theme.primary, textShadow: `0 0 5px ${theme.primary}80` }}
          >
            Vybrané Projekty
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Ukázka mé práce a schopností v oblasti frontend vývoje a UI/UX designu.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Uses loaded data */}
          {portfolioData.projects && portfolioData.projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.primary}`,
                boxShadow: theme.borderGlow
              }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image || "https://placehold.co/600x400/1a1a1a/e0e0e0?text=Project+Image"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: theme.text }}
                >
                  {project.title}
                </h3>
                <p
                  className="mb-4 text-sm"
                  style={{ color: theme.textSecondary }}
                >
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies && project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: `${theme.secondary}20`,
                        color: theme.secondary,
                        border: `1px solid ${theme.secondary}`
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-medium transition-colors"
                    style={{ color: theme.accent }}
                    onMouseOver={(e) => { e.target.style.textDecoration = 'underline'; }}
                    onMouseOut={(e) => { e.target.style.textDecoration = 'none'; }}
                  >
                    Zobrazit projekt
                    <svg className="ml-1" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" />
                      <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Blog = () => {
    if (selectedArticle) {
      return (
        <div
          className="py-16"
          style={{
            backgroundColor: theme.background,
            backgroundImage: theme.gridPattern,
            backgroundSize: theme.gridSize
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSelectedArticle(null)}
              className="mb-6 flex items-center font-medium transition-colors"
              style={{ color: theme.accent }}
              onMouseOver={(e) => { e.target.style.textDecoration = 'underline'; }}
              onMouseOut={(e) => { e.target.style.textDecoration = 'none'; }}
            >
              ← Zpět na Blog
            </button>
            <article
              className="rounded-lg p-8"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.primary}`,
                boxShadow: theme.borderGlow
              }}
            >
              <h1
                className="text-3xl font-bold mb-4"
                style={{ color: theme.text }}
              >
                {selectedArticle.title}
              </h1>
              <div className="flex items-center text-sm mb-6" style={{ color: theme.textSecondary }}>
                <span>{selectedArticle.date}</span>
                <span className="mx-2">•</span>
                <span>{selectedArticle.readTime}</span>
              </div>
              {/* Render HTML content, including images */}
              <div
                className="prose prose-invert max-w-none"
                style={{ color: theme.text }}
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </article>
          </div>
        </div>
      );
    }

    return (
      <div
        className="py-16"
        style={{
          backgroundColor: theme.background,
          backgroundImage: theme.gridPattern,
          backgroundSize: theme.gridSize
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: theme.primary, textShadow: `0 0 5px ${theme.primary}80` }}
            >
              Blog
            </h2>
            <p
              className="text-lg"
              style={{ color: theme.textSecondary }}
            >
              Články o frontend vývoji, designu a technologiích.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Uses loaded data */}
            {portfolioData.articles && portfolioData.articles.map((article) => (
              <div
                key={article.id}
                className="rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.primary}`,
                  boxShadow: theme.borderGlow
                }}
                onClick={() => setSelectedArticle(article)}
              >
                 <div
                  className="h-40 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${theme.secondary}20, ${theme.accent}20)`
                  }}
                >
                  <FileText size={40} style={{ color: theme.textSecondary }} />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm mb-3" style={{ color: theme.textSecondary }}>
                    <span>{article.date}</span>
                    <span className="mx-2">•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: theme.text }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="mb-4 text-sm"
                    style={{ color: theme.textSecondary }}
                  >
                    {article.excerpt}
                  </p>
                  <button
                    className="font-medium transition-colors"
                    style={{ color: theme.accent }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArticle(article);
                    }}
                    onMouseOver={(e) => { e.target.style.textDecoration = 'underline'; }}
                    onMouseOut={(e) => { e.target.style.textDecoration = 'none'; }}
                  >
                    Číst více →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const About = () => (
    <div
      className="py-16"
      style={{
        backgroundColor: theme.background,
        backgroundImage: theme.gridPattern,
        backgroundSize: theme.gridSize
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: theme.primary, textShadow: `0 0 5px ${theme.primary}80` }}
          >
            O mně
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: theme.textSecondary }}
          >
            Trochu více informací o mé cestě a zkušenostech.
          </p>
        </div>
        <div
          className="rounded-lg p-8"
          style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.primary}`,
            boxShadow: theme.borderGlow
          }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <img
                  src={portfolioData.about.image || "https://placehold.co/300x400/1a1a1a/e0e0e0?text=Profile+Pic"}
                  alt="Vojtěch Tabačík"
                  className="rounded-lg shadow-md w-full max-w-xs"
                />
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    boxShadow: `0 0 0 2px ${theme.primary}40`
                  }}
                ></div>
              </div>
            </div> */}
            <div className="md:w-2/3">
              <div className="prose prose-invert max-w-none">
                {/* Uses loaded data */}
                <p style={{ color: theme.textSecondary }}>
                  {portfolioData.about.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Contact = () => (
    <div
      className="py-16"
      style={{
        backgroundColor: theme.background,
        backgroundImage: theme.gridPattern,
        backgroundSize: theme.gridSize
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: theme.primary, textShadow: `0 0 5px ${theme.primary}80` }}
          >
            Kontakt
          </h2>
          <p
            className="text-lg"
            style={{ color: theme.textSecondary }}
          >
            Rád spolupracuji na zajímavých projektech. Napište mi!
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <div
              className="rounded-lg p-8"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.primary}`,
                boxShadow: theme.borderGlow
              }}
            >
              <h3
                className="text-2xl font-bold mb-6"
                style={{ color: theme.text }}
              >
                Spojme se
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail
                    className="mr-4 mt-1 flex-shrink-0"
                    size={24}
                    style={{ color: theme.accent }}
                  />
                  <div>
                    <h4
                      className="font-medium"
                      style={{ color: theme.text }}
                    >
                      Email
                    </h4>
                    {/* Uses loaded data */}
                    <a
                      href={`mailto:${portfolioData.contact.email}`}
                      className="transition-colors hover:underline"
                      style={{ color: theme.textSecondary }}
                    >
                      {portfolioData.contact.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone
                    className="mr-4 flex-shrink-0"
                    size={24}
                    style={{ color: theme.accent }}
                  />
                  <div>
                    <h4
                      className="font-medium"
                      style={{ color: theme.text }}
                    >
                      Telefon
                    </h4>
                    {/* Uses loaded data */}
                    <a
                      href={`tel:${portfolioData.contact.phone}`}
                      className="transition-colors hover:underline"
                      style={{ color: theme.textSecondary }}
                    >
                      {portfolioData.contact.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin
                    className="mr-4 flex-shrink-0"
                    size={24}
                    style={{ color: theme.accent }}
                  />
                  <div>
                    <h4
                      className="font-medium"
                      style={{ color: theme.text }}
                    >
                      Lokace
                    </h4>
                    {/* Uses loaded data */}
                    <p style={{ color: theme.textSecondary }}>
                      {portfolioData.contact.address}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  {/* Uses loaded data */}
                  <a
                    href={portfolioData.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all duration-300"
                    style={{ backgroundColor: `${theme.textSecondary}20`, color: theme.text }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = `${theme.primary}20`; e.target.style.color = theme.primary; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = `${theme.textSecondary}20`; e.target.style.color = theme.text; }}
                  >
                    <Github size={20} />
                  </a>
                  <a
                    href={portfolioData.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full transition-all duration-300"
                    style={{ backgroundColor: `${theme.textSecondary}20`, color: theme.text }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = `${theme.primary}20`; e.target.style.color = theme.primary; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = `${theme.textSecondary}20`; e.target.style.color = theme.text; }}
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            className="rounded-lg p-8 flex items-center justify-center"
            style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.primary}`,
              boxShadow: theme.borderGlow
            }}
          >
            <div className="text-center">
              <Code size={60} style={{ color: theme.primary, margin: '0 auto 20px' }} />
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: theme.text }}
              >
                Pojďme spolu něco vytvořit
              </h3>
              <p
                className="mb-6"
                style={{ color: theme.textSecondary }}
              >
                Máte nápad na webový projekt? Rád se s vámi o něj podělím a pomohu ho uskutečnit.
              </p>
              {/* Uses loaded data */}
              <a
                href={`mailto:${portfolioData.contact.email}`}
                className="inline-block px-6 py-3 rounded font-bold transition-all duration-300 border"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: theme.accent,
                  color: theme.accent,
                  boxShadow: `0 0 8px ${theme.accent}40`,
                  textShadow: `0 0 5px ${theme.accent}80`
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = `${theme.accent}20`;
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Napsat email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <Hero />
            <About />
            <Skills />
            <Projects />
          </>
        );
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects />;
      case 'blog':
        return <Blog />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <>
            <Hero />
            <About /> {/* Added About to default as requested */}
            <Skills />
            <Projects />
          </>
        );
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.background,
        backgroundImage: theme.gridPattern,
        backgroundSize: theme.gridSize,
        color: theme.text
      }}
    >
      <Navigation />
      <main>
        {renderContent()}
      </main>
      <footer
        className="py-12 border-t"
        style={{ backgroundColor: theme.footerBg, borderColor: theme.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center font-bold text-lg"
                  style={{ backgroundColor: theme.secondary, color: theme.background }}
                >
                  VT
                </div>
                <span
                  className="ml-3 text-xl font-bold"
                  style={{ color: theme.primary }}
                >
                  {portfolioData.name} {/* Uses loaded data */}
                </span>
              </div>
              <p
                className="mb-4"
                style={{ color: theme.textSecondary }}
              >
                {portfolioData.tagline} {/* Uses loaded data */}
              </p>
            </div>
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.primary }}
              >
                Rychlé odkazy
              </h3>
              <ul className="space-y-2">
                {['Domů', 'Dovednosti', 'Projekty', 'Blog', 'O mně', 'Kontakt'].map((item) => {
                  const sectionMap = {
                    'Domů': 'home',
                    'Dovednosti': 'skills',
                    'Projekty': 'projects',
                    'Blog': 'blog',
                    'O mně': 'about',
                    'Kontakt': 'contact'
                  };
                  return (
                    <li key={item}>
                      <button
                        onClick={() => setActiveSection(sectionMap[item])}
                        className="transition-colors hover:underline"
                        style={{ color: theme.textSecondary }}
                      >
                        {item}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: theme.primary }}
              >
                Kontakt
              </h3>
              <div className="space-y-2" style={{ color: theme.textSecondary }}>
                {/* Uses loaded data */}
                <p>{portfolioData.contact.email}</p>
                <p>{portfolioData.contact.phone}</p>
                <p>{portfolioData.contact.address}</p>
              </div>
            </div>
          </div>
          <div
            className="border-t mt-8 pt-8 text-center text-sm"
            style={{ borderColor: `${theme.textSecondary}40`, color: theme.textSecondary }}
          >
            <p>&copy; {new Date().getFullYear()} {portfolioData.name}. Všechna práva vyhrazena.</p> {/* Uses loaded data */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;