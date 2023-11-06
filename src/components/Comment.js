function Comment(props){
    return (
        <>
            <div>
                <h6>{ props.comment.postedBy.username } : { props.comment.contents }</h6>
            </div>
        </>
    );
}

export default Comment;
