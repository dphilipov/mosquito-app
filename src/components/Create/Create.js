import firebase from '../../config/firebase.js';
import style from './Create.module.css';
import { Component } from 'react';
import { dtFormat } from '../../config/dateFormat';
import authServices from '../../services/authServices';
import Notification from '../Notification/Notification';
import notificationServices from '../../services/notificationServices';
import postServices from '../../services/postServices';


const DB = firebase.firestore();


class Create extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            imgUrl: '',
            description: '',
            dateCreated: '',
            creator: authServices.getUserData().uid,
            visited: [],
            notification: {
                type: '',
                message: ''
            }
        }
    }

    inputHandler = (event) => {
        if (event.target.name === 'visited') {
            if (event.target.checked === true) {
                let userId = authServices.getUserData().uid;
                let newVisited = this.state.visited;
                newVisited.push(userId)
                this.setState({
                    [event.target.name]: newVisited,
                });
            } else {
                this.setState({
                    [event.target.name]: [],
                });
            }

        } else {
            this.setState({
                [event.target.name]: event.target.value,
            });
        }

    }

    submitHandler = async (event) => {
        event.preventDefault();

        await this.setState({
            dateCreated: dtFormat.format(new Date()),
        })

        this.setState({
            notification: {
                type: '',
                message: ''
            }
        });

        let { title, imgUrl, description } = this.state;

        if (title == ``) {
            let type = "bad";
            let message = "Title can't be empty"

            notificationServices.notificationsHandler.call(this, type, message)

            return
        }

        if (imgUrl == ``) {
            let type = "bad";
            let message = "Image URL can't be empty"

            notificationServices.notificationsHandler.call(this, type, message)

            return
        }

        if (description == ``) {
            let type = "bad";
            let message = "Description can't be empty"

            notificationServices.notificationsHandler.call(this, type, message)

            return
        }

        if (description.length < 50) {
            let type = "bad";
            let message = "Description must be at least 50 characters"

            notificationServices.notificationsHandler.call(this, type, message)

            return
        }

        postServices.checkIfTitleExists(title)
            .then(res => {
                if (res === false) {
                    DB.collection(`test`)
                        .add(this.state)
                        .then((res) => {

                            let type = "good";
                            let message = "Place created successfully!"

                            notificationServices.notificationsHandler.call(this, type, message)

                            setTimeout(() => {
                                this.props.history.push('/');
                            }, 2000)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                } else {
                    let type = "bad";
                    let message = "This place already exists"

                    notificationServices.notificationsHandler.call(this, type, message)
                }
            })

    }

    render() {
        let { title, imgUrl, description } = this.state;

        return (
            <>

                {this.state.notification.type !== ''
                    ? <Notification type={this.state.notification.type} message={this.state.notification.message} />
                    : ''
                }

                <h3 className={style.createHeading}>Create a new place!</h3>

                <form className={style.createForm}>

                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        placeholder="Title of the place"
                        onChange={this.inputHandler} />

                    <label htmlFor="imgUrl">Image Photo:</label>
                    <input
                        type="text"
                        name="imgUrl"
                        value={imgUrl}
                        placeholder="Enter URL here"
                        onChange={this.inputHandler} />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        type="text"
                        name="description"
                        value={description}
                        onChange={this.inputHandler}
                    >
                    </textarea>

                    <input
                        type="checkbox"
                        id="visited"
                        name="visited"
                        value="Visited"
                        onChange={this.inputHandler}
                    />
                    <label htmlFor="visited">Visited</label>

                    <input onClick={this.submitHandler} type="submit" name="Create" value="Create" />
                </form>
            </>
        )
    }

}

export default Create;

