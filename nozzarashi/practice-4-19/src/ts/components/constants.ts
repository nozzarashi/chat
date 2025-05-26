interface ulElements {
  CHAT_MESSAGE_INPUT: HTMLElement | null;
  AUTHORIZATION_INPUT: HTMLElement | null;
  CONFIRMATION_INPUT: HTMLElement | null;
  OPTIONS_CHANGE_NAME_INPUT: HTMLElement | null;

  AUTHORIZATION_INFO_MESSAGE: HTMLElement | null;
  CONFIRMATION_INFO_MESSAGE: HTMLElement | null;
  OPTIONS_CHANGE_NAME_INFO_MESSAGE: HTMLElement | null;

  AUTHORIZATION_SWITCH_BTN: HTMLElement | null;
  CONFIRMATION_CLOSE_BTN: HTMLElement | null;

  MY_MESSAGE_TEMPLATE: HTMLElement | null;
  OTHER_MESSAGE_TEMPLATE: HTMLElement | null;
  CHAT_BODY: HTMLElement | null;
  CHAT_MESSAGES_CONTAINER: HTMLElement | null;
  GET_CODE_BUTTON: HTMLElement | null;

  CHAT_AUTHORIZATION_DIALOG: HTMLElement | null;
  CHAT_CONFIRMATION_DIALOG: HTMLElement | null;
  CHAT_OPTIONS_DIALOG: HTMLElement | null;
  CHAT_WRAPPER: HTMLElement | null;
}

const UL_ELEMENTS: ulElements = {
  CHAT_MESSAGE_INPUT: document.getElementById('chat-form-input'),
  AUTHORIZATION_INPUT: document.getElementById('chat-authorization-input'),
  CONFIRMATION_INPUT: document.getElementById('chat-confirmation-input'),
  OPTIONS_CHANGE_NAME_INPUT: document.getElementById('chat-options-change-name-input'),

  AUTHORIZATION_INFO_MESSAGE: document.getElementById('authorization-info-message'),
  CONFIRMATION_INFO_MESSAGE: document.getElementById('confirmation-info-message'),
  OPTIONS_CHANGE_NAME_INFO_MESSAGE: document.getElementById('options-change-name-message'),

  AUTHORIZATION_SWITCH_BTN: document.getElementById('authorization-switch-button'),
  CONFIRMATION_CLOSE_BTN: document.getElementById('confirmation-close-button'),

  MY_MESSAGE_TEMPLATE: document.getElementById('my-message-template'),
  OTHER_MESSAGE_TEMPLATE: document.getElementById('other-message-template'),
  CHAT_BODY: document.getElementById('chat-body'),
  CHAT_MESSAGES_CONTAINER: document.getElementById('chat-messages-container'),
  GET_CODE_BUTTON: document.getElementById('getCodeButton'),

  CHAT_AUTHORIZATION_DIALOG: document.getElementById('chat-authorization-dialog'),
  CHAT_CONFIRMATION_DIALOG: document.getElementById('chat-confirmation-dialog'),
  CHAT_OPTIONS_DIALOG: document.getElementById('chat-options-dialog'),
  CHAT_WRAPPER: document.getElementById('chat-wrapper'),
};

interface forms {
  CHAT_MESSAGE: HTMLElement | null;
  AUTHORIZATION: HTMLElement | null;
  CONFIRMATION: HTMLElement | null;
  OPTIONS: HTMLElement | null;
}

const FORMS: forms = {
  CHAT_MESSAGE: document.getElementById('chat-message-form'),
  AUTHORIZATION: document.getElementById('authorization-form'),
  CONFIRMATION: document.getElementById('confirmation-form'),
  OPTIONS: document.getElementById('options-change-name'),
};

// ==========

export { UL_ELEMENTS, FORMS };
