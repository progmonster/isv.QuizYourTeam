import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component } from "react";
import { Editor } from 'react-draft-wysiwyg';
import Paper from "@material-ui/core/Paper";
import GridItem from "/imports/components/Grid/GridItem.jsx";
import GridContainer from "/imports/components/Grid/GridContainer.jsx";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as PropTypes from "prop-types";

const styles = (theme) => ({
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
  },
  quizParagraph: {
    ...theme.mixins.gutters(), /*todo why?*/
    paddingTop: theme.spacing.unit * 2, /*todo why?*/
    paddingBottom: theme.spacing.unit * 2,/*todo why?*/
  }
});


class QuizParagraph extends Component {
  render() {
    const { classes } = this.props;

    return <Paper className={classes.quizParagraph} elevation={1}>
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
}

QuizParagraph.propTypes = {
  classes: PropTypes.any,
  paragraph: PropTypes.any,
  onParagraphEditorStateChange: PropTypes.func,
  onParagraphRemove: PropTypes.func,
};

export default withStyles(styles)(QuizParagraph);