export const ADD_PARAGRAPH_TO_EDITING_QUIZ = "ADD_PARAGRAPH_TO_EDITING_QUIZ";

export const CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ = "CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ";

export const REMOVE_PARAGRAPH_FROM_EDITING_QUIZ = "REMOVE_PARAGRAPH_FROM_EDITING_QUIZ";

export function addParagraph() {
  return { type: ADD_PARAGRAPH_TO_EDITING_QUIZ };
}

export function changeParagraphEditorState(id, state) {
  return { type: CHANGE_PARAGRAPH_EDITOR_STATE_IN_EDITING_QUIZ, id, state };
}

export function removeParagraph(id) {
  return { type: REMOVE_PARAGRAPH_FROM_EDITING_QUIZ, id };
}
