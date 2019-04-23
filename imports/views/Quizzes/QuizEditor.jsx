import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "/imports/components/Grid/GridItem.jsx";
import GridContainer from "/imports/components/Grid/GridContainer.jsx";
import CustomInput from "/imports/components/CustomInput/CustomInput.jsx";
import Card from "/imports/components/Card/Card.jsx";
import CardHeader from "/imports/components/Card/CardHeader.jsx";
import CardBody from "/imports/components/Card/CardBody.jsx";
import CardFooter from "/imports/components/Card/CardFooter.jsx";
import Button from "@material-ui/core/Button";
import QuizQuestionEditor from "./QuizQuestionEditor";
import QuizParagraphEditor from "./QuizParagraphEditor";
import { connect } from "react-redux";
import { addParagraphToEditingQuiz, addQuestionToEditingQuiz } from "/imports/actions";
import * as PropTypes from "prop-types";

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
  render() {
    const {
      classes,
      paragraphs,
      onParagraphCreate,
      questions,
      onQuestionCreate
    } = this.props;

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
              </CardFooter>
            </Card>
          </GridItem>

          {paragraphs.allIds.map((id, idx) =>
            (<GridItem key={id} xs={12} sm={12} md={8}>
              <QuizParagraphEditor id={id} number={idx + 1} />
            </GridItem>)
          )}

          <GridItem xs={12} sm={12} md={8}>
            <Button variant="contained" color="primary" onClick={onParagraphCreate}>
              Add new paragraph
            </Button>
          </GridItem>

          {questions.allIds.map((id, idx) =>
            (<GridItem key={idx} xs={12} sm={12} md={8}>
              <QuizQuestionEditor id={id} number={idx + 1} />
            </GridItem>)
          )}

          <GridItem xs={12} sm={12} md={8}>
            <Button variant="contained" color="primary" onClick={onQuestionCreate}>
              Add new question
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

QuizEditor.propTypes = {
  classes: PropTypes.any,
  paragraphs: PropTypes.any,
  questions: PropTypes.any,
  onParagraphCreate: PropTypes.func,
  onQuestionCreate: PropTypes.func,
};


const mapStateToProps = state => {
  return {
    paragraphs: state.editingQuiz.paragraphs,
    questions: state.editingQuiz.questions,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onParagraphCreate: () => {
      dispatch(addParagraphToEditingQuiz());
    },

    onQuestionCreate: () => {
      dispatch(addQuestionToEditingQuiz());
    },
  }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(QuizEditor));
