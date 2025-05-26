import { FORMS, UL_ELEMENTS } from './components/constants';
import { changeInfoMessageStylesAndContent, getUserDataFromCookie } from './helpers';

async function formOptionsHandler(event: SubmitEvent) {
  event.preventDefault();

  const isChangedName = await changeNameOnServer();

  if (isChangedName) {
    switchOptionsWindowToChat();
  }
}

async function changeNameOnServer(): Promise<boolean | null> {
  if (!(UL_ELEMENTS.OPTIONS_CHANGE_NAME_INPUT instanceof HTMLInputElement)) {
    console.error(`Предоставленный элемент: ${UL_ELEMENTS.OPTIONS_CHANGE_NAME_INPUT} не является объектным типом: HTMLInputElement или равен null.`);
    return null;
  }

  if (UL_ELEMENTS.OPTIONS_CHANGE_NAME_INPUT.value.trim() == '' && UL_ELEMENTS.OPTIONS_CHANGE_NAME_INFO_MESSAGE instanceof HTMLSpanElement) {
    changeInfoMessageStylesAndContent(UL_ELEMENTS.OPTIONS_CHANGE_NAME_INFO_MESSAGE, {
      elementDisplay: 'block',
      elementText: 'Введите корректное имя',
      elementTextColor: 'red',
    });
    UL_ELEMENTS.OPTIONS_CHANGE_NAME_INPUT.value = '';
    return false;
  }

  const nameInputValue = UL_ELEMENTS.OPTIONS_CHANGE_NAME_INPUT.value;
  const URL = 'https://edu.strada.one/api/user';

  const parsedUserData = getUserDataFromCookie();

  const response = await fetch(URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${parsedUserData.token}`,
    },

    body: JSON.stringify({ name: nameInputValue }),
  });

  if (!response.ok) {
    console.error(`Неудачный запрос, код ошибки: ${response.status}`);
    return false;
  }

  if (UL_ELEMENTS.OPTIONS_CHANGE_NAME_INFO_MESSAGE)
    changeInfoMessageStylesAndContent(UL_ELEMENTS.OPTIONS_CHANGE_NAME_INFO_MESSAGE, {
      elementDisplay: 'block',
      elementText: 'Успешная смена имени',
      elementTextColor: 'green',
    });

  return true;
}

function switchOptionsWindowToChat() {
  if (UL_ELEMENTS.CHAT_WRAPPER && UL_ELEMENTS.CHAT_OPTIONS_DIALOG instanceof HTMLDialogElement) {
    UL_ELEMENTS.CHAT_WRAPPER.style.display = 'flex';
    UL_ELEMENTS.CHAT_OPTIONS_DIALOG.open = false;
  }
}

FORMS.OPTIONS?.addEventListener('submit', formOptionsHandler);
