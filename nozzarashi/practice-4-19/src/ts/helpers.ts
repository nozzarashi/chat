import Cookies from 'js-cookie';
import { UserData } from './types/user-data';

interface ChangeElementStyle {
  elementDisplay?: string;
  elementText?: string;
  elementTextColor?: string;
  elementHideDelay?: number;
}

function changeInfoMessageStylesAndContent(currentElement: HTMLElement, options: ChangeElementStyle) {
  const { elementDisplay = 'block', elementText, elementTextColor, elementHideDelay = 3000 } = options;

  currentElement.style.display = elementDisplay;

  if (elementTextColor != undefined) {
    currentElement.style.color = elementTextColor;
  }

  if (elementText != undefined) {
    currentElement.textContent = elementText;
  }

  setTimeout(() => {
    currentElement.style.display = 'none';
  }, elementHideDelay);
}

function getUserDataFromCookie(): UserData {
  const userDataFromCookies = Cookies.get('userData');

  if (!userDataFromCookies) {
    throw new Error(`Данных пользователя нет в куки`);
  }

  return JSON.parse(userDataFromCookies);
}

export { changeInfoMessageStylesAndContent, getUserDataFromCookie };
