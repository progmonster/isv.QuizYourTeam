import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component, Fragment } from "react";
import GridItem from "/imports/components/Grid/GridItem.jsx";
import GridContainer from "/imports/components/Grid/GridContainer.jsx";
import Button from "@material-ui/core/Button";
import * as PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Checkbox from '@material-ui/core/Checkbox';
import { ANSWER_TYPES } from "./AnswerTypes";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = (theme) => ({
  quizAnswersEditor: {
    ...theme.mixins.gutters(),/*todo why?*/
    paddingTop: theme.spacing.unit * 2,/*todo why?*/
    paddingBottom: theme.spacing.unit * 2,/*todo why?*/
  }
});

class _SingleChoiceAnswerItem extends Component {
  render() {
    const { classes, number, answerItem } = this.props;

    return (<FormControlLabel value={number.toString()} control={this._renderLabelChildren()} label="" />)
  }

  _renderLabelChildren() {
    const { classes, number, answerItem } = this.props;

    return (
      <Fragment>
        <Radio checked={answerItem.checked} />

        <TextField
          value={answerItem.title}
          /*onChange={this.handleChange('name')}*/
          margin="normal"
        />

        <IconButton aria-label="Delete the answer" color="secondary">
          <DeleteIcon />
        </IconButton>
      </Fragment>
    );
  }
}

_SingleChoiceAnswerItem.propTypes = {
  answerItem: PropTypes.any,
  number: PropTypes.number,
};

class _SingleChoiceAnswerBlock extends Component {
  render() {
    const { classes, answerItems } = this.props;

    return (<RadioGroup
      aria-label="Gender" /*todo*/
      name="gender1" /*todo*/
      value={0}
      onChange={this.handleChange}
    >
      {answerItems.map((answerItem, answerItemIdx) => (
        <_SingleChoiceAnswerItem key={answerItemIdx} number={answerItemIdx + 1} answerItem={answerItem} />
      ))}
    </RadioGroup>)
  }
}

_SingleChoiceAnswerBlock.propTypes = {
  answerItems: PropTypes.any,
};

class _MultipleChoiceAnswerBlock extends Component {
  render() {
    const { answerItems } = this.props;
    /*          <Typography component="div" style={{ padding: 8 * 3 }}>
                asdfasdf
              </Typography>
    */

    /*
    *           {answers.items.map((answerItem, answerItemIdx) => (
                <_AnswerItem key={answerItemIdx} answerItem={answerItem} />
              ))}
    */
    return <div><Checkbox></Checkbox></div>
  }
}

_MultipleChoiceAnswerBlock.propTypes = {
  answerItems: PropTypes.any,
};

class QuizAnswersEditor extends Component {
  render() {
    const { answers } = this.props;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Tabs value={answers.type === ANSWER_TYPES.SINGLE_CHOICE ? 0 : 1} onChange={this.handleChange}>
            <Tab label="Single choice" />
            <Tab label="Multiple choice" />
          </Tabs>

          {answers.type === ANSWER_TYPES.SINGLE_CHOICE
            ? <_SingleChoiceAnswerBlock answerItems={answers.items} />
            : <_MultipleChoiceAnswerBlock answerItems={answers.items} />}
        </GridItem>

        <GridItem xs={12} sm={12} md={8}>
          <Button variant="contained" color="primary"
                  onClick={() => this.props.onAnswerAdd("", false)}>
            Add an answer
          </Button>
        </GridItem>
      </GridContainer>
    );
  }
}

QuizAnswersEditor.propTypes = {
  classes: PropTypes.any,
  answers: PropTypes.any,
  onAnswerAdd: PropTypes.func,
  onAnswerRemove: PropTypes.func,
};

export default withStyles(styles)(QuizAnswersEditor);