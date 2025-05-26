import Cookies from 'js-cookie';
import { UL_ELEMENTS } from './components/constants';
import { displayMessageUI } from './main';
import { format } from 'date-fns';
import { getUserDataFromCookie } from './helpers';
import { ProcessedMessage } from './types/user-data';

let socket: WebSocket | null = null;

function reconnectToServer() {
  setTimeout(() => {
    connectToServer();
  }, 1000);
}

async function connectToServer() {
  const token = Cookies.get('token');
  const URL = 'wss://edu.strada.one/websockets?';
  if (!token) {
    return;
  }

  if (socket && (socket.readyState === WebSocket.CONNECTING || socket.readyState === WebSocket.OPEN)) {
    socket.removeEventListener('message', handleWebSocketMessage);
    socket.removeEventListener('close', reconnectToServer);

    socket.close();
    socket = null;
  }

  socket = new WebSocket(`${URL}${token}`);

  socket.addEventListener('message', handleWebSocketMessage);

  socket.addEventListener('close', reconnectToServer);
}

function validateMessageBeforeSend(inputElement: HTMLInputElement | null): string | undefined {
  if (!(inputElement instanceof HTMLInputElement)) {
    console.error(`Предоставленный элемент ${inputElement} не является объектным типом: HTMLInputElement или равен null.`);
    return;
  }

  let messageValue: string = inputElement.value;

  if (messageValue.trim() === '') {
    inputElement.value = '';
  }

  return messageValue;
}

function sendMessageToServer() {
  try {
    if (UL_ELEMENTS.CHAT_MESSAGE_INPUT instanceof HTMLInputElement) {
      const messageInput = validateMessageBeforeSend(UL_ELEMENTS.CHAT_MESSAGE_INPUT);
      socket.send(JSON.stringify({ text: `${messageInput}` }));
    }
  } catch (error) {
    console.error(error);
    alert(error);
  }
}

function processIncomingMessage(eventData: string): ProcessedMessage | null {
  try {
    const parsedData = JSON.parse(eventData);

    const senderName = parsedData.user.name;
    const textValue = parsedData.text;
    const textSendTime = format(parsedData.createdAt, 'HH:mm');

    const myEmail = getUserDataFromCookie().email;
    const senderEmail = parsedData.user.email;

    const isMyMessage = myEmail === senderEmail;

    return { senderName, text: textValue, time: textSendTime, isMyMessage };
  } catch {
    return null;
  }
}

function handleWebSocketMessage(event: MessageEvent) {
  try {
    const messageObjWithProcessedData = processIncomingMessage(event.data);

    if (messageObjWithProcessedData) displayMessageUI(messageObjWithProcessedData);
  } catch (error) {
    console.error(error);
  }
}

export { socket, sendMessageToServer, connectToServer };
