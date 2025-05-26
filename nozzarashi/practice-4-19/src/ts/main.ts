import { UL_ELEMENTS, FORMS } from './components/constants';
import { sendMessageToServer } from './websokets';
import { ProcessedMessage } from './types/user-data';

function handleFormSubmit(event: SubmitEvent) {
  event.preventDefault();
  sendMessageToServer();
}

function createMessage(text: string, time: string, currentTemplate: HTMLTemplateElement) {
  if (!(currentTemplate instanceof HTMLTemplateElement)) {
    console.error(`${currentTemplate} должен быть HTMLTemplateElement`);
    return;
  }

  const messageTemplateContent = currentTemplate.content.cloneNode(true);

  if (!(messageTemplateContent instanceof DocumentFragment)) {
    console.error(`${messageTemplateContent} должен быть DocumentFragment`);
    return;
  }

  const messageContent = messageTemplateContent.querySelector('.chat__message-content');
  const messageTime = messageTemplateContent.querySelector('.chat__message-time');

  if (messageContent != null) {
    messageContent.textContent = text;
  }

  if (messageTime != null) {
    messageTime.textContent = time;
  }

  return messageTemplateContent;
}

function displayMessageUI(objectData: ProcessedMessage) {
  if (!(UL_ELEMENTS.CHAT_MESSAGE_INPUT instanceof HTMLInputElement)) {
    console.error(`${UL_ELEMENTS.CHAT_MESSAGE_INPUT} должен быть типа HTMLInputElement`);
    return;
  }

  if (!objectData) return;

  const { senderName, text, time, isMyMessage } = objectData;

  let messageText;
  const messageTime = time;
  let messageTemplateContent;

  if (!(UL_ELEMENTS.MY_MESSAGE_TEMPLATE instanceof HTMLTemplateElement && UL_ELEMENTS.OTHER_MESSAGE_TEMPLATE instanceof HTMLTemplateElement)) {
    return;
  }

  if (isMyMessage) {
    messageText = `${senderName}: ${text}`;
    messageTemplateContent = createMessage(messageText, messageTime, UL_ELEMENTS.MY_MESSAGE_TEMPLATE);
    UL_ELEMENTS.CHAT_MESSAGE_INPUT.value = '';
  } else {
    messageText = `${senderName}:${text}`;
    messageTemplateContent = createMessage(messageText, messageTime, UL_ELEMENTS.OTHER_MESSAGE_TEMPLATE);
  }

  if (!(messageText != undefined)) {
    return;
  }

  if (messageTemplateContent) UL_ELEMENTS.CHAT_BODY?.append(messageTemplateContent);

  if (UL_ELEMENTS.CHAT_BODY != null) {
    UL_ELEMENTS.CHAT_BODY.scrollTop = UL_ELEMENTS.CHAT_BODY?.scrollHeight;
  }

  if (UL_ELEMENTS.CHAT_MESSAGE_INPUT instanceof HTMLInputElement) {
  }
}

FORMS.CHAT_MESSAGE?.addEventListener('submit', handleFormSubmit);

export { displayMessageUI };

// =========

// FIXME: При смене ника, данные обновляются после обновления страницы, а не сразу
//TODO: Не реализованы кнопки "настройка" и "выйти"
