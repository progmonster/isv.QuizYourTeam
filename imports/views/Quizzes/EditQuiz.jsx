import React, { Component } from "react";
import update from 'react-addons-update';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "/imports/components/Grid/GridItem.jsx";
import GridContainer from "/imports/components/Grid/GridContainer.jsx";
import CustomInput from "/imports/components/CustomInput/CustomInput.jsx";
import Card from "/imports/components/Card/Card.jsx";
import CardHeader from "/imports/components/Card/CardHeader.jsx";
import CardBody from "/imports/components/Card/CardBody.jsx";
import CardFooter from "/imports/components/Card/CardFooter.jsx";
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import * as PropTypes from "prop-types";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  quizPaper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  }
});

const QuizParagraph = withStyles(styles)(class extends Component {
  constructor(props, context) {
    super(props, context);

    console.log(props.number);
  }

  render() {
    const { classes } = this.props;

    return <Paper className={classes.quizPaper} elevation={1}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Typography variant="h5" component="h3">
            Paragraph #{this.props.number}
          </Typography>
        </GridItem>

        <GridItem xs={12} sm={12} md={12}>
          <Editor
            editorState={this.props.paragraph.editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={(editorState) => this.props.onParagraphEditorStateChange(this.props.number, editorState)}
          />
        </GridItem>

        <GridItem xs={12} sm={12} md={8}>
          <Button variant="contained" color="secondary" onClick={() => this.props.onParagraphRemove(this.props.number)}>
            Remove paragraph
          </Button>
        </GridItem>
      </GridContainer>
    </Paper>;
  }
});

QuizParagraph.propTypes = {
  classes: PropTypes.any,
  paragraph: PropTypes.any,
  onParagraphEditorStateChange: PropTypes.func,
  onParagraphRemove: PropTypes.func,
};

class EditQuiz extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      paragraphs: [],
    };
  }

  onParagraphCreate = () => this.setState(
    (state) => update(state, { paragraphs: { $push: [this.newBlankParagraph()] } })
  );

  onParagraphEditorStateChange = (paragraphNumber, editorState) =>
    this.setState((state) => {
        const paragraphIdx = (paragraphNumber - 1);

        const updatedParagraph = { ...state.paragraphs[paragraphIdx], editorState };

        return update(state, { paragraphs: { $splice: [[paragraphIdx, 1, updatedParagraph]] } });
      }
    );

  onParagraphRemove = (paragraphNumber) =>
    this.setState((state) => {
        const paragraphIdx = (paragraphNumber - 1);

        return update(state, { paragraphs: { $splice: [[paragraphIdx, 1]] } });
      }
    );

  newBlankParagraph = () => ({ editorState: EditorState.createEmpty() });

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

          {this.state.paragraphs.map((paragraph, paragraphIdx) =>
            (<GridItem key={paragraphIdx} xs={12} sm={12} md={8}>
              <QuizParagraph
                number={paragraphIdx + 1}
                paragraph={paragraph}
                onParagraphEditorStateChange={this.onParagraphEditorStateChange}
                onParagraphRemove={this.onParagraphRemove}
              />
            </GridItem>)
          )}

          <GridItem xs={12} sm={12} md={8}>
            <Button variant="contained" color="primary" onClick={this.onParagraphCreate}>
              Add new paragraph
            </Button>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(EditQuiz);
