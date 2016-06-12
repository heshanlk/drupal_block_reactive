Drupal.behaviors.drupal_block_reactive = {
  attach: (context) => {
    // CommentBox component definition.
    class CommentBox extends React.Component {
      constructor() {
        super();
        this.state = {
          comments: []
        }
      }

      componentDidMount() {
        this.serverRequest = jQuery.ajax({
          url: '/api/comments',
          dataType: 'json',
          success: (comments) => {
            this.setState({comments});
          },
          error: (xhr, status, err) => {
            console.error('/api/comments', status, err.toString());
          }
        });
      }

      componentWillUnmount() {
        this.serverRequest.abort();
      }

      // Private method gets data from state and returns array of components.
      _getComments() {
        // Get the list of comments from the state.
        const commentsList = this.state.comments;
        // Return an array of sub-components.
        if (commentsList.length > 0) {
          return commentsList.map((comment) => {
            return <Comment
              subject={comment.subject}
              changed={comment.changed}
              key={comment.cid}
            />
          });
        }
        return (
          <p>{Drupal.t('No comments.')}</p>
        );
      }

      render() {
        const comments = this._getComments();
        return (
          <div className="comments">{comments}</div>
        );
      }
    }

    // Comment component definition.
    class Comment extends React.Component {
      render() {
        return (
          <div className="comment">
            <span>{this.props.subject}</span> | <span>{this.props.changed}</span>
          </div>
        );
      }
    }
    // Render our component.
    ReactDOM.render(
      <CommentBox />,
      document.getElementById('recent-comments-react')
    );
  }
};