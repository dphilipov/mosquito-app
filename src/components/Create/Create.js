// React, Hooks
import { useState } from 'react';
import { Link } from 'react-router-dom'
import useCRUDForm from '../../hooks/useCRUDForm';

// Services, Helpers
import validate from '../../services/validationServices';

// Components
import Notification from '../Notification/Notification';

// CSS
import style from './Create.module.css';

const Create = ({ history }) => {
    const {
        formValue,
        handleInputChange,
        handleFormSubmit,
        isSubmitting,
        formErrors,
        isSuccess
    } = useCRUDForm(validate);

    const [notification, setNotification] = useState({
        type: '',
        message: ''
    });

    return (
        <>

            {/* {this.state.notification.type !== ''
                    ? <Notification type={this.state.notification.type} message={this.state.notification.message} />
                    : ''
                } */}

            <h3 className={style.createHeading}>Create a new place!</h3>
            <p className={style.hint}>
                You use a website like <Link to={{ pathname: "https://www.latlong.net" }} target="_blank">https://www.latlong.net</Link> for the coordinates
            </p>

            <form className={style.createForm}>

                <label htmlFor="title">Title:*</label>
                <input
                    type="text"
                    name="title"
                    value={formValue.title}
                    placeholder="Title of the place"
                    onChange={handleInputChange} />

                <label htmlFor="imgUrl">Image Photo:*</label>
                <input
                    type="text"
                    name="imgUrl"
                    value={formValue.imgUrl}
                    placeholder="Enter URL here"
                    onChange={handleInputChange} />

                <label htmlFor="lat">Latitude:*</label>
                <input
                    type="text"
                    name="lat"
                    value={formValue.lat}
                    placeholder="Enter place latitude (e.g. 42.144920)"
                    onChange={handleInputChange} />

                <label htmlFor="lng">Longitude:*</label>
                <input
                    type="text"
                    name="lng"
                    value={formValue.lng}
                    placeholder="Enter place longitude (e.g. 24.750320)"
                    onChange={handleInputChange} />

                <label htmlFor="description">Description:*</label>
                <textarea
                    type="text"
                    name="description"
                    value={formValue.description}
                    minLength="50"
                    maxLength="500"
                    placeholder="Enter a description (min. 50 characters)"
                    onChange={handleInputChange}
                >
                </textarea>

                <input
                    type="checkbox"
                    id="visited"
                    name="visited"
                    value="Visited"
                    onChange={handleInputChange}
                />
                <label htmlFor="visited">Visited</label>

                <p className={style.mandatory}>* are mandatory</p>
                <button
                    onClick={handleFormSubmit}
                    className={style.submitBtn}
                    type="submit"
                    disabled={isSubmitting}
                >
                    Create
                </button>
            </form>
        </>
    )
}

export default Create;

