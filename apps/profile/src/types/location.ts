export enum LocationTypeEnum {
  city = "city",
  country = "country",
}

export interface LocationItem {
  type: LocationTypeEnum;
  id: number;
  name: string;
}

export interface ReferenceListItem {
  id: number;
  name: string;
  country?: string;
  code?: string;
  population?: number;
}
