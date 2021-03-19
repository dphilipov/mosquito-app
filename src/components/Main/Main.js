import style from './Main.module.css'

import { Link } from 'react-router-dom';
import { Component } from 'react';
import postServices from '../../services/postServices'
import Article from '../Article/Article'

class Main extends Component {

    constructor(props) {
        super(props)

        this.state = {
            articles: [],
            latestDoc: 0,
            isEnd: false
        }
    }

    updateArticlesState() {
        postServices.getMore(2, this.state.latestDoc)
            .then(data => {
                if (data !== undefined) {
                    this.setState(prevState => ({
                        articles: [...prevState.articles, ...data.collection],
                        latestDoc: data.latestDoc
                    }));
                } else {
                    this.setState({ isEnd: true });
                }

            })
            .catch(err => console.log(err))
    }

    componentDidMount() {
        this.updateArticlesState();
    }

    render() {
        console.log(this.state.isEnd);
        return (

            <div className={style.main}>
                <h3 className={style.activityTitle}>Activity Feed</h3>

                <Link to="/create" ><button className={style.createButton}>CREATE</button></Link>
                {this.state.articles.map(article => (
                    <Article
                        key={article.id}
                        props={article}
                    />
                ))}

                {this.state.isEnd ?
                    <p className={style.end}>~END~</p> :
                    <button onClick={() => {
                        this.updateArticlesState();
                    }} className={style.showMore}>
                        SHOW MORE
                </button>}

            </div>
        )
    }

}

export default Main;