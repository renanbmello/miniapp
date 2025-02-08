export type Space = {
    id: string;
    name: string;
    avatar: string;
    network: string;
    admins: string[];
    moderators: string[];
    symbol: string;
    terms: string | null;
  };