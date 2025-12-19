import { NetworkData, NetworkNode, NetworkEdge } from "../types/network";

export const CURRENT_USER_ID = "timur-kakokho";

// (shortened: same data structure as in main app, can be expanded as needed)
export const MOCK_NETWORK_NODES: NetworkNode[] = [
  {
    id: "timur-kakokho",
    name: "Тимур Какохо",
    username: "timur-kakokho",
    about: "IT юрист | Эксперт по цифровому праву",
    avatarUrl:
      "https://s3.twcstorage.ru/0e561111-fps/profile-avatar/timur-kakokho.jpeg?auto=compress&cs=tinysrgb&w=200",
    role: "IT-юрист",
    company: "Независимый консультант",
    level: 1,
    connectionType: [],
    communities: ["IT", "IT-юристы", "ТК РФ"],
    isCurrentUser: true,
  },
];

export const MOCK_NETWORK_EDGES: NetworkEdge[] = [];

export const MOCK_NETWORK_DATA: NetworkData = {
  nodes: MOCK_NETWORK_NODES,
  edges: MOCK_NETWORK_EDGES,
};


