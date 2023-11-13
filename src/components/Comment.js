function Comment(props){
    return (
        <>
            <div style={{ textAlign: 'center', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '10px' }}>
                <h6>{ props.comment.postedBy.username } on  {new Date(props.comment.date).toLocaleString('sl-SI', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}</h6>
                <h4> { props.comment.contents }</h4>
            </div>
        </>
    );
}

export default Comment;
