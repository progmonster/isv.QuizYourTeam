export const ADD_PARAGRAPH = "ADD_PARAGRAPH";

export const CHANGE_PARAGRAPH_EDITOR_STATE = "CHANGE_PARAGRAPH_EDITOR_STATE";

export function addParagraph() {
  return { type: ADD_PARAGRAPH };
}

export function changeParagraphEditorState(paragraphNumber, state) {
  return { type: CHANGE_PARAGRAPH_EDITOR_STATE, paragraphNumber, state };
}