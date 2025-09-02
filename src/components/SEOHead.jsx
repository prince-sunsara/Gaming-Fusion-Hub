// SEO Head component for dynamic meta tags and structured data
import React from "react";
import { useLocation } from "react-router-dom";

const SEOHead = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // SEO data for different pages
  const seoData = {
    "/": {
      title: "Gaming Fusion Hub - Play Amazing Browser Games Online",
      description:
        "Discover and play the best collection of browser games at Gaming Fusion Hub. Action, racing, puzzle, and arcade games all in one place.",
      keywords:
        "browser games, online games, free games, gaming hub, web games, gaming platform",
      ogType: "website",
    },
    "/games": {
      title: "Game Library - Gaming Fusion Hub",
      description:
        "Browse our extensive collection of browser games. Filter by genre and find your next favorite game to play.",
      keywords:
        "game library, browser games collection, online gaming, game genres",
      ogType: "website",
    },
    "/blogs": {
      title: "Gaming Blogs - News & Reviews | Gaming Fusion Hub",
      description:
        "Stay updated with the latest gaming news, reviews, and tips from our gaming community.",
      keywords:
        "gaming blogs, game reviews, gaming news, gaming tips, game guides",
      ogType: "blog",
    },
    "/about": {
      title: "About Us - Gaming Fusion Hub",
      description:
        "Learn more about Gaming Fusion Hub, our mission to provide the best browser gaming experience.",
      keywords: "about gaming fusion hub, gaming platform, browser games",
      ogType: "website",
    },
    "/contact": {
      title: "Contact Us - Gaming Fusion Hub",
      description:
        "Get in touch with the Gaming Fusion Hub team. We love hearing from our gaming community.",
      keywords: "contact gaming fusion hub, gaming support, feedback",
      ogType: "website",
    },
  };

  // Get current page SEO data or default
  const currentSEO = seoData[currentPath] || seoData["/"];
  const baseUrl = "https://gamingfusionhub.com"; // Replace with actual domain
  const currentUrl = `${baseUrl}${currentPath}`;

  // Structured data for search engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Gaming Fusion Hub",
    description: "The ultimate destination for browser games",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/games?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Gaming Fusion Hub",
      url: baseUrl,
    },
  };

  React.useEffect(() => {
    // Update document title
    document.title = currentSEO.title;

    // Update meta tags
    const updateMetaTag = (name, content, attribute = "name") => {
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", currentSEO.description);
    updateMetaTag("keywords", currentSEO.keywords);
    updateMetaTag("author", "Gaming Fusion Hub");
    updateMetaTag("robots", "index, follow");
    updateMetaTag("language", "English");
    updateMetaTag("revisit-after", "7 days");

    // Open Graph tags
    updateMetaTag("og:title", currentSEO.title, "property");
    updateMetaTag("og:description", currentSEO.description, "property");
    updateMetaTag("og:url", currentUrl, "property");
    updateMetaTag("og:type", currentSEO.ogType, "property");
    updateMetaTag("og:site_name", "Gaming Fusion Hub", "property");
    updateMetaTag("og:image", `${baseUrl}/images/og-image.jpg`, "property");
    updateMetaTag("og:locale", "en_US", "property");

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", currentSEO.title, "name");
    updateMetaTag("twitter:description", currentSEO.description, "name");
    updateMetaTag(
      "twitter:image",
      `${baseUrl}/images/twitter-card.jpg`,
      "name"
    );
    updateMetaTag("twitter:site", "@GamingFusionHub", "name");

    // Additional SEO tags
    updateMetaTag("theme-color", "#0ea5e9", "name");
    updateMetaTag("msapplication-TileColor", "#0ea5e9", "name");
    updateMetaTag("viewport", "width=device-width, initial-scale=1.0", "name");

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);

    // Structured data
    let structuredDataScript = document.querySelector("#structured-data");
    if (!structuredDataScript) {
      structuredDataScript = document.createElement("script");
      structuredDataScript.id = "structured-data";
      structuredDataScript.type = "application/ld+json";
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

    // Preconnect to important domains
    const preconnectDomains = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://cdnjs.cloudflare.com",
    ];

    preconnectDomains.forEach((domain) => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = domain;
        if (domain.includes("fonts.gstatic.com")) {
          link.crossOrigin = "anonymous";
        }
        document.head.appendChild(link);
      }
    });
  }, [currentPath, currentSEO, currentUrl, baseUrl]);

  // This component doesn't render anything visible
  return null;
};

export default SEOHead;
