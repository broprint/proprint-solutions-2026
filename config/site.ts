export const siteConfig = {
  name: 'ProPrint Solutions',
  shortName: 'ProPrint',
  domain: 'proprintsolutions.net',
  locale: 'en_KW',
  country: 'Kuwait',
  currencyCode: 'KWD',
  currencyLabel: 'KD',

  tagline: 'Technology • Printing • Infrastructure • Service',
  supportLine: 'Kuwait-wide sales & support',
  footerSummary: 'Technology products, printing solutions, infrastructure and technical services for Kuwait.',

  contact: {
    email: 'support@proprintsolutions.net',
    phone: '+965 24333201',
    address: 'Galleria Building 57, behind Lulu, Mezzanine Office No. 1, Gate #3, Al-Dajeej 13095, Kuwait',
  },

  hours: {
    weekdays: 'Sunday–Thursday: 8:00 AM–5:00 PM',
    saturday: 'Saturday: 8:00 AM–1:00 PM',
    friday: 'Friday: Closed',
  },

  branding: {
    logo: '/proprint-logo.png',
    primary: '#0b5cff',
    secondary: '#f47b20',
    dark: '#061321',
    themeColor: '#061321',
  },

  seo: {
    defaultTitle: 'ProPrint Solutions | IT, Printing & Technical Services Kuwait',
    description: 'ProPrint Solutions provides IT products, printers, plotters, service center support, AMC, enterprise IT and onsite field services across Kuwait.',
    openGraphDescription: 'Technology products, professional printing, service center, AMC and enterprise IT support across Kuwait.',
    twitterDescription: 'IT products, printing, service, AMC and enterprise support in Kuwait.',
    keywords: [
      'ProPrint Solutions Kuwait',
      'IT products Kuwait',
      'printers Kuwait',
      'plotters Kuwait',
      'laptops Kuwait',
      'printer repair Kuwait',
      'IT AMC Kuwait',
      'enterprise IT support Kuwait',
    ],
  },
} as const;
