import React from "react";
import update from 'react-addons-update';
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "/imports/components/Grid/GridItem.jsx";
import GridContainer from "/imports/components/Grid/GridContainer.jsx";
import CustomInput from "/imports/components/CustomInput/CustomInput.jsx";
import Card from "/imports/components/Card/Card.jsx";
import CardHeader from "/imports/components/Card/CardHeader.jsx";
import CardBody from "/imports/components/Card/CardBody.jsx";
import CardFooter from "/imports/components/Card/CardFooter.jsx";
import { EditorState } from 'draft-js';
import Button from "@material-ui/core/Button";
import QuizQuestionEditor from "./QuizQuestionEditor";
import QuizParagraphEditor from "./QuizParagraphEditor";
import { ANSWER_TYPES } from "./AnswerTypes";
import { connect } from "react-redux";
import { addParagraph, changeParagraphEditorState } from "/imports/actions";

const styles = {
  cardCategoryWhite: {/*todo remove?*/
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {/*todo remove?*/
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

class QuizEditor extends React.PureComponent {
  onParagraphRemove = (paragraphNumber) =>
    this.setState((state) => {
        const paragraphIdx = (paragraphNumber - 1);

        return update(state, { paragraphs: { $splice: [[paragraphIdx, 1]] } });
      }
    );

  newBlankParagraph = () => ({ editorState: EditorState.createEmpty() });

  onQuestionCreate = () => this.setState(
    (state) => update(state, { questions: { $push: [this.newBlankQuestion()] } })
  );

  onQuestionEditorStateChange = (questionNumber, editorState) =>
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        return update(state, { questions: { [questionIdx]: { editorState: { $set: editorState } } } });
      }
    );

  onQuestionRemove = (questionNumber) =>
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        return update(state, { questions: { $splice: [[questionIdx, 1]] } });
      }
    );

  newBlankQuestion = () => ({
    editorState: EditorState.createEmpty(),
    answers: { type: ANSWER_TYPES.SINGLE_CHOICE, items: [] },
  });

  onAnswerAdd = (questionNumber, title, checked) =>
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        return update(
          state,
          { questions: { [questionIdx]: { answers: { items: { $push: [{ title, checked }] } } } } }
        );
      }
    );

  onAnswerRemove = (questionNumber, answerNumber) =>
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        const answerIdx = (answerNumber - 1);

        return update(
          state,
          { questions: { [questionIdx]: { answers: { items: { $splice: [[answerIdx, 1]] } } } } }
        );
      }
    );

  onAnswerTitleChange = (questionNumber, answerNumber, title) =>
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        const answerIdx = (answerNumber - 1);

        return update(
          state,
          { questions: { [questionIdx]: { answers: { items: { [answerIdx]: { title: { $set: title } } } } } } }
        );
      }
    );

  onAnswerCheckStateChange = (questionNumber, answerNumber, checked) => {
    this.setState((state) => {
        const questionIdx = (questionNumber - 1);

        const answerIdx = (answerNumber - 1);

        const answerType = state.questions[questionIdx].answers.type;

        const updateAnswerItems = (answerItems) => {
          return answerItems.map((answerItem, idx) => {
            let newCheckedState;

            if (idx === answerIdx) {
              newCheckedState = checked;
            } else {
              if (answerType === ANSWER_TYPES.SINGLE_CHOICE) {
                newCheckedState = false;
              } else {
                newCheckedState = answerItem.checked;
              }
            }

            return ({ ...answerItem, checked: newCheckedState });
          });
        };

        return update(
          state,
          { questions: { [questionIdx]: { answers: { items: { $apply: updateAnswerItems } } } } }
        );
      }
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridContainer justify="space-around">
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Edit Quiz</h4>
                <p className={classes.cardCategoryWhite}>Complete your quiz</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Title"
                      id="title"
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Enter description here"
                      id="about-me"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        multiline: true,
                        rows: 5
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                {/*<Button color="primary">Update Profile</Button>*/}
              </CardFooter>
            </Card>
          </GridItem>

          {this.props.paragraphs.allIds.map((id, idx) =>
            (<GridItem key={id} xs={12} sm={12} md={8}>
              <QuizParagraphEditor id={id} number={idx + 1}/>
            </GridItem>)
          )}

          <GridItem xs={12} sm={12} md={8}>
            <Button variant="contained" color="primary" onClick={this.props.onParagraphCreate}>
              Add new paragraph
            </Button>
          </GridItem>

          {[/*this.state.questions*/].map((question, questionIdx) =>
            (<GridItem key={questionIdx} xs={12} sm={12} md={8}>
              <QuizQuestionEditor
                number={questionIdx + 1}
                question={question}
                onQuestionEditorStateChange={this.onQuestionEditorStateChange}
                onQuestionRemove={this.onQuestionRemove}
                onAnswerAdd={this.onAnswerAdd}
                onAnswerRemove={this.onAnswerRemove}
                onAnswerTitleChange={this.onAnswerTitleChange}
                onAnswerCheckStateChange={this.onAnswerCheckStateChange}
              />
            </GridItem>)
          )}

          <GridItem xs={12} sm={12} md={8}>
            <Button variant="contained" color="primary" onClick={this.onQuestionCreate}>
              Add new question
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    paragraphs: state.paragraphs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onParagraphCreate: () => {
      dispatch(addParagraph());
    },
  }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizEditor));
