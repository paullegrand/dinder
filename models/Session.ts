export interface Session {
  swipes: {
    [food: string]: {
      [user: string]: boolean;
    };
  };
}
