import { UL_ELEMENTS, FORMS } from './components/constants';
import { changeInfoMessageStylesAndContent } from './helpers';

async function makeRequestToServer() {
  try {
    const URL = 'https://edu.strada.one/api/user';

    if (!(UL_ELEMENTS.AUTHORIZATION_INPUT instanceof HTMLInputElement)) {
      console.error(
        `Предоставленный элемент: ${UL_ELEMENTS.AUTHORIZATION_INPUT} не является объектным типом: HTMLInputElement или равен null.`
      );
      return;
    }

    const emailForSend = {
      email: UL_ELEMENTS.AUTHORIZATION_INPUT?.value,
    };

    const spanInfoMessage = UL_ELEMENTS.AUTHORIZATION_INFO_MESSAGE;

    if (UL_ELEMENTS.AUTHORIZATION_INPUT?.value === '') {
      if (!(spanInfoMessage instanceof HTMLSpanElement)) {
        console.error(
          `Предоставленный элемент: ${UL_ELEMENTS.AUTHORIZATION_INFO_MESSAGE} не является объектным типом: HTMLSpanElement или равен null.`
        );

        return;
      }

      changeInfoMessageStylesAndContent(spanInfoMessage, {
        elementDisplay: 'block',
        elementText: 'Укажите корректную почту',
        elementTextColor: 'red',
      });
      return;
    }

    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(emailForSend),
    });

    if (!response.ok) {
      changeInfoMessageStylesAndContent(spanInfoMessage!, {
        elementDisplay: 'block',
        elementText: 'Что то пошло не так, обновите страницу',
        elementTextColor: 'red',
      });
      return;
    }

    if (spanInfoMessage !== null) {
      changeInfoMessageStylesAndContent(spanInfoMessage, {
        elementDisplay: 'block',
        elementText: 'Успешно! Ключ для входа был отправлен на почту',
        elementTextColor: 'green',
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function formAuthorizationHandler(event: SubmitEvent) {
  event.preventDefault();
  makeRequestToServer();
}

FORMS.AUTHORIZATION?.addEventListener('submit', formAuthorizationHandler);

// =============

function switchWindowToConfirmation() {
  if (
    UL_ELEMENTS.CHAT_CONFIRMATION_DIALOG instanceof HTMLDialogElement &&
    UL_ELEMENTS.CHAT_AUTHORIZATION_DIALOG instanceof HTMLDialogElement
  ) {
    UL_ELEMENTS.CHAT_CONFIRMATION_DIALOG.open = true;
    UL_ELEMENTS.CHAT_AUTHORIZATION_DIALOG.open = false;
  }
}
UL_ELEMENTS.AUTHORIZATION_SWITCH_BTN?.addEventListener('click', switchWindowToConfirmation);
