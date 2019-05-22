import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { compose } from 'redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { orange } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import { Quizzes } from '../../../model/collections';
import { withTracker } from 'meteor/react-meteor-data';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';

const styles = {
  cardHeaderRoot: {
    backgroundColor: orange[500],
  },

  cardHeaderTitle: {
    color: 'white',
  },

  cardSubheaderTitle: {
    color: 'white',
  },
};

class QuizLearnPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {
      classes,
      quiz,
    } = this.props;

    if (!quiz) {
      return <div />;
    }

    const quizDescriptionHtml = stateToHTML(convertFromRaw(quiz.descriptionEditorState));

    return (
      <Grid container justify="space-around">
        <Grid item xs={12} sm={12} md={8}>
          <Card>
            <CardHeader
              classes={{
                root: classes.cardHeaderRoot,
                title: classes.cardHeaderTitle,
                subheader: classes.cardSubheaderTitle,
              }}

              title={quiz.title}
            />

            <CardContent>
              <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                  <p dangerouslySetInnerHTML={{ __html: quizDescriptionHtml }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>


        {/*
        <Grid item xs={12} sm={12} md={8}>
          <Button variant="contained" color="primary" onClick={onQuestionCreate}>
            Add new question
          </Button>
        </Grid>
*/}

        <Grid item xs={12} sm={12} md={8}>
          <Button variant="contained" color="primary" >
            Start learning!
          </Button>
        </Grid>
      </Grid>
    );
  }
}

QuizLearnPage.propTypes = {
  classes: PropTypes.any,
  quiz: PropTypes.object,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = (dispatch, { location: { search } }) => ({});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),

  withTracker(({ match: { params: { quizId } } }) => {
    Meteor.subscribe('quiz', quizId);

    const quiz = Quizzes.findOne(quizId);

    return {
      quiz,
    };
  }),
)(QuizLearnPage);
