export type Post = {
  id: string;
  title: string;
  createdAt: string;
  categories: Category[];
  content: string;
  thumbnail: { url: string; height: number; width: number}
}

export type Category = {
  id: string;
  name: string;
};