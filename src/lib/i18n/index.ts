/**
 * Internationalization (i18n) System
 * Supports English, Shona, and Ndebele for Zimbabwe
 */

export type Locale = "en" | "sn" | "nd"

export const locales: Locale[] = ["en", "sn", "nd"]

export const localeNames: Record<Locale, string> = {
  en: "English",
  sn: "Shona",
  nd: "Ndebele",
}

// Translation dictionaries
const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Common
    "common.welcome": "Welcome",
    "common.login": "Sign In",
    "common.logout": "Sign Out",
    "common.register": "Register",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.confirm": "Confirm",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.applications": "Applications",
    "nav.members": "Members",
    "nav.claims": "Claims",
    "nav.benefits": "Benefits",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.billing": "Billing",
    "nav.analytics": "Analytics",

    // Member Portal
    "portal.welcome": "Welcome back",
    "portal.membershipCard": "Membership Card",
    "portal.downloadCard": "Download Card",
    "portal.benefits": "Your Benefits",
    "portal.claims": "Your Claims",
    "portal.submitClaim": "Submit Claim",
    "portal.viewClaims": "View Claims",
    "portal.dependents": "Your Dependents",
    "portal.addDependent": "Add Dependent",

    // Applications
    "application.new": "New Application",
    "application.status": "Application Status",
    "application.submitted": "Submitted",
    "application.underReview": "Under Review",
    "application.approved": "Approved",
    "application.rejected": "Rejected",
    "application.pending": "Pending",

    // Claims
    "claim.submit": "Submit Claim",
    "claim.type": "Claim Type",
    "claim.amount": "Amount",
    "claim.provider": "Healthcare Provider",
    "claim.date": "Service Date",
    "claim.documents": "Supporting Documents",
    "claim.approved": "Approved",
    "claim.rejected": "Rejected",
    "claim.pending": "Pending Review",

    // Forms
    "form.firstName": "First Name",
    "form.lastName": "Last Name",
    "form.email": "Email Address",
    "form.phone": "Phone Number",
    "form.address": "Address",
    "form.dateOfBirth": "Date of Birth",
    "form.idNumber": "ID Number",
    "form.required": "This field is required",

    // Messages
    "msg.applicationSubmitted": "Your application has been submitted successfully",
    "msg.claimSubmitted": "Your claim has been submitted successfully",
    "msg.saveSuccess": "Changes saved successfully",
    "msg.deleteConfirm": "Are you sure you want to delete this?",
  },

  sn: {
    // Common
    "common.welcome": "Mauya",
    "common.login": "Pinda",
    "common.logout": "Buda",
    "common.register": "Nyoresa",
    "common.submit": "Tumira",
    "common.cancel": "Kanzura",
    "common.save": "Chengetedza",
    "common.delete": "Bvisa",
    "common.edit": "Shandura",
    "common.view": "Ona",
    "common.search": "Tsvaka",
    "common.filter": "Sefa",
    "common.loading": "Kurodhwa...",
    "common.error": "Kukanganisa",
    "common.success": "Zvabudirira",
    "common.confirm": "Simbisa",
    "common.back": "Dzoka",
    "common.next": "Mberi",
    "common.previous": "Shure",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.applications": "Zvikumbiro",
    "nav.members": "Nhengo",
    "nav.claims": "Zvinodiwa",
    "nav.benefits": "Mibayiro",
    "nav.profile": "Ruzivo Rwako",
    "nav.settings": "Marongero",
    "nav.billing": "Kubhadhara",
    "nav.analytics": "Ongororo",

    // Member Portal
    "portal.welcome": "Mauya zvakare",
    "portal.membershipCard": "Kadhi Renhengo",
    "portal.downloadCard": "Dhawunirodha Kadhi",
    "portal.benefits": "Mibayiro Yako",
    "portal.claims": "Zvinodiwa Zvako",
    "portal.submitClaim": "Tumira Chinodiwa",
    "portal.viewClaims": "Ona Zvinodiwa",
    "portal.dependents": "Vanhu Vaunotarisira",
    "portal.addDependent": "Wedzera Munhu",

    // Applications
    "application.new": "Chikumbiro Chitsva",
    "application.status": "Mamiriro Echikumbiro",
    "application.submitted": "Chatumirwa",
    "application.underReview": "Chiri Kuongororwa",
    "application.approved": "Chabvumidzwa",
    "application.rejected": "Charambwa",
    "application.pending": "Chakamirira",

    // Claims
    "claim.submit": "Tumira Chinodiwa",
    "claim.type": "Mhando Yechinodiwa",
    "claim.amount": "Huwandu",
    "claim.provider": "Mupizi Weutano",
    "claim.date": "Zuva Rebasa",
    "claim.documents": "Magwaro Anotsigira",
    "claim.approved": "Chabvumidzwa",
    "claim.rejected": "Charambwa",
    "claim.pending": "Chakamirira Kuongororwa",

    // Forms
    "form.firstName": "Zita Rekutanga",
    "form.lastName": "Zita Rekupedzisira",
    "form.email": "Kero yeEmail",
    "form.phone": "Nhamba yeFoni",
    "form.address": "Kero",
    "form.dateOfBirth": "Zuva Rekuzvarwa",
    "form.idNumber": "Nhamba yeID",
    "form.required": "Ichi chinofanira kuzadzwa",

    // Messages
    "msg.applicationSubmitted": "Chikumbiro chako chatumirwa zvakanaka",
    "msg.claimSubmitted": "Chinodiwa chako chatumirwa zvakanaka",
    "msg.saveSuccess": "Shanduko dzachengetedzwa zvakanaka",
    "msg.deleteConfirm": "Une chokwadi chekuti unoda kubvisa izvi?",
  },

  nd: {
    // Common
    "common.welcome": "Siyakwemukela",
    "common.login": "Ngena",
    "common.logout": "Phuma",
    "common.register": "Bhalisela",
    "common.submit": "Thumela",
    "common.cancel": "Khansela",
    "common.save": "Gcina",
    "common.delete": "Susa",
    "common.edit": "Lungisa",
    "common.view": "Bona",
    "common.search": "Dinga",
    "common.filter": "Hluza",
    "common.loading": "Kulayitsha...",
    "common.error": "Iphutha",
    "common.success": "Kuphumelela",
    "common.confirm": "Qinisekisa",
    "common.back": "Emuva",
    "common.next": "Okulandelayo",
    "common.previous": "Okudlulileyo",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.applications": "Izicelo",
    "nav.members": "Amalunga",
    "nav.claims": "Izicelo",
    "nav.benefits": "Inzuzo",
    "nav.profile": "Iprofaili Yakho",
    "nav.settings": "Izilungiselelo",
    "nav.billing": "Ukukhokha",
    "nav.analytics": "Ukuhlaziya",

    // Member Portal
    "portal.welcome": "Siyakwemukela futhi",
    "portal.membershipCard": "Ikhadi Lobulungu",
    "portal.downloadCard": "Dawuniloda Ikhadi",
    "portal.benefits": "Inzuzo Yakho",
    "portal.claims": "Izicelo Zakho",
    "portal.submitClaim": "Thumela Isicelo",
    "portal.viewClaims": "Bona Izicelo",
    "portal.dependents": "Abantu Abakho",
    "portal.addDependent": "Engeza Umuntu",

    // Applications
    "application.new": "Isicelo Esitsha",
    "application.status": "Isimo Sesicelo",
    "application.submitted": "Sithunyelwe",
    "application.underReview": "Siyahlolwa",
    "application.approved": "Sivunyiwe",
    "application.rejected": "Salwa",
    "application.pending": "Silindile",

    // Claims
    "claim.submit": "Thumela Isicelo",
    "claim.type": "Uhlobo Lwesicelo",
    "claim.amount": "Imali",
    "claim.provider": "Umhlinzeki Wezempilo",
    "claim.date": "Usuku Lwenkonzo",
    "claim.documents": "Imibhalo Esekela",
    "claim.approved": "Sivunyiwe",
    "claim.rejected": "Salwa",
    "claim.pending": "Silindile Ukuhlolwa",

    // Forms
    "form.firstName": "Ibizo Lokuqala",
    "form.lastName": "Isibongo",
    "form.email": "Ikheli le-Email",
    "form.phone": "Inombolo Yocingo",
    "form.address": "Ikheli",
    "form.dateOfBirth": "Usuku Lokuzalwa",
    "form.idNumber": "Inombolo ye-ID",
    "form.required": "Lokhu kuyafuneka",

    // Messages
    "msg.applicationSubmitted": "Isicelo sakho sithunyelwe ngempumelelo",
    "msg.claimSubmitted": "Isicelo sakho sithunyelwe ngempumelelo",
    "msg.saveSuccess": "Izinguquko zigciniwe ngempumelelo",
    "msg.deleteConfirm": "Uqinisekile ukuthi ufuna ukususa lokhu?",
  },
}

/**
 * Get translation for a key
 */
export function t(key: string, locale: Locale = "en"): string {
  return translations[locale][key] || translations.en[key] || key
}

/**
 * Get all translations for a locale
 */
export function getTranslations(locale: Locale): Record<string, string> {
  return translations[locale] || translations.en
}

/**
 * Format date according to locale
 */
export function formatDateLocale(date: Date, locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: "en-GB",
    sn: "en-ZW",
    nd: "en-ZW",
  }

  return date.toLocaleDateString(localeMap[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

/**
 * Format currency according to locale
 */
export function formatCurrencyLocale(
  amount: number,
  currency: "USD" | "ZWL" = "USD",
  locale: Locale = "en"
): string {
  const localeMap: Record<Locale, string> = {
    en: "en-US",
    sn: "en-ZW",
    nd: "en-ZW",
  }

  return new Intl.NumberFormat(localeMap[locale], {
    style: "currency",
    currency,
  }).format(amount)
}

/**
 * React hook for translations (client-side)
 */
export function useTranslation(locale: Locale = "en") {
  return {
    t: (key: string) => t(key, locale),
    locale,
    locales,
    localeNames,
  }
}
