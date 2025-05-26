interface UserData {
  id: string | number;
  name: string;
  email: string;
  token: string | number;
}

interface MessagesStructure {
  createdAt: string;
  text: string;
  updatedAt: string;
  user: { email: string; name: string };
  __v: number;
  _id: string;
}

interface ProcessedMessage {
  senderName: string;
  text: string;
  time: string;
  isMyMessage: boolean;
}

export { UserData, MessagesStructure, ProcessedMessage };
