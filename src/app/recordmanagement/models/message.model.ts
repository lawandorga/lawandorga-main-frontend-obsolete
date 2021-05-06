interface NormalSender {
  id: number;
  name: string;
  email: string;
}

type Sender = NormalSender | null;

export interface Message {
  id: number;
  message: string;
  sender: Sender;
  created_on: string;
  record: number;
}
