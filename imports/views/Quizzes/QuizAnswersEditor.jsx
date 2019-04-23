import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component, Fragment } from "react";
import GridItem from "/imports/components/Grid/GridItem.jsx";
import GridContainer from "/imports/components/Grid/GridContainer.jsx";
import Button from "@material-ui/core/Button";
import * as PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { ANSWER_TYPES } from "./AnswerTypes";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  addAnswerToEditingQuiz, changeAnswerCheckStateInEditingQuiz, changeAnswerTitleInEditingQuiz,
  changeQuestionEditorStateInEditingQuiz, removeAnswerFromEditingQuiz,
  removeQuestionFromEditingQuiz
} from "../../actions";
import { connect } from "react-redux";

const styles = (theme) => ({
  quizAnswersEditor: {
    ...theme.mixins.gutters(),/*todo why?*/
    paddingTop: theme.spacing.unit * 2,/*todo why?*/
    paddingBottom: theme.spacing.unit * 2,/*todo why?*/
  }
});

class _SingleChoiceAnswerItem extends React.PureComponent {
  render() {
    const {
      classes,
      id: questionId,
      number: questionNumber,
      editorState,
      onQuestionEditorStateChange,
      onQuestionRemove,
      onAnswerAdd,
      onAnswerRemove,
      onAnswerTitleChange,
      onAnswerCheckStateChange
    } = this.props;

    return (<FormControlLabel value={number.toString()} control={this._renderLabelChildren()} label="" />)
  }

  _renderLabelChildren() {
    const { answerItem } = this.props;

    return (
      <Fragment>
        <Radio
          checked={answerItem.checked}
          onChange={() => this.props.onCheckStateChange(true)}
        />

        <TextField
          value={answerItem.title}
          onChange={(event) => this.props.onTitleChange(event.target.value)}
          margin="normal"
        />

        <IconButton
          aria-label="Delete the answer"
          color="secondary"
          onClick={this.props.onDelete}
        >
          <DeleteIcon />
        </IconButton>
      </Fragment>
    );
  }
}

_SingleChoiceAnswerItem.propTypes = {
  answerItem: PropTypes.any,
  number: PropTypes.number,
  onDelete: PropTypes.func,
  onTitleChange: PropTypes.func,
  onCheckStateChange: PropTypes.func,
};

class _SingleChoiceAnswerBlock extends React.PureComponent {
  render() {
    const { answers } = this.props;

    return (<RadioGroup
      aria-label="Gender" /*todo*/
      name="gender1" /*todo*/
      value={0}
      onChange={this.handleChange}
    >
      {answers.map((answerItem, answerItemIdx) => {
        const answerItemNumber = answerItemIdx + 1;

        return (
          <_SingleChoiceAnswerItem
            key={answerItemIdx}
            number={answerItemNumber}
            answerItem={answerItem}
            onDelete={() => this.props.onAnswerItemRemove(answerItemNumber)}
            onTitleChange={(title) => this.props.onAnswerItemTitleChange(answerItemNumber, title)}
            onCheckStateChange={(checked) => this.props.onAnswerItemCheckStateChange(answerItemNumber, checked)}
          />
        );
      })}
    </RadioGroup>)
  }
}

_SingleChoiceAnswerBlock.propTypes = {
  answers: PropTypes.any,
  onAnswerItemRemove: PropTypes.func,
  onAnswerItemTitleChange: PropTypes.func,
  onAnswerItemCheckStateChange: PropTypes.func,
};

/*todo implement*/
class _MultipleChoiceAnswerBlock extends React.PureComponent {
  render() {
    return <div />
  }
}

_MultipleChoiceAnswerBlock.propTypes = {
  answers: PropTypes.any,
  onAnswerItemRemove: PropTypes.func,
  onAnswerItemTitleChange: PropTypes.func,
  onAnswerItemCheckStateChange: PropTypes.func,
};

class QuizAnswersEditor extends Component {
  render() {
    const {
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
            : this._renderMultipleChoiceAnswerBlock()}
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
      answers,
      onAnswerRemove,
      onAnswerTitleChange,
      onAnswerCheckStateChange,
    } = this.props;

    return (
      <_SingleChoiceAnswerBlock
        answers={answers}
        onAnswerItemCheckStateChange={onAnswerCheckStateChange}
        onAnswerItemTitleChange={onAnswerTitleChange}
        onAnswerItemRemove={onAnswerRemove}
      />
    );
  }

  _renderMultipleChoiceAnswerBlock() {
    const {
      answers,
      onAnswerRemove,
      onAnswerTitleChange,
      onAnswerCheckStateChange,
    } = this.props;

    return (
      <_MultipleChoiceAnswerBlock
        answers={answers}
        onAnswerItemCheckStateChange={onAnswerCheckStateChange}
        onAnswerItemTitleChange={onAnswerTitleChange}
        onAnswerItemRemove={onAnswerRemove}
      />
    );
  }
}

QuizAnswersEditor.propTypes = {
  classes: PropTypes.any,
  questionId: PropTypes.number,
  answerType: PropTypes.any,
  answers: PropTypes.any,
  onAnswerAdd: PropTypes.func,
  onAnswerRemove: PropTypes.func,
  onAnswerTitleChange: PropTypes.func,
  onAnswerCheckStateChange: PropTypes.func,
};

const mapStateToProps = (state, { questionId }) => {
  return { ...state.editingQuiz.questions.byId[questionId] };
};

const mapDispatchToProps = (dispatch, { questionId }) => {
  return {
    onAnswerAdd: (title, checked) => {
      dispatch(addAnswerToEditingQuiz(questionId, title, checked));
    },

    onAnswerRemove: (answerId) => {
      dispatch(removeAnswerFromEditingQuiz(questionId, answerId));
    },

    onAnswerTitleChange: (answerId, title) => {
      dispatch(changeAnswerTitleInEditingQuiz(questionId, answerId, title));
    },

    onAnswerCheckStateChange: (answerId, checked) => {
      dispatch(changeAnswerCheckStateInEditingQuiz(questionId, answerId, checked));
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizAnswersEditor));
