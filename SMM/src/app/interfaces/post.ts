export interface Post {
  _id: string;
  title: string;
  content: {
    text?: string;
    img?: string;
    position?: {
      latitude: number;
      longitude: number;
    };
  };
  keywords: string[];
  posted_by: string;
  appartains_to: string[];
  tagged: string[];
  date: string;
  // remove?
  reactions: {
    user_id: string;
    value: number;
  }[];
  popular: boolean;
  unpopular: boolean;
}
