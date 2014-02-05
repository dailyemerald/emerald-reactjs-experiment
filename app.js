/**
* @jsx React.DOM
*/

var delta_t = function() {
	return new Date - window._top;
}

var PostWrapper = React.createClass({
	getInitialState: function() {
    	return { posts: [], attachments: [], selected_post: {} };
  	},
	componentWillMount: function(data) {
		$.ajax({
			url: this.props.url,
			type: 'GET',
			dataType: 'text',
			success: function(api_result) { 							
				var data = JSON.parse( api_result.split("</script>")[1] );				
				console.log("parsing data", delta_t());					
				var o = {
					posts: data.posts, 
					attachments: data.attachments, 
					selected_post: data.posts[0]
				};
				console.log('data loaded, state:', o)
				this.setState(o);
				
			}.bind(this),
			error: function(xhr, status, err) { 
				console.error("data.json", status, err.toString()) 
			}.bind(this)
		});
	},
	handleClick: function(new_post_id, evt) {
		var post = this.state.posts.filter(function(post) {
			return post['ID'] == new_post_id;
		})[0];
		this.setState({selected_post: post});
	},
	render: function() {

		var post_list_items = this.state.posts.map(function(item, index) { 
			return <PostListItem post={item} click={this.handleClick} />;
		}.bind(this));
		
		return <div>
			<ul>{post_list_items}</ul>
			<PostDetail post={this.state.selected_post} />
		</div>;
	}
});      



var PostDetail = React.createClass({
  render: function() {
    return <article>
        <h1>{this.props.post.post_title}</h1>
        <div className="content" dangerouslySetInnerHTML={{__html: this.props.post.post_content}} />	    
	</article>;
  }
});

var PostListItem = React.createClass({
	handleClick: function(event) {		
		this.props.click(this.props.post['ID'], event);
	},
	render: function() {
		return <li onClick={this.handleClick}>
			<h3>{this.props.post.post_title}</h3>								
		</li>;
	}
});

React.renderComponent(
	<PostWrapper url={"http://dailyemerald.com/wp-content/themes/EMG-Wordpress-Theme/api-v1-index.php"} />, 
	document.getElementById('main')
);	