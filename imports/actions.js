export const ADD_PARAGRAPH = "ADD_PARAGRAPH";

export const CHANGE_PARAGRAPH_EDITOR_STATE = "CHANGE_PARAGRAPH_EDITOR_STATE";

export const REMOVE_PARAGRAPH = "REMOVE_PARAGRAPH";

export function addParagraph() {
  return { type: ADD_PARAGRAPH };
}

export function changeParagraphEditorState(id, state) {
  return { type: CHANGE_PARAGRAPH_EDITOR_STATE, id, state };
}

export function removeParagraph(id) {
  return { type: REMOVE_PARAGRAPH, id };
}
