import style from './Details.module.css';
import { useHistory, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { dtFormat } from '../../config/dateFormat';
import { UserConsumer } from '../userContext';
import firebase from '../../config/firebase.js';
import Comment from '../Comment/Comment';
import postServices from '../../services/postServices';
import authServices from '../../services/authServices';
import Notification from '../Notification/Notification';


const Details = ({ match }) => {
    let [article, setArticle] = useState({});
    let [input, setInput] = useState('');
    let [date, setDate] = useState('');
    let [notificationType, setNotificationType] = useState('');
    let [notificationMessage, setNotificationMessage] = useState('');

    let history = useHistory();

    const DB = firebase.firestore();
    let articleId = match.params.id;

    useEffect(() => {
        postServices.getOne(articleId)
            .then(res => {
                setArticle(res)
            })
            .catch(err => console.log(err));
    }, [match]);

    const CommentHandler = async (event, userEmail) => {
        event.preventDefault();

        setNotificationType('');
        setNotificationMessage('');

        let postDate = dtFormat.format(new Date());
        let commentData = {
            comment: input,
            date: postDate,
            user: userEmail,
            userId: authServices.getUserData().uid
        }

        await setDate(postDate);

        if (input == ``) {
            let type = "bad";
            let message = "Comment can't be empty"

            setNotificationType(type);
            setNotificationMessage(message);

            return
        }

        DB.collection(`test`)
            .doc(articleId)
            .update({
                comments: firebase.firestore.FieldValue.arrayUnion(commentData)
            })
            .then((res) => {
                setInput('');

                postServices.getOne(articleId)
                    .then(res => {
                        setArticle(res)
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err))

        DB.collection(`test`)
            .doc(articleId)
            .update({
                commentsUserIds: firebase.firestore.FieldValue.arrayUnion(authServices.getUserData().uid)
            })
            .then((res) => {
                setInput('');

                postServices.getOne(articleId)
                    .then(res => {
                        setArticle(res)
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err))
    }

    const DeleteHandler = () => {

        DB.collection(`test`).doc(articleId).delete()
            .then((res) => {
                history.push('/');
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className={style.container}>
            <div className={style.pointOfInterestDetails}>
                <div className={style.pointOfInterestDetailsTop}>
                    <img src={article.imgUrl} alt="Image Preview" />


                    {article.creator == authServices.getUserData().uid
                        ?
                        <div className={style.buttons}>
                            <button onClick={DeleteHandler}>DELETE</button>
                            <Link to={{
                                pathname: `/article/${articleId}/edit`,
                                articleProps: article
                            }}>
                                <button>EDIT</button>
                            </Link>
                        </div>
                        :
                        ''
                    }


                </div>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
            </div>

            <h2>Comments:</h2>

            {(article.comments == undefined || article.comments.length == 0)

                ? <div className={style.noComments}>
                    <p>No comments yet. Be the first one to do it!</p>
                </div>
                : article.comments.map((comment, index) => (
                    <Comment key={index} commentInfo={comment} />
                ))
            }

            {notificationType !== ''
                ? <Notification type={notificationType} message={notificationMessage} />
                : ''
            }

            <form className={style.commentForm}>
                <textarea
                    type="text"
                    name="comment"
                    placeholder="Write your comment..."
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                ></textarea>

                <UserConsumer>
                    {
                        (userCheck) => {
                            return (
                                <input
                                    type="submit"
                                    name="Submit"
                                    value="Submit"
                                    onClick={(event) => CommentHandler(event, userCheck.email)}
                                />
                            )
                        }

                    }

                </UserConsumer>

            </form>
        </div>
    )

}


export default Details;