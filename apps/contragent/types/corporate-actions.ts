// Type definitions for corporate actions data from DataNewton API (Fedresurs)

export type CorporateActionType =
  | 'FirmLiquidation'
  | 'FirmReorganization'
  | 'FirmRegisterExcludeTermination'
  | 'FirmAutonomousInstitutionCreation'
  | 'FirmCreated'
  | 'FirmRegisterExclude'
  | 'StopOfBusiness'
  | 'FirmAuthoritiesChange'
  | 'UnreliableInformation'
  | 'FirmAuthorizedCapitalDecrease'
  | 'FirmAuthorizedCapitalIncrease'
  | 'FirmSharesAcquisition'
  | 'IntentionExerciseTheRightsOfShareholderNonResident'
  | 'SatisfactionExerciseTheRightsOfShareholderNonResident'
  | 'FirmMembersMeeting'
  | 'SaleOrLeaseEnterprise'
  | 'AnyOther'
  | 'RevocationOfPowerAttorney'
  | string;

export type ParticipantType = 'Company' | 'IndividualEntrepreneur' | 'Person' | 'Appraiser' | 'NonResidentCompany' | 'ForeignSystem' | 'Notary';

export interface ParticipantData {
  fullName?: string;
  fio?: string;
  title?: string;
  inn?: string;
  ogrn?: string;
  ogrnip?: string;
  name?: string;
  latinName?: string;
  countryCodeNum?: string;
  country?: string;
  regNum?: string;
  innOrAnalogue?: string;
}

export interface Participant {
  role?: string;
  type: ParticipantType;
  data: ParticipantData;
}

export interface NotaryInfo {
  name: string;
  title?: string;
}

export interface CorporateAction {
  guid: string;
  number: string;
  msgType: CorporateActionType;
  datePublish: string;
  dateDisclosure?: string;
  annuled: boolean;
  locked: boolean;
  publisher: Participant;
  participants: Participant[];
  text: string;
  contentAdditionalInfo?: {
    companies?: ParticipantData[];
    message?: {
      guid: string;
      number: string;
      datePublish: string;
      type?: {
        name: string;
        canonical: string;
      };
    };
  };
  arbitrManagerInfo?: NotaryInfo;
  notaryInfo?: NotaryInfo;
  messageUrl: string;
  updatedAt: number;
}

export interface CorporateActionsData {
  data: CorporateAction[];
  limit: number;
  offset: number;
  total: number;
  available_count: number;
}

export const CORPORATE_ACTION_TYPE_LABELS: Record<string, string> = {
  FirmLiquidation: 'Ликвидация',
  FirmReorganization: 'Реорганизация',
  FirmRegisterExcludeTermination: 'Прекращение исключения из реестра',
  FirmAutonomousInstitutionCreation: 'Создание автономного учреждения',
  FirmCreated: 'Создание компании',
  FirmRegisterExclude: 'Исключение из реестра',
  StopOfBusiness: 'Прекращение деятельности',
  FirmAuthoritiesChange: 'Изменение органов управления',
  UnreliableInformation: 'Недостоверные сведения',
  FirmAuthorizedCapitalDecrease: 'Уменьшение уставного капитала',
  FirmAuthorizedCapitalIncrease: 'Увеличение уставного капитала',
  FirmSharesAcquisition: 'Приобретение акций',
  IntentionExerciseTheRightsOfShareholderNonResident: 'Намерение осуществить права акционера-нерезидента',
  SatisfactionExerciseTheRightsOfShareholderNonResident: 'Удовлетворение прав акционера-нерезидента',
  FirmMembersMeeting: 'Собрание участников',
  SaleOrLeaseEnterprise: 'Продажа или аренда предприятия',
  AnyOther: 'Прочие сообщения',
  RevocationOfPowerAttorney: 'Отзыв доверенности',
};

export const CORPORATE_ACTION_CATEGORY_COLORS: Record<string, string> = {
  FirmLiquidation: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20',
  FirmReorganization: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20',
  FirmRegisterExclude: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20',
  StopOfBusiness: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20',
  FirmAuthoritiesChange: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
  UnreliableInformation: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20',
  FirmAuthorizedCapitalDecrease: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20',
  FirmAuthorizedCapitalIncrease: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20',
  FirmSharesAcquisition: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
  FirmMembersMeeting: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
  FirmCreated: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20',
  AnyOther: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20',
};
