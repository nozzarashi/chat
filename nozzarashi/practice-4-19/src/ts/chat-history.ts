import { UL_ELEMENTS } from './components/constants';
import { format } from 'date-fns';
import { getUserDataFromCookie } from './helpers';
import { MessagesStructure } from './types/user-data';

let messages: MessagesStructure[] = [];
let startingMessagesRenderPosition = 20;

const MESSAGES_RENDER_START_INDEX = 0;
const MESSAGES_PER_CHUNK = 20;
let isMessageInfoPrinted = false;

async function getMessagesHistory() {
  try {
    const userData = getUserDataFromCookie();
    const URL = 'https://edu.strada.one/api/messages/';
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.token}`,
      },
    });

    const data = await response.json();

    messages = data.messages;
  } catch (error) {
    console.error(error);
  }
}

function renderMessage(currentTemplate: HTMLTemplateElement, message: MessagesStructure, container: HTMLElement) {
  if (!(currentTemplate instanceof HTMLTemplateElement)) {
    console.error(`${currentTemplate} должен быть HTMLTemplateElement`);
    return;
  }

  const messageWrapper = document.createElement('div');
  messageWrapper.className = 'messages-wrapper';
  const templateContent = currentTemplate.content.cloneNode(true);

  if (!(templateContent instanceof DocumentFragment)) {
    console.error(`${templateContent} должен быть HTMLTemplateElement`);
    return;
  }

  const messageContent = templateContent.querySelector('.chat__message-content');
  const messageTime = templateContent.querySelector('.chat__message-time');

  if (messageContent && message.user.email === getUserDataFromCookie().email) {
    messageContent.textContent = `${message.user.name}: ${message.text}`;
  } else if (messageContent) {
    messageContent.textContent = `${message.user.name}: ${message.text}`;
  }

  if (messageTime) {
    messageTime.textContent = format(message.createdAt, 'kk:mm');
  }

  messageWrapper.append(templateContent);
  container.prepend(messageWrapper);
}

function renderInitialMessages() {
  try {
    if (!messages) {
      return;
    }

    const slicedMessages = messages.slice(MESSAGES_RENDER_START_INDEX, MESSAGES_PER_CHUNK);
    const userEmail = getUserDataFromCookie().email;

    if (UL_ELEMENTS.CHAT_MESSAGES_CONTAINER == null) {
      console.error(`Элемент ${UL_ELEMENTS.CHAT_MESSAGES_CONTAINER} не найден`);
      return;
    }

    for (const obj of slicedMessages) {
      if (obj.user.email !== userEmail && UL_ELEMENTS.OTHER_MESSAGE_TEMPLATE instanceof HTMLTemplateElement) {
        renderMessage(UL_ELEMENTS.OTHER_MESSAGE_TEMPLATE, obj, UL_ELEMENTS.CHAT_MESSAGES_CONTAINER);
      } else if (UL_ELEMENTS.MY_MESSAGE_TEMPLATE instanceof HTMLTemplateElement) {
        renderMessage(UL_ELEMENTS.MY_MESSAGE_TEMPLATE, obj, UL_ELEMENTS.CHAT_MESSAGES_CONTAINER);
      }
    }

    if (UL_ELEMENTS.CHAT_BODY != null) {
      UL_ELEMENTS.CHAT_BODY.scrollTop = UL_ELEMENTS.CHAT_BODY?.scrollHeight;
    }
  } catch (error) {
    console.error(error);
  }
}

function renderMoreMessagesOnScroll() {
  if (UL_ELEMENTS.CHAT_BODY?.scrollTop !== 0) {
    return;
  }

  if (startingMessagesRenderPosition > messages.length) {
    if (!isMessageInfoPrinted) {
      const infoMessage = document.createElement('div');
      infoMessage.id = 'chat-history-info';
      infoMessage.textContent = 'Вся история загружена';
      UL_ELEMENTS.CHAT_BODY.prepend(infoMessage);
      isMessageInfoPrinted = true;
    }
    return;
  }

  const oldScrollHeight = UL_ELEMENTS.CHAT_BODY.scrollHeight;
  const oldScrollTop = UL_ELEMENTS.CHAT_BODY.scrollTop;

  const slicedMessages = messages.slice(startingMessagesRenderPosition, startingMessagesRenderPosition + MESSAGES_PER_CHUNK);
  const userEmail = getUserDataFromCookie().email;

  if (UL_ELEMENTS.CHAT_MESSAGES_CONTAINER === null) {
    console.error(`Элемент ${UL_ELEMENTS.CHAT_MESSAGES_CONTAINER} не найден`);
    return;
  }

  for (const obj of slicedMessages) {
    if (obj.user.email !== userEmail && UL_ELEMENTS.OTHER_MESSAGE_TEMPLATE instanceof HTMLTemplateElement) {
      renderMessage(UL_ELEMENTS.OTHER_MESSAGE_TEMPLATE, obj, UL_ELEMENTS.CHAT_MESSAGES_CONTAINER);
    } else if (UL_ELEMENTS.MY_MESSAGE_TEMPLATE instanceof HTMLTemplateElement) {
      renderMessage(UL_ELEMENTS.MY_MESSAGE_TEMPLATE, obj, UL_ELEMENTS.CHAT_MESSAGES_CONTAINER);
    }
  }

  startingMessagesRenderPosition += MESSAGES_PER_CHUNK;

  const newScrollHeight = UL_ELEMENTS.CHAT_BODY.scrollHeight;
  const differenceNewAndOldScrollHeight = newScrollHeight - oldScrollHeight;

  UL_ELEMENTS.CHAT_BODY.scrollTop = oldScrollTop + differenceNewAndOldScrollHeight;
}

async function renderHistoryHandler() {
  await getMessagesHistory();
  renderInitialMessages();
}

UL_ELEMENTS.CHAT_BODY?.addEventListener('scroll', renderMoreMessagesOnScroll);

export { renderHistoryHandler };
