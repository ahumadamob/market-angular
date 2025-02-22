export interface ApiResponse<T> {
  status: number;
  messages: {
    type: string;
    field?: string;
    content: string;
  }[];
  data: T;
}