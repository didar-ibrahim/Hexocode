import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Language = 'en' | 'fr'

type Translations = {
  nav: {
    home: string
    projects: string
    services: string
    packages: string
    about: string
    contact: string
    startProject: string
  }
  common: {
    startProject: string
    viewWork: string
    learnMore: string
    mostPopular: string
    customQuote: string
    discussService: string
    backToHomepage: string
    pageNotFound: string
    pageNotFoundDesc: string
    loading: string
    loadingTeam: string
    visitLive: string
    viewCode: string
    client: string
    industry: string
    duration: string
    timeline: string
    featured: string
    technologies: string
    tags: string
    results: string
    challenges: string
    problem: string
    solution: string
    keyFeatures: string
    relatedProjects: string
    privacyPolicy: string
    termsOfService: string
    allRightsReserved: string
    typicalResponse: string
    company: string
    services: string
    contact: string
    viewAllProjects: string
    startConversation: string
    whatWeDo: string
    pricing: string
    testimonials: string
    whyHexocode: string
    footerServices: string[]
  }
  home: {
    heroLead: string
    heroTail: string
    heroDesc: string
    rotating: string[]
    capabilities: {
      modernTech: string
      responsiveDesign: string
      secureApps: string
      scalableArch: string
      customDev: string
    }
    selectedWork: string
    featuredProjectsTitle: string
    featuredProjectsSub: string
    servicesSub: string
    packagesSub: string
    whyTitle: string
    whySub: string
    whyItems: Array<{ title: string; text: string }>
    testimonialsSub: string
    ctaTitleLead: string
    ctaTitleGold: string
    ctaSub: string
  }
  services: {
    title: string
    description: string
    whatsIncluded: string
    noServices: string
    noServicesDesc: string
    notSureTitle: string
    notSureDesc: string
  }
  packages: {
    title: string
    description: string
    noPackages: string
    noPackagesDesc: string
    notes: Array<{ title: string; text: string }>
    customTitleLead: string
    customTitleGold: string
    customDesc: string
    requestQuote: string
  }
  projects: {
    title: string
    description: string
    searchPlaceholder: string
    allCategories: string
    allTechnologies: string
    projectCountSingular: string
    projectCountPlural: string
    noProjectsFound: string
    noProjectsDesc: string
  }
  projectDetail: {
    allProjects: string
    notFoundTitle: string
    notFoundDesc: string
    browseAll: string
    needSimilarTitle: string
    needSimilarDesc: string
  }
  about: {
    title: string
    description: string
    mission: string
    missionDefault: string
    vision: string
    visionDefault: string
    howWeWork: string
    philosophyTitle: string
    values: Array<{ title: string; text: string }>
    teamEyebrow: string
    teamTitle: string
    teamDesc: string
    toolboxEyebrow: string
    toolboxTitle: string
    toolboxDesc: string
  }
  contact: {
    title: string
    description: string
    nameLabel: string
    namePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    phoneLabel: string
    phoneHint: string
    phonePlaceholder: string
    companyLabel: string
    companyHint: string
    companyPlaceholder: string
    projectTypeLabel: string
    selectType: string
    projectTypes: Record<string, string>
    budgetRangeLabel: string
    selectBudget: string
    budgets: Record<string, string>
    messageLabel: string
    messageHint: string
    messagePlaceholder: string
    sendBtn: string
    messageReceivedTitle: string
    messageReceivedDesc: (name: string, email: string) => string
    otherWays: string
    responseTimeLabel: string
    within24Hours: string
    locationLabel: string
    preferEmail: string
    whatHappensTitle: string
    steps: string[]
    errName: string
    errEmail: string
    errMessage: string
    errGeneral: string
  }
  chatbot: {
    title: string
    greeting: string
    placeholder: string
    contactUs: string
    fallbackAnswer: string
    typing: string
    quickReplies: {
      services: string
      servicesAnswer: string
      pricing: string
      pricingAnswer: string
      human: string
      humanAnswer: string
    }
  }
  legal: {
    lastUpdated: string
    privacy: {
      title: string
      overviewTitle: string
      overviewText: string
      infoTitle: string
      infoText: string
      useTitle: string
      useText: string
      retentionTitle: string
      retentionText: string
      cookiesTitle: string
      cookiesText: string
      contactTitle: string
      contactText: string
    }
    terms: {
      title: string
      overviewTitle: string
      overviewText: string
      contentTitle: string
      contentText: string
      ipTitle: string
      ipText: string
      useTitle: string
      useText: string
      liabilityTitle: string
      liabilityText: string
      contactTitle: string
      contactText: string
    }
  }
}

const dictionaries: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      projects: 'Projects',
      services: 'Services',
      packages: 'Packages',
      about: 'About',
      contact: 'Contact',
      startProject: 'Start a Project',
    },
    common: {
      startProject: 'Start a Project',
      viewWork: 'View Our Work',
      learnMore: 'Learn more',
      mostPopular: 'Most Popular',
      customQuote: 'Custom Quote',
      discussService: 'Discuss this service',
      backToHomepage: 'Back to homepage',
      pageNotFound: 'Page not found',
      pageNotFoundDesc: 'The page you are looking for does not exist or has been moved.',
      loading: 'Loading…',
      loadingTeam: 'Loading team…',
      visitLive: 'Visit live site',
      viewCode: 'View code',
      client: 'Client',
      industry: 'Industry',
      duration: 'Duration',
      timeline: 'Timeline',
      featured: 'Featured',
      technologies: 'Technologies',
      tags: 'Tags',
      results: 'Results',
      challenges: 'Challenges',
      problem: 'The problem',
      solution: 'Our solution',
      keyFeatures: 'Key features',
      relatedProjects: 'Related projects',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      allRightsReserved: 'All rights reserved.',
      typicalResponse: 'Typical response time: within 24 hours',
      company: 'Company',
      services: 'Services',
      contact: 'Contact',
      viewAllProjects: 'View all projects',
      startConversation: 'Start a Conversation',
      whatWeDo: 'What we do',
      pricing: 'Pricing',
      testimonials: 'Testimonials',
      whyHexocode: 'Why Hexocode',
      footerServices: ['Website Development', 'Web Applications', 'Mobile Apps', 'E-Commerce', 'Backend & APIs', 'Maintenance'],
    },
    home: {
      heroLead: 'We build',
      heroTail: 'for real businesses.',
      heroDesc:
        'Hexocode designs and builds web platforms, mobile apps, design systems and custom software for startups, stores and growing companies — with the clarity, speed and craftsmanship that real businesses need.',
      rotating: ['web platforms', 'mobile apps', 'design systems', 'AI products'],
      capabilities: {
        modernTech: 'Modern Technologies',
        responsiveDesign: 'Responsive Design',
        secureApps: 'Secure Applications',
        scalableArch: 'Scalable Architecture',
        customDev: 'Custom Development',
      },
      selectedWork: 'Selected work',
      featuredProjectsTitle: 'Featured projects',
      featuredProjectsSub: 'Real systems running in real businesses — stores, clinics, restaurants and couriers.',
      servicesSub: 'From a fast marketing site to a full custom platform — one team, end to end.',
      packagesSub: 'Clear scope and honest pricing. Need something different? We scope custom work together.',
      whyTitle: 'A technical partner, not a vendor',
      whySub: "We're a two-person studio on purpose: senior work, direct communication and pricing that reflects what we actually are.",
      whyItems: [
        {
          title: 'Talk to the developers',
          text: 'No account managers or relay games. You speak directly with the two people designing and building your product — from first call to launch and beyond.',
        },
        {
          title: 'Custom-built, not templated',
          text: "Every project is designed around your business process. We don't force your workflow into an off-the-shelf theme or a page-builder.",
        },
        {
          title: 'Modern technology, sensibly chosen',
          text: "We use proven, current stacks — React, TypeScript, PostgreSQL, edge hosting — chosen for your project's needs, not for fashion.",
        },
        {
          title: 'Transparent pricing',
          text: "Clear packages and fixed milestones before we start. You always know what you're paying for and what you'll get.",
        },
        {
          title: 'Long-term support',
          text: "Launch day isn't goodbye. Maintenance plans keep your software secure, updated and improving as your business grows.",
        },
        {
          title: 'Business-oriented engineering',
          text: 'We measure success in your outcomes — conversions, hours saved, errors eliminated — not in lines of code shipped.',
        },
      ],
      testimonialsSub: 'Feedback from the businesses we build for.',
      ctaTitleLead: 'Have a project in mind?',
      ctaTitleGold: "Let's build it.",
      ctaSub: "Tell us what you're trying to achieve. We'll reply within 24 hours with honest advice on approach, timeline and cost.",
    },
    services: {
      title: 'Services',
      description: 'Every service below is delivered directly by the two of us — designed, built and supported without handoffs.',
      whatsIncluded: "What's included",
      noServices: 'No services published yet',
      noServicesDesc: 'Check back soon.',
      notSureTitle: 'Not sure which service fits?',
      notSureDesc: "Describe what you're trying to achieve — we'll recommend the simplest approach that gets you there.",
    },
    packages: {
      title: 'Packages built for real budgets',
      description: 'Straightforward packages for common needs — and custom quotes for everything else. No hidden fees, no agency markup.',
      noPackages: 'No packages published yet',
      noPackagesDesc: 'Check back soon.',
      notes: [
        {
          title: 'Fixed scope, honest pricing',
          text: 'Every package starts with a written scope. If your needs change, we adjust the quote together before work continues — never surprise invoices.',
        },
        {
          title: 'Realistic timelines',
          text: "Delivery estimates come from experience, not optimism. We'd rather give you a date we can keep than a date you'd like to hear.",
        },
        {
          title: 'Support included',
          text: 'Every package includes a free support period after launch. Ongoing maintenance plans are available when that ends.',
        },
      ],
      customTitleLead: "Doesn't fit a package?",
      customTitleGold: "That's normal.",
      customDesc: "Most interesting projects don't fit in a box. Tell us what you need and we'll scope it together — free, no obligation.",
      requestQuote: 'Request a Custom Quote',
    },
    projects: {
      title: 'Projects',
      description: 'A selection of systems we\'ve designed, built and shipped. Filter by category or technology to find work similar to what you have in mind.',
      searchPlaceholder: 'Search projects, clients…',
      allCategories: 'All categories',
      allTechnologies: 'All technologies',
      projectCountSingular: 'project',
      projectCountPlural: 'projects',
      noProjectsFound: 'No projects found',
      noProjectsDesc: 'Try a different search term or clear the filters.',
    },
    projectDetail: {
      allProjects: 'All projects',
      notFoundTitle: 'Project not found',
      notFoundDesc: "This project doesn't exist or hasn't been published yet.",
      browseAll: 'Browse all projects',
      needSimilarTitle: 'Need something similar?',
      needSimilarDesc: "Tell us about your project — we'll reply within 24 hours.",
    },
    about: {
      title: 'Two developers who answer their own email.',
      description:
        'Hexocode is a two-developer software studio. We design and build websites, web applications, mobile apps and custom business systems for clients who want a technical partner, not just a vendor.',
      mission: 'Mission',
      missionDefault:
        'To give startups and growing businesses access to genuinely good software engineering — without agency overhead or opaque pricing.',
      vision: 'Vision',
      visionDefault:
        'A small studio known for work that lasts: products our clients still rely on years after launch.',
      howWeWork: 'How we work',
      philosophyTitle: 'Development philosophy',
      values: [
        {
          title: 'Honesty over salesmanship',
          text: 'We tell you what you need to hear, not what wins the contract — including when a simpler, cheaper solution is the right one.',
        },
        {
          title: 'Craft over shortcuts',
          text: "Readable code, tested flows, documented decisions. The next developer who touches your system will thank us — often that developer is you.",
        },
        {
          title: 'Clarity over jargon',
          text: "You'll always understand what we're building, why, and what it costs. Technical decisions get explained in business terms.",
        },
        {
          title: 'Long-term over launch-day',
          text: "We build things we'll be proud to maintain. That shapes every architectural choice from day one.",
        },
      ],
      teamEyebrow: 'The team',
      teamTitle: "The two people you'll actually work with",
      teamDesc: 'No account managers, no handoffs — you talk to the people writing the code.',
      toolboxEyebrow: 'Toolbox',
      toolboxTitle: 'Technologies we work with',
      toolboxDesc: 'Proven, current tools — chosen per project, not per trend.',
    },
    contact: {
      title: "Let's talk about your project",
      description: "Tell us what you're building. We reply within 24 hours — usually much faster.",
      nameLabel: 'Name',
      namePlaceholder: 'Your full name',
      emailLabel: 'Email',
      emailPlaceholder: 'you@company.com',
      phoneLabel: 'Phone / WhatsApp',
      phoneHint: 'Optional',
      phonePlaceholder: '+964 …',
      companyLabel: 'Company',
      companyHint: 'Optional',
      companyPlaceholder: 'Company or brand name',
      projectTypeLabel: 'Project type',
      selectType: 'Select a type…',
      projectTypes: {
        Website: 'Website',
        'Web Application': 'Web Application',
        'Mobile App': 'Mobile App',
        'E-commerce Store': 'E-commerce Store',
        'Backend / API': 'Backend / API',
        'Maintenance & Support': 'Maintenance & Support',
        'Something else': 'Something else',
      },
      budgetRangeLabel: 'Budget range',
      selectBudget: 'Select a range…',
      budgets: {
        'Under $500': 'Under $500',
        '$500 – $1,000': '$500 – $1,000',
        '$1,000 – $3,000': '$1,000 – $3,000',
        '$3,000 – $10,000': '$3,000 – $10,000',
        '$10,000+': '$10,000+',
        'Not sure yet': 'Not sure yet',
      },
      messageLabel: 'Tell us about your project',
      messageHint: 'What are you building? Who is it for? Any deadline?',
      messagePlaceholder:
        'We need an online store for our electronics shop with inventory sync to our physical store…',
      sendBtn: 'Send Message',
      messageReceivedTitle: 'Message received',
      messageReceivedDesc: (name: string, email: string) =>
        `Thanks, ${name}. We'll get back to you at ${email} within 24 hours.`,
      otherWays: 'Other ways to reach us',
      responseTimeLabel: 'Response time',
      within24Hours: 'Within 24 hours',
      locationLabel: 'Location',
      preferEmail: 'Prefer email? Write to us directly',
      whatHappensTitle: 'What happens next?',
      steps: [
        'We read your message and reply within 24 hours',
        'A short call to understand your goals',
        'A written proposal with scope, timeline and fixed price',
        'You decide — no pressure, no obligation',
      ],
      errName: 'Please tell us your name.',
      errEmail: 'Please enter a valid email address.',
      errMessage: 'Please describe your project in at least 20 characters.',
      errGeneral: 'Something went wrong. Please try again.',
    },
    chatbot: {
      title: 'Hexocode Assistant',
      greeting: 'Hi there! How can we help you today?',
      placeholder: 'Type a message...',
      contactUs: 'Go to Contact Form',
      fallbackAnswer: "Thanks for reaching out! I'm a simple assistant and I can't process custom messages just yet. Please use the 'Go to Contact Form' button below to email our human team directly!",
      typing: 'Typing...',
      quickReplies: {
        services: 'What services do you offer?',
        servicesAnswer: 'We offer full-stack web and mobile development, custom applications, and E-commerce platforms. We handle everything from design to deployment.',
        pricing: 'How much does it cost?',
        pricingAnswer: 'Our pricing is fully transparent. We have fixed packages for standard projects, and we provide custom quotes for everything else. No hidden fees.',
        human: 'Can I talk to a human?',
        humanAnswer: 'Of course! We are a two-person team and we answer our own emails. You can reach out via the contact form or email us directly, and we will reply within 24 hours.',
      },
    },
    legal: {
      lastUpdated: 'Last updated: August 2026',
      privacy: {
        title: 'Privacy Policy',
        overviewTitle: 'Overview',
        overviewText:
          'This privacy policy explains what information Hexocode ("we", "us") collects when you use this website, why we collect it, and how it is handled.',
        infoTitle: 'Information we collect',
        infoText:
          'When you submit our contact form we collect the details you provide: your name, email address, optional phone number, company, and your message. We also process standard technical metadata solely to prevent spam and abuse.',
        useTitle: 'How we use information',
        useText:
          'We use contact details only to respond to your enquiry and, if a project follows, to communicate about that work. We do not sell, rent, or share your personal information with third parties.',
        retentionTitle: 'Data retention',
        retentionText:
          'Contact messages are retained for as long as needed to handle your enquiry and any resulting project. You may request deletion of your messages at any time by emailing us.',
        cookiesTitle: 'Cookies',
        cookiesText:
          'This website uses only strictly necessary storage (for example, remembering your light/dark theme or language preference). The public site does not use advertising or third-party tracking cookies.',
        contactTitle: 'Contact',
        contactText:
          'Questions about this policy can be sent to our contact email. We aim to respond within two business days.',
      },
      terms: {
        title: 'Terms of Service',
        overviewTitle: 'Overview',
        overviewText:
          'These terms govern the use of the Hexocode website. They do not constitute formal legal advice.',
        contentTitle: 'Website content',
        contentText:
          'The content on this website — including project descriptions, service descriptions and pricing packages — is provided for general information. Quotes and timelines become binding only through a written proposal agreed by both parties.',
        ipTitle: 'Intellectual property',
        ipText:
          'The Hexocode name, logo and website design are the property of Hexocode. Case studies are shared with client permission.',
        useTitle: 'Acceptable use',
        useText:
          'You agree not to misuse this website, including attempting to gain unauthorized access, submitting false or malicious content through forms, or disrupting the service.',
        liabilityTitle: 'Liability',
        liabilityText:
          'This website is provided "as is". To the extent permitted by applicable law, we are not liable for indirect or consequential damages arising from use of this website.',
        contactTitle: 'Contact',
        contactText: 'Questions about these terms can be sent to our contact email.',
      },
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      projects: 'Projets',
      services: 'Services',
      packages: 'Forfaits',
      about: 'À propos',
      contact: 'Contact',
      startProject: 'Démarrer un projet',
    },
    common: {
      startProject: 'Démarrer un projet',
      viewWork: 'Voir nos réalisations',
      learnMore: 'En savoir plus',
      mostPopular: 'Le plus populaire',
      customQuote: 'Devis sur mesure',
      discussService: 'Discuter de ce service',
      backToHomepage: "Retour à l'accueil",
      pageNotFound: 'Page non trouvée',
      pageNotFoundDesc: "La page que vous recherchez n'existe pas ou a été déplacée.",
      loading: 'Chargement…',
      loadingTeam: 'Chargement de l’équipe…',
      visitLive: 'Visiter le site',
      viewCode: 'Voir le code',
      client: 'Client',
      industry: 'Secteur',
      duration: 'Durée',
      timeline: 'Calendrier',
      featured: 'En vedette',
      technologies: 'Technologies',
      tags: 'Mots-clés',
      results: 'Résultats',
      challenges: 'Défis',
      problem: 'Le problème',
      solution: 'Notre solution',
      keyFeatures: 'Caractéristiques clés',
      relatedProjects: 'Projets similaires',
      privacyPolicy: 'Politique de confidentialité',
      termsOfService: "Conditions d'utilisation",
      allRightsReserved: 'Tous droits réservés.',
      typicalResponse: 'Temps de réponse habituel : sous 24 heures',
      company: 'Entreprise',
      services: 'Services',
      contact: 'Contact',
      viewAllProjects: 'Voir tous les projets',
      startConversation: 'Démarrer la discussion',
      whatWeDo: 'Ce que nous faisons',
      pricing: 'Tarification',
      testimonials: 'Témoignages',
      whyHexocode: 'Pourquoi Hexocode',
      footerServices: ['Création de sites web', 'Applications web', 'Applications mobiles', 'E-commerce', 'Backend & APIs', 'Maintenance'],
    },
    home: {
      heroLead: 'Nous concevons des',
      heroTail: 'pour les entreprises ambitieuses.',
      heroDesc:
        'Hexocode conçoit et développe des plateformes web, applications mobiles, systèmes de design et logiciels sur mesure pour startups, commerces et entreprises en croissance — avec la clarté, la rapidité et l’exigence d’un travail d’artisan.',
      rotating: ['plateformes web', 'apps mobiles', 'systèmes design', 'produits IA'],
      capabilities: {
        modernTech: 'Technologies Modernes',
        responsiveDesign: 'Design Responsive',
        secureApps: 'Applications Sécurisées',
        scalableArch: 'Architecture Évolutive',
        customDev: 'Développement Sur Mesure',
      },
      selectedWork: 'Sélection de travaux',
      featuredProjectsTitle: 'Projets vedettes',
      featuredProjectsSub: 'Des systèmes réels utilisés quotidiennement par des magasins, cliniques, restaurants et transporteurs.',
      servicesSub: 'Du site vitrine ultra-rapide à la plateforme sur mesure complète — une seule équipe, de A à Z.',
      packagesSub: 'Périmètre clair et prix transparents. Besoin de sur mesure ? Nous évaluons votre projet ensemble.',
      whyTitle: 'Un partenaire technique, pas un simple prestataire',
      whySub: 'Nous sommes un studio de deux développeurs par choix : expertise senior, communication directe et tarifs justes.',
      whyItems: [
        {
          title: 'Parlez directement aux développeurs',
          text: 'Aucun gestionnaire de compte ni intermédiaire. Vous échangez en direct avec les deux personnes qui conçoivent et créent votre produit.',
        },
        {
          title: 'Sur mesure, jamais de modèles',
          text: 'Chaque projet est conçu autour de vos processus métier. Nous n’imposons pas vos workflows dans un thème générique.',
        },
        {
          title: 'Technologies modernes et pertinentes',
          text: 'Nous utilisons des technologies éprouvées — React, TypeScript, PostgreSQL, hébergement Edge — choisies selon vos besoins.',
        },
        {
          title: 'Tarification transparente',
          text: 'Forfaits clairs et étapes fixes dès le départ. Vous savez toujours exactement ce que vous payez et ce que vous obtenez.',
        },
        {
          title: 'Accompagnement sur le long terme',
          text: 'Le lancement n’est que le début. Nos plans de maintenance gardent votre logiciel sécurisé, mis à jour et performant.',
        },
        {
          title: 'Ingénierie axée sur le résultat métier',
          text: 'Nous mesurons la réussite à vos résultats — conversions, heures gagnées, erreurs évitées — pas aux lignes de code.',
        },
      ],
      testimonialsSub: 'Les retours des entreprises avec lesquelles nous collaborons.',
      ctaTitleLead: 'Vous avez un projet en tête ?',
      ctaTitleGold: 'Concevons-le ensemble.',
      ctaSub: 'Parlez-nous de vos objectifs. Nous répondons sous 24h avec des conseils honnêtes sur l’approche, le calendrier et les coûts.',
    },
    services: {
      title: 'Services',
      description: 'Chaque service ci-dessous est réalisé directement par notre binôme — conçu, développé et suivi sans intermédiaires.',
      whatsIncluded: 'Ce qui est inclus',
      noServices: 'Aucun service publié pour le moment',
      noServicesDesc: 'Revenez bientôt.',
      notSureTitle: 'Incertain du service qui vous convient ?',
      notSureDesc: 'Décrivez-nous votre objectif — nous vous recommanderons l’approche la plus simple et efficace pour y parvenir.',
    },
    packages: {
      title: 'Des forfaits adaptés aux vrais budgets',
      description: 'Des formules claires pour les besoins fréquents — et des devis sur mesure pour tout le reste. Sans frais cachés.',
      noPackages: 'Aucun forfait publié pour le moment',
      noPackagesDesc: 'Revenez bientôt.',
      notes: [
        {
          title: 'Périmètre fixe, tarifs transparents',
          text: 'Chaque forfait débute avec un cahier des charges écrit. Si vos besoins évoluent, nous ajustons le devis ensemble au préalable.',
        },
        {
          title: 'Calendriers réalistes',
          text: 'Nos estimations reposent sur l’expérience réelle. Nous préférons vous donner une date tenue qu’un délai irréaliste.',
        },
        {
          title: 'Support inclus',
          text: 'Chaque forfait comprend une période de support offerte après le lancement. Des offres de maintenance prennent le relais ensuite.',
        },
      ],
      customTitleLead: 'Votre projet ne rentre pas dans un forfait ?',
      customTitleGold: 'C’est tout à fait normal.',
      customDesc: 'Les projets les plus ambitieux nécessitent du sur mesure. Évaluons vos besoins ensemble — sans engagement.',
      requestQuote: 'Demander un devis personnalisé',
    },
    projects: {
      title: 'Projets',
      description: 'Une sélection de systèmes que nous avons conçus et déployés. Filtrez par catégorie ou technologie pour découvrir nos réalisations.',
      searchPlaceholder: 'Rechercher un projet, un client…',
      allCategories: 'Toutes les catégories',
      allTechnologies: 'Toutes les technologies',
      projectCountSingular: 'projet',
      projectCountPlural: 'projets',
      noProjectsFound: 'Aucun projet trouvé',
      noProjectsDesc: 'Essayez d’autres termes de recherche ou réinitialisez les filtres.',
    },
    projectDetail: {
      allProjects: 'Tous les projets',
      notFoundTitle: 'Projet non trouvé',
      notFoundDesc: 'Ce projet n’existe pas ou n’a pas encore été publié.',
      browseAll: 'Parcourir tous les projets',
      needSimilarTitle: 'Un besoin similaire ?',
      needSimilarDesc: 'Parlez-nous de votre projet — nous vous répondons sous 24 heures.',
    },
    about: {
      title: 'Deux développeurs qui répondent eux-mêmes à vos messages.',
      description:
        'Hexocode est un studio de développement composé de deux ingénieurs. Nous créons des sites, des applications web et mobiles sur mesure pour ceux qui recherchent un véritable partenaire technique.',
      mission: 'Mission',
      missionDefault:
        'Offrir aux startups et entreprises en croissance une ingénierie logicielle d’excellence — sans les frais généraux ni la complexité des agences.',
      vision: 'Vision',
      visionDefault:
        'Un studio reconnu pour ses réalisations durables : des produits que nos clients utilisent encore des années après leur lancement.',
      howWeWork: 'Notre démarche',
      philosophyTitle: 'Philosophie de développement',
      values: [
        {
          title: 'Honnêteté avant la vente',
          text: 'Nous vous donnons des conseils sincères, même lorsqu’une solution plus simple et plus économique est préférable.',
        },
        {
          title: 'Exigence et qualité',
          text: 'Un code propre, des parcours testés et des choix documentés. Le prochain développeur qui interviendra sur votre projet appréciera.',
        },
        {
          title: 'Clarté sans jargon',
          text: 'Vous comprenez toujours ce que nous construisons, pourquoi, et à quel coût. Les décisions techniques sont expliquées en langage métier.',
        },
        {
          title: 'Vision long terme',
          text: 'Nous conçevons des solutions dont nous sommes fiers d’assurer la maintenance sur la durée.',
        },
      ],
      teamEyebrow: 'L’équipe',
      teamTitle: 'Les deux personnes avec qui vous collaborerez',
      teamDesc: 'Pas de commercial, pas de sous-traitance — vous échangez avec les créateurs du code.',
      toolboxEyebrow: 'Boîte à outils',
      toolboxTitle: 'Technologies maîtrisées',
      toolboxDesc: 'Des outils modernes et éprouvés — choisis selon les enjeux du projet.',
    },
    contact: {
      title: 'Parlons de votre projet',
      description: 'Décrivez-nous ce que vous souhaitez construire. Nous répondons sous 24h.',
      nameLabel: 'Nom complet',
      namePlaceholder: 'Votre nom et prénom',
      emailLabel: 'Adresse email',
      emailPlaceholder: 'vous@entreprise.com',
      phoneLabel: 'Téléphone / WhatsApp',
      phoneHint: 'Optionnel',
      phonePlaceholder: '+33 …',
      companyLabel: 'Entreprise',
      companyHint: 'Optionnel',
      companyPlaceholder: 'Nom de votre entreprise ou marque',
      projectTypeLabel: 'Type de projet',
      selectType: 'Sélectionnez un type…',
      projectTypes: {
        Website: 'Site Web',
        'Web Application': 'Application Web',
        'Mobile App': 'Application Mobile',
        'E-commerce Store': 'Boutique E-commerce',
        'Backend / API': 'Backend / API',
        'Maintenance & Support': 'Maintenance & Support',
        'Something else': 'Autre projet',
      },
      budgetRangeLabel: 'Budget estimé',
      selectBudget: 'Sélectionnez une tranche…',
      budgets: {
        'Under $500': 'Moins de 500 €',
        '$500 – $1,000': '500 € – 1 000 €',
        '$1,000 – $3,000': '1 000 € – 3 000 €',
        '$3,000 – $10,000': '3 000 € – 10 000 €',
        '$10,000+': 'Plus de 10 000 €',
        'Not sure yet': 'Pas encore fixé',
      },
      messageLabel: 'Décrivez votre projet',
      messageHint: 'Que souhaitez-vous créer ? Pour qui ? Une date limite ?',
      messagePlaceholder:
        'Nous souhaitons créer une boutique en ligne pour notre magasin d’électronique avec synchronisation des stocks…',
      sendBtn: 'Envoyer le message',
      messageReceivedTitle: 'Message bien reçu',
      messageReceivedDesc: (name: string, email: string) =>
        `Merci ${name}. Nous vous recontacterons à l’adresse ${email} sous 24 heures.`,
      otherWays: 'Autres moyens de nous contacter',
      responseTimeLabel: 'Délai de réponse',
      within24Hours: 'Sous 24 heures',
      locationLabel: 'Localisation',
      preferEmail: 'Vous préférez l’email direct ? Écrivez-nous',
      whatHappensTitle: 'Et ensuite ?',
      steps: [
        'Nous étudions votre demande et vous répondons sous 24h',
        'Un court échange pour préciser vos besoins',
        'Une proposition écrite avec calendrier et prix fixe',
        'Vous décidez librement, sans engagement',
      ],
      errName: 'Veuillez renseigner votre nom.',
      errEmail: 'Veuillez saisir une adresse email valide.',
      errMessage: 'Veuillez décrire votre projet en au moins 20 caractères.',
      errGeneral: 'Une erreur s’est produite. Veuillez réessayer.',
    },
    chatbot: {
      title: 'Assistant Hexocode',
      greeting: 'Bonjour ! Comment pouvons-nous vous aider ?',
      placeholder: 'Écrivez un message...',
      contactUs: 'Aller au formulaire de contact',
      fallbackAnswer: "Merci pour votre message ! Je suis un simple assistant et je ne peux pas encore comprendre les requêtes personnalisées. Utilisez le bouton 'Aller au formulaire' ci-dessous pour contacter notre équipe humaine !",
      typing: 'En train d\'écrire...',
      quickReplies: {
        services: 'Quels services proposez-vous ?',
        servicesAnswer: 'Nous proposons du développement web et mobile complet, des applications sur mesure et des plateformes E-commerce. Nous gérons tout, de la conception au déploiement.',
        pricing: 'Combien ça coûte ?',
        pricingAnswer: 'Notre tarification est totalement transparente. Nous avons des forfaits fixes pour les projets standards, et nous fournissons des devis sur mesure pour le reste. Aucun frais caché.',
        human: 'Puis-je parler à un humain ?',
        humanAnswer: 'Bien sûr ! Nous sommes une équipe de deux personnes et nous répondons nous-mêmes à nos emails. Utilisez le formulaire de contact, nous répondrons sous 24 heures.',
      },
    },
    legal: {
      lastUpdated: 'Dernière mise à jour : août 2026',
      privacy: {
        title: 'Politique de confidentialité',
        overviewTitle: 'Présentation générale',
        overviewText:
          'Cette politique de confidentialité détaille les données collectées par Hexocode ("nous") lors de l’utilisation de ce site et leurs modalités de traitement.',
        infoTitle: 'Données collectées',
        infoText:
          'Lorsque vous soumettez le formulaire de contact, nous collectons : nom, email, téléphone (optionnel), entreprise et message. Des métadonnées techniques anonymisées peuvent être traitées pour éviter le spam.',
        useTitle: 'Utilisation des données',
        useText:
          'Vos coordonnées servent uniquement à répondre à vos demandes et à communiquer dans le cadre d’un projet. Aucune donnée n’est vendue ou partagée à des fins commerciales.',
        retentionTitle: 'Conservation des données',
        retentionText:
          'Les messages sont conservés la durée nécessaire au traitement de la demande. Vous pouvez demander leur suppression à tout moment par email.',
        cookiesTitle: 'Cookies et stockage',
        cookiesText:
          'Ce site utilise uniquement des éléments de stockage strictement nécessaires (ex. préférences de thème ou de langue). Aucun cookie publicitaire tiers n’est utilisé sur le site public.',
        contactTitle: 'Contact',
        contactText:
          'Toute question concernant cette politique peut être adressée par email à notre équipe. Nous y répondons sous deux jours ouvrés.',
      },
      terms: {
        title: "Conditions d'utilisation",
        overviewTitle: 'Présentation générale',
        overviewText:
          'Ces conditions régissent l’utilisation du site web Hexocode. Elles sont fournies à titre indicatif.',
        contentTitle: 'Contenu du site',
        contentText:
          'Les éléments présentés sur ce site (descriptions, forfaits, projets) le sont à titre d’information. Les devis et engagements ne deviennent contractuels qu’après accord écrit signé par les parties.',
        ipTitle: 'Propriété intellectuelle',
        ipText:
          'La marque Hexocode, le logo et le design du site sont la propriété exclusive d’Hexocode. Les cas clients sont présentés avec l’accord des clients.',
        useTitle: 'Utilisation acceptable',
        useText:
          'Vous vous engagez à ne pas altérer ni perturber le fonctionnement de ce site, ni à soumettre du contenu abusif ou malveillant.',
        liabilityTitle: 'Limitation de responsabilité',
        liabilityText:
          'Ce site est fourni "en l’état". Dans les limites autorisées par la loi, Hexocode décline toute responsabilité pour les dommages indirects découlant de son utilisation.',
        contactTitle: 'Contact',
        contactText: 'Pour toute question relative à ces conditions, contactez-nous par email.',
      },
    },
  },
}

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('hexo-lang') as Language
      if (stored === 'en' || stored === 'fr') return stored
      if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('fr')) {
        return 'fr'
      }
    } catch {
      /* ignore */
    }
    return 'en'
  })

  const setLang = (nextLang: Language) => {
    setLangState(nextLang)
    try {
      localStorage.setItem('hexo-lang', nextLang)
    } catch {
      /* ignore */
    }
  }

  const value = {
    lang,
    setLang,
    t: dictionaries[lang],
  }

  return React.createElement(LanguageContext.Provider, { value }, children)
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
