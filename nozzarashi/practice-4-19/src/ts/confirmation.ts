import { FORMS, UL_ELEMENTS } from './components/constants';
import Cookies from 'js-cookie';
import { changeInfoMessageStylesAndContent } from './helpers';
import { UserData } from './types/user-data';
import { renderHistoryHandler } from './chat-history';
import { connectToServer } from './websokets';

async function formSubmitHandler(event: SubmitEvent) {
  try {
    event.preventDefault();
    saveTokenInCookies();
    await saveUserDataInCookies();
    renderHistoryHandler();
    await connectToServer();
  } catch (error) {
    console.error(error);
  }
}

function saveTokenInCookies() {
  if (!(UL_ELEMENTS.CONFIRMATION_INPUT instanceof HTMLInputElement)) {
    console.error(`Предоставленный элемент: ${UL_ELEMENTS.CONFIRMATION_INPUT} не является объектным типом: HTMLInputElement или равен null.`);

    return;
  }

  const tokenInputValue = UL_ELEMENTS.CONFIRMATION_INPUT.value;

  Cookies.set('token', tokenInputValue, { expires: 7 });
}

async function returnUserData() {
  const URL = 'https://edu.strada.one/api/user/me';
  const tokenFromUser = Cookies.get('token');

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenFromUser}`,
    },
  });

  if (response.status === 401) {
    if (UL_ELEMENTS.CONFIRMATION_INFO_MESSAGE !== null) {
      changeInfoMessageStylesAndContent(UL_ELEMENTS.CONFIRMATION_INFO_MESSAGE, {
        elementDisplay: 'block',
        elementText: 'Некорректный токен',
        elementTextColor: 'red',
      });
    }
  } else if (!response.ok) {
    throw new Error(`Код ошибки: ${response.status}`);
  }

  if (response.ok) {
    switchConfirmationWindow();
  }

  return await response.json();
}

async function saveUserDataInCookies() {
  try {
    const data = await returnUserData();

    const userData: UserData = {
      id: data._id,
      name: data.name,
      email: data.email,
      token: data.token,
    };

    Cookies.set('userData', JSON.stringify(userData), { expires: 7 });
  } catch (error) {
    console.error(error);
  }
}

FORMS.CONFIRMATION?.addEventListener('submit', formSubmitHandler);

function switchConfirmationWindow() {
  if (UL_ELEMENTS.CHAT_CONFIRMATION_DIALOG instanceof HTMLDialogElement && UL_ELEMENTS.CHAT_OPTIONS_DIALOG instanceof HTMLDialogElement) {
    UL_ELEMENTS.CHAT_CONFIRMATION_DIALOG.open = false;
    UL_ELEMENTS.CHAT_OPTIONS_DIALOG.open = true;
  }
}

function exitConfirmationWindow() {
  if (UL_ELEMENTS.CHAT_CONFIRMATION_DIALOG instanceof HTMLDialogElement && UL_ELEMENTS.CHAT_AUTHORIZATION_DIALOG instanceof HTMLDialogElement) {
    UL_ELEMENTS.CHAT_CONFIRMATION_DIALOG.open = false;
    UL_ELEMENTS.CHAT_AUTHORIZATION_DIALOG.open = true;
  }
}

UL_ELEMENTS.CONFIRMATION_CLOSE_BTN?.addEventListener('click', exitConfirmationWindow);

//////////////////
