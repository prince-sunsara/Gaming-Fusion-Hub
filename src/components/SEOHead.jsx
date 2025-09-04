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
    "/privacy-policy": {
      title: "Privacy Policy - Gaming Fusion Hub",
      description:
        "Learn how Gaming Fusion Hub protects your privacy and handles your personal data. Transparent privacy practices for our gaming community.",
      keywords:
        "privacy policy, data protection, user privacy, gaming platform privacy, GDPR compliance",
      ogType: "website",
    },
    "/terms-of-service": {
      title: "Terms of Service - Gaming Fusion Hub",
      description:
        "Read our Terms of Service to understand the rules and guidelines for using Gaming Fusion Hub's gaming platform and services.",
      keywords:
        "terms of service, user agreement, gaming platform terms, service conditions, legal terms",
      ogType: "website",
    },
    "/cookie-policy": {
      title: "Cookie Policy - Gaming Fusion Hub",
      description:
        "Understand how Gaming Fusion Hub uses cookies to enhance your gaming experience. Manage your cookie preferences and learn about our tracking practices.",
      keywords:
        "cookie policy, cookies, tracking, user preferences, web analytics, gaming platform cookies",
      ogType: "website",
    },
    // Dynamic game pages
    "/game": {
      title: "Play Games Online - Gaming Fusion Hub",
      description:
        "Play exciting browser games including Block Breaker, Neon Racing, Space Defender and more. Free online gaming experience.",
      keywords:
        "play games online, browser games, free games, block breaker, space defender, gaming",
      ogType: "game",
    },
  };

  // Get current page SEO data or default
  const getCurrentSEO = () => {
    // Check for exact match first
    if (seoData[currentPath]) {
      return seoData[currentPath];
    }

    // Check for game pages (starts with /game/)
    if (currentPath.startsWith("/game/")) {
      return {
        ...seoData["/game"],
        title: `Play Game - Gaming Fusion Hub`,
        description: `Play this exciting browser game at Gaming Fusion Hub. Free online gaming experience with high scores and achievements.`,
      };
    }

    // Return homepage SEO as default
    return seoData["/"];
  };

  const currentSEO = getCurrentSEO();
  const baseUrl = "https://gamingfusionhub.com"; // Replace with actual domain
  const currentUrl = `${baseUrl}${currentPath}`;

  // Enhanced structured data based on page type
  const getStructuredData = () => {
    const baseStructuredData = {
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
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/images/logo.png`,
        },
      },
    };

    // Add specific structured data for different page types
    if (currentPath === "/games") {
      return {
        ...baseStructuredData,
        "@type": "CollectionPage",
        mainEntity: {
          "@type": "ItemList",
          name: "Browser Games Collection",
          description: "Collection of free browser games",
        },
      };
    }

    if (currentPath === "/blogs") {
      return {
        ...baseStructuredData,
        "@type": "Blog",
        blogPost: {
          "@type": "BlogPosting",
          headline: "Gaming News and Reviews",
        },
      };
    }

    if (currentPath.startsWith("/game/")) {
      return {
        ...baseStructuredData,
        "@type": "GameApplication",
        operatingSystem: "Any",
        applicationCategory: "BrowserApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      };
    }

    // Legal pages structured data
    if (
      ["/privacy-policy", "/terms-of-service", "/cookie-policy"].includes(
        currentPath
      )
    ) {
      return {
        ...baseStructuredData,
        "@type": "WebPage",
        mainEntity: {
          "@type": "Article",
          headline: currentSEO.title,
          description: currentSEO.description,
        },
      };
    }

    return baseStructuredData;
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

    // Gaming specific meta tags
    updateMetaTag("application-name", "Gaming Fusion Hub");
    updateMetaTag("msapplication-tooltip", "Play amazing browser games");
    updateMetaTag("apple-mobile-web-app-title", "Gaming Fusion Hub");
    updateMetaTag("apple-mobile-web-app-capable", "yes");
    updateMetaTag("mobile-web-app-capable", "yes");

    // Open Graph tags
    updateMetaTag("og:title", currentSEO.title, "property");
    updateMetaTag("og:description", currentSEO.description, "property");
    updateMetaTag("og:url", currentUrl, "property");
    updateMetaTag("og:type", currentSEO.ogType, "property");
    updateMetaTag("og:site_name", "Gaming Fusion Hub", "property");
    updateMetaTag("og:image", `${baseUrl}/images/og-image.jpg`, "property");
    updateMetaTag("og:image:width", "1200", "property");
    updateMetaTag("og:image:height", "630", "property");
    updateMetaTag(
      "og:image:alt",
      "Gaming Fusion Hub - Browser Games",
      "property"
    );
    updateMetaTag("og:locale", "en_US", "property");

    // Gaming specific Open Graph tags
    if (currentPath.startsWith("/game/")) {
      updateMetaTag("og:type", "game", "property");
      updateMetaTag("game:creator", "Gaming Fusion Hub", "property");
    }

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", currentSEO.title, "name");
    updateMetaTag("twitter:description", currentSEO.description, "name");
    updateMetaTag(
      "twitter:image",
      `${baseUrl}/images/twitter-card.jpg`,
      "name"
    );
    updateMetaTag("twitter:image:alt", "Gaming Fusion Hub", "name");
    updateMetaTag("twitter:site", "@GamingFusionHub", "name");
    updateMetaTag("twitter:creator", "@GamingFusionHub", "name");

    // Additional SEO tags
    updateMetaTag("theme-color", "#0ea5e9", "name");
    updateMetaTag("msapplication-TileColor", "#0ea5e9", "name");
    updateMetaTag("msapplication-navbutton-color", "#0ea5e9", "name");
    updateMetaTag("apple-mobile-web-app-status-bar-style", "default", "name");
    updateMetaTag(
      "viewport",
      "width=device-width, initial-scale=1.0, user-scalable=yes",
      "name"
    );

    // Security headers
    updateMetaTag("referrer", "strict-origin-when-cross-origin", "name");
    updateMetaTag("format-detection", "telephone=no", "name");

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);

    // Alternate languages (if you plan to support multiple languages)
    let alternateLang = document.querySelector(
      'link[rel="alternate"][hreflang="en"]'
    );
    if (!alternateLang) {
      alternateLang = document.createElement("link");
      alternateLang.setAttribute("rel", "alternate");
      alternateLang.setAttribute("hreflang", "en");
      document.head.appendChild(alternateLang);
    }
    alternateLang.setAttribute("href", currentUrl);

    // Structured data
    let structuredDataScript = document.querySelector("#structured-data");
    if (!structuredDataScript) {
      structuredDataScript = document.createElement("script");
      structuredDataScript.id = "structured-data";
      structuredDataScript.type = "application/ld+json";
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(getStructuredData());

    // Preconnect to important domains
    const preconnectDomains = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://cdnjs.cloudflare.com",
      "https://www.google-analytics.com",
      "https://www.googletagmanager.com",
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

    // DNS prefetch for better performance
    const dnsPrefetchDomains = ["//www.google.com", "//www.gstatic.com"];

    dnsPrefetchDomains.forEach((domain) => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement("link");
        link.rel = "dns-prefetch";
        link.href = domain;
        document.head.appendChild(link);
      }
    });

    // Add manifest link for PWA support
    let manifest = document.querySelector('link[rel="manifest"]');
    if (!manifest) {
      manifest = document.createElement("link");
      manifest.setAttribute("rel", "manifest");
      manifest.setAttribute("href", "/manifest.json");
      document.head.appendChild(manifest);
    }

    // Add favicon links
    const faviconSizes = [16, 32, 96, 192, 512];
    faviconSizes.forEach((size) => {
      let favicon = document.querySelector(
        `link[rel="icon"][sizes="${size}x${size}"]`
      );
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.setAttribute("rel", "icon");
        favicon.setAttribute("type", "image/png");
        favicon.setAttribute("sizes", `${size}x${size}`);
        favicon.setAttribute("href", `/icons/icon-${size}x${size}.png`);
        document.head.appendChild(favicon);
      }
    });

    // Apple touch icons
    let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleTouchIcon) {
      appleTouchIcon = document.createElement("link");
      appleTouchIcon.setAttribute("rel", "apple-touch-icon");
      appleTouchIcon.setAttribute("sizes", "180x180");
      appleTouchIcon.setAttribute("href", "/icons/apple-touch-icon.png");
      document.head.appendChild(appleTouchIcon);
    }
  }, [currentPath, currentSEO, currentUrl, baseUrl]);

  // This component doesn't render anything visible
  return null;
};

export default SEOHead;
