// Mock data for profile testing
import { BirthdayVisibility, UserAdditionalInfo, UserProfile } from "../../profile/src/types/profile";

export const mockProfileUser: UserProfile = {
  id: "mock-user-123",
  name: "Александр Петров",
  username: "a.petrov",
  avatar_url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
  cover_url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200",
  about: "Предприниматель, инвестор и консультант в области IT и бизнеса. Помогаю компаниям развиваться и масштабироваться.",
  telegram_username: "apetroff",
  profile_type: "entrepreneur",
  badge: ["verified", "premium"],
  created_at: "2023-01-15T10:00:00.000Z",
  cities: [
    { id: "1", name: "Москва", type: "city" },
    { id: "2", name: "Санкт-Петербург", type: "city" }
  ],
  countries: [
    { id: "1", name: "Россия", type: "country" },
    { id: "2", name: "ОАЭ", type: "country" }
  ],
  additional_info: null,
  birthday: "1985-05-15",
  birthday_visibility: BirthdayVisibility.day_month,
  birthday_show_age: true,
  is_following: false
};

export const mockAdditionalInfo: UserAdditionalInfo = {
  contact_info: [
    {
      id: "contact-1",
      type: "email",
      value: "a.petrov@example.com",
      label: "Рабочая почта",
      is_primary: true,
      is_visible: true,
      order_index: 0
    },
    {
      id: "contact-2",
      type: "phone",
      value: "+7 (999) 123-45-67",
      label: "Телефон",
      is_primary: false,
      is_visible: true,
      order_index: 1
    },
    {
      id: "contact-3",
      type: "website",
      value: "https://example.com",
      label: "Личный сайт",
      is_primary: false,
      is_visible: true,
      order_index: 2
    }
  ],
  experience: [
    {
      id: "exp-1",
      company_name: "Tech Innovations Ltd",
      position: "CEO & Founder",
      description: "Основал и развил технологическую компанию с нуля до 100+ сотрудников",
      start_date: "2018-01-01",
      end_date: null,
      is_current: true,
      order_index: 0
    },
    {
      id: "exp-2",
      company_name: "Digital Solutions",
      position: "CTO",
      description: "Руководил технической командой, внедрял новые технологии",
      start_date: "2015-03-01",
      end_date: "2017-12-31",
      is_current: false,
      order_index: 1
    },
    {
      id: "exp-3",
      company_name: "StartUp Accelerator",
      position: "Senior Developer",
      description: "Разработка и поддержка веб-приложений",
      start_date: "2012-06-01",
      end_date: "2015-02-28",
      is_current: false,
      order_index: 2
    }
  ],
  education: [
    {
      id: "edu-1",
      institution_name: "МГУ имени М.В. Ломоносова",
      degree: "Магистр",
      field_of_study: "Прикладная математика и информатика",
      description: "Специализация в области машинного обучения",
      start_date: "2008-09-01",
      end_date: "2013-06-30",
      order_index: 0
    },
    {
      id: "edu-2",
      institution_name: "Stanford University",
      degree: "MBA",
      field_of_study: "Business Administration",
      description: "Executive MBA программа",
      start_date: "2016-01-01",
      end_date: "2017-12-31",
      order_index: 1
    }
  ],
  awards: [
    {
      id: "award-1",
      title: "Предприниматель года",
      issuer: "Forbes Russia",
      description: "Награда за вклад в развитие технологического предпринимательства",
      date_received: "2022-11-15",
      order_index: 0
    },
    {
      id: "award-2",
      title: "Лучший стартап 2020",
      issuer: "TechCrunch",
      description: "Победа в номинации 'Лучший B2B стартап'",
      date_received: "2020-09-20",
      order_index: 1
    }
  ]
};
