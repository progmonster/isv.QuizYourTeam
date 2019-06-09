import React from 'react';
import * as PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default function EmptyState({ title, description }) {
  return (
    <Grid container justify="space-around">
      <Grid item xs={12} md={4}>
        <Typography variant="title" align="center">
          {title}

          {description && (
            <Typography variant="body2">
              {description}
            </Typography>
          )}
        </Typography>
      </Grid>
    </Grid>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

EmptyState.defaultProps = {
  description: null,
};
