// Mock data for resource catalog

import type { Resource } from "../types/resource"

export const MOCK_RESOURCES: Resource[] = [
  {
    id: "1",
    name: "Tax Service (FNS)",
    description: "Federal Tax Service - tax payments, declarations, account monitoring",
    category: "government",
    region: "Federal",
    mainUrl: "https://www.nalog.gov.ru",
    links: [
      { label: "Official Website", url: "https://www.nalog.gov.ru", type: "official" },
      { label: "Personal Account", url: "https://lkfl2.nalog.ru", type: "service" },
      { label: "Tax Monitoring", url: "https://service.nalog.ru/bi.do", type: "service" },
      { label: "Payment Receipts", url: "https://service.nalog.ru/payment/", type: "service" },
      { label: "Tax Calculator", url: "https://www.nalog.gov.ru/rn77/service/calc/", type: "other" }
    ],
    contacts: {
      phone: "8-800-222-22-22 (Hotline)",
      hours: "Monday - Friday 09:00-18:00"
    }
  },
  {
    id: "2",
    name: "Arbitration Court",
    description: "Arbitration Court of the Republic of Tatarstan",
    category: "legal",
    region: "Tatarstan",
    mainUrl: "https://tatarstan.arbitr.ru",
    links: [
      { label: "Official Website", url: "https://tatarstan.arbitr.ru", type: "official" },
      { label: "Case Search", url: "https://tatarstan.arbitr.ru/search", type: "service" },
      { label: "Decision Database", url: "https://tatarstan.arbitr.ru/decisions", type: "service" },
      { label: "Hearing Schedule", url: "https://tatarstan.arbitr.ru/schedule", type: "service" },
      { label: "Fee Schedule", url: "https://tatarstan.arbitr.ru/fees", type: "other" },
      { label: "Vacancies", url: "https://tatarstan.arbitr.ru/vacancies", type: "other" }
    ],
    contacts: {
      phone: "78435335000 (Reception); 78435335050 (Office)",
      address: "420107, Republic of Tatarstan, Kazan, Novo-Pesochnaya str., 40",
      hours: "Monday - Thursday 08:00-17:00; Friday 08:00-15:45; Lunch 11:00-11:45"
    }
  },
  {
    id: "3",
    name: "Supreme Court",
    description: "Supreme Court of the Republic of Tatarstan",
    category: "legal",
    region: "Tatarstan",
    mainUrl: "https://vs.tat.sudrf.ru",
    links: [
      { label: "Official Website", url: "https://vs.tat.sudrf.ru", type: "official" },
      { label: "Court Cases", url: "https://vs.tat.sudrf.ru/cases", type: "service" },
      { label: "District Court Fees", url: "https://vs.tat.sudrf.ru/requisites", type: "other" },
      { label: "Contacts", url: "https://vs.tat.sudrf.ru/contacts", type: "other" }
    ],
    contacts: {
      phone: "78432887777 (Hotline)",
      address: "420015, Republic of Tatarstan, Kazan, Pushkina str., 72/2",
      hours: "Monday - Thursday 08:00-17:00; Friday 08:00-16:00; Lunch 12:00-12:45"
    }
  },
  {
    id: "4",
    name: "Bailiff Service (FSSP)",
    description: "Federal Bailiff Service - enforcement proceedings",
    category: "legal",
    region: "Federal",
    mainUrl: "https://fssp.gov.ru",
    links: [
      { label: "Official Website", url: "https://fssp.gov.ru", type: "official" },
      { label: "Enforcement Proceedings", url: "https://fssp.gov.ru/iss/ip", type: "service" }
    ]
  },
  {
    id: "5",
    name: "Legal Practice Database",
    description: "Arbitration and civil court decisions archive",
    category: "legal",
    region: "Federal",
    mainUrl: "https://sudact.ru",
    links: [
      { label: "Official Website", url: "https://sudact.ru", type: "official" },
      { label: "Case Search", url: "https://sudact.ru/search", type: "service" },
      { label: "Criminal Law Practice", url: "https://sudact.ru/practice/criminal", type: "other" }
    ]
  },
  {
    id: "6",
    name: "Tax Calculator",
    description: "Various tax and fee calculators",
    category: "finance",
    region: "Federal",
    mainUrl: "https://calculator-ipoteki.ru",
    links: [
      { label: "Official Website", url: "https://calculator-ipoteki.ru", type: "official" },
      { label: "Arbitration Court Fee (Art.333.21)", url: "https://calculator-ipoteki.ru/gosposhlina-arbitraj", type: "service" },
      { label: "District Court Fee (Art.333.19)", url: "https://calculator-ipoteki.ru/gosposhlina-sud", type: "service" },
      { label: "Article 395 of Civil Code", url: "https://calculator-ipoteki.ru/395-gk", type: "service" },
      { label: "Monetary Obligation Interest (317.1 CC)", url: "https://calculator-ipoteki.ru/317-gk", type: "service" },
      { label: "Law.ru Calculator", url: "https://pravo.ru/calc/gosshlina", type: "other" },
      { label: "Zakonius Calculator", url: "https://zakonius.ru/calculator/gosposhlina", type: "other" }
    ]
  },
  {
    id: "7",
    name: "Public Services Portal",
    description: "Unified portal for government and municipal services",
    category: "government",
    region: "Federal",
    mainUrl: "https://gosuslugi.ru",
    links: [
      { label: "Official Website", url: "https://gosuslugi.ru", type: "official" },
      { label: "Personal Account", url: "https://lk.gosuslugi.ru", type: "service" },
      { label: "Service Catalog", url: "https://gosuslugi.ru/catalog", type: "service" },
      { label: "Documents", url: "https://gosuslugi.ru/documents", type: "other" }
    ],
    contacts: {
      phone: "8-800-100-70-10 (24/7 Support)",
      hours: "24/7 Online"
    }
  },
  {
    id: "8",
    name: "Pension Fund",
    description: "Pension and social benefits information",
    category: "government",
    region: "Federal",
    mainUrl: "https://pfr.gov.ru",
    links: [
      { label: "Official Website", url: "https://pfr.gov.ru", type: "official" },
      { label: "Personal Account", url: "https://lk.pfr.gov.ru", type: "service" },
      { label: "Pension Calculator", url: "https://pfr.gov.ru/calculator", type: "other" }
    ],
    contacts: {
      phone: "8-800-600-03-89 (Hotline)"
    }
  }
]

export const REGIONS = [
  "All Regions",
  "Federal",
  "Tatarstan",
  "Moscow",
  "Saint Petersburg"
]

export const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "government", label: "Government Services" },
  { value: "legal", label: "Legal Services" },
  { value: "finance", label: "Finance & Banking" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "utilities", label: "Utilities" },
  { value: "transport", label: "Transport" },
  { value: "other", label: "Other" }
]
