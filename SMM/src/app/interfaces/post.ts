export interface IPost {
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
  timed?: boolean;
  keywords: string[];
  posted_by: string;
  posted_on: string;
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
