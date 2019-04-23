import withStyles from "@material-ui/core/styles/withStyles";
import React from "react";
import GridItem from "/imports/components/Grid/GridItem.jsx";
import GridContainer from "/imports/components/Grid/GridContainer.jsx";
import Button from "@material-ui/core/Button";
import * as PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { ANSWER_TYPES } from "./AnswerTypes";
import RadioGroup from "@material-ui/core/RadioGroup";
import { addAnswerToEditingQuiz } from "../../actions";
import { connect } from "react-redux";
import SingleChoiceAnswer from "./SingleChoiceAnswer";

const styles = (theme) => ({
  quizAnswersEditor: {
    ...theme.mixins.gutters(),/*todo why?*/
    paddingTop: theme.spacing.unit * 2,/*todo why?*/
    paddingBottom: theme.spacing.unit * 2,/*todo why?*/
  }
});

/*todo implement*/
class _MultipleChoiceAnswerBlock extends React.PureComponent {
  render() {
    return <div />
  }
}

_MultipleChoiceAnswerBlock.propTypes = {
  /*todo*/
};

class QuizAnswersEditor extends React.PureComponent {
  render() {
    const {
      questionId,
      answerType,
      onAnswerAdd,
    } = this.props;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Tabs value={answerType === ANSWER_TYPES.SINGLE_CHOICE ? 0 : 1} onChange={this.handleChange}>
            <Tab label="Single choice" />
            <Tab label="Multiple choice" />
          </Tabs>

          {answerType === ANSWER_TYPES.SINGLE_CHOICE
            ? this._renderSingleChoiceAnswerBlock()
            : <_MultipleChoiceAnswerBlock questionId={questionId} />}
        </GridItem>

        <GridItem xs={12} sm={12} md={8}>
          <Button variant="contained" color="primary"
                  onClick={() => onAnswerAdd("", false)}>
            Add an answer
          </Button>
        </GridItem>
      </GridContainer>
    );
  }

  _renderSingleChoiceAnswerBlock() {
    const {
      questionId,
      answers
    } = this.props;

    return (<RadioGroup
      aria-label="Gender" /*todo*/
      name="gender1" /*todo*/
      /*
            value={0}
            onChange={this.handleChange}
      */
    >
      {answers.allIds.map((answerId) => {
        return (
          <SingleChoiceAnswer
            key={answerId}
            questionId={questionId}
            answerId={answerId}
          />
        );
      })}
    </RadioGroup>)
  }
}

QuizAnswersEditor.propTypes = {
  classes: PropTypes.any,
  questionId: PropTypes.number,
  answerType: PropTypes.any,
  onAnswerAdd: PropTypes.func,
};

const mapStateToProps = (state, { questionId }) => {
  return { ...state.editingQuiz.questions.byId[questionId] };
};

const mapDispatchToProps = (dispatch, { questionId }) => {
  return {
    onAnswerAdd: (title, checked) => {
      dispatch(addAnswerToEditingQuiz(questionId, title, checked));
    }
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizAnswersEditor));
