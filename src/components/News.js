// import React, { Component } from 'react';
// import NewsItem from './NewsItem';
// import Spinner from './Spinner';
// import PropTypes from 'prop-types';
// import InfiniteScroll from "react-infinite-scroll-component";


// export class News extends Component {
//     static defaultProps = {
//         country: 'us',
//         pageSize: 8,
//         category: 'general',
//     }
//     static propTypes = {
//         country: PropTypes.string,
//         pageSize: PropTypes.number,
//         category: PropTypes.string,
//     }

//     //to capitalize doc.title ko category props ko first letter
//     capitalizeFirstLetter = (string) => {
//         return string.charAt(0).toUpperCase() + string.slice(1);
//     }

//     constructor(props) {
//         super(props);
//         this.state = {
//             articles: [],
//             loading: true,
//             page: 1,
//             totalResults: 0
//         }
//         document.title = `${this.capitalizeFirstLetter(this.props.category)}- Headline Hub`;  //goggleko tab ma aune title 
//     }

//     async updateNews() {
//         this.props.setProgress(10);
//         const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9abd0d63431c4d0d96639f70c4b836ec&page=${this.state.page}&pageSize=${this.props.pageSize}`;
//         this.setState({ loading: true });  //to show loading when refreshing 
//         let data = await fetch(url);
//         let parsedData = await data.json();
//         this.props.setProgress(70);
//         this.setState({
//             articles: parsedData.articles,
//             totalResults: parsedData.totalResults,
//             loading: false
//         })
//         this.props.setProgress(100);
//     }

//     async componentDidMount() {
//         this.updateNews();

//     }

//     handlePrevClick = async () => {
//         this.setState({ page: this.state.page - 1 });
//         this.updateNews();
//     }

//     handleNextClick = async () => {
//         this.setState({ page: this.state.page + 1 });
//         this.updateNews();
//     }

//     fetchMoreData = async () => {
//         this.setState({ page: this.state.page + 1 });
//         const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=9abd0d63431c4d0d96639f70c4b836ec&page=${this.state.page}&pageSize=${this.props.pageSize}`;
//         let data = await fetch(url);
//         let parsedData = await data.json();
//         this.setState({
//             articles: this.state.articles.concat(parsedData.articles),
//             totalResults: parsedData.totalResults
//         })
//     };


//     render() {
//         return (
//             <>
//                 <h1 className="text-center" style={{ margin: '35px 0px' }}>
//                     Headline Hub- Top {this.capitalizeFirstLetter(this.props.category)} news
//                 </h1>

//                 {/* if loading state is false then show loading otherwise show spinner component */}
//                 {this.state.loading && <Spinner />}

//                 <InfiniteScroll
//                     dataLength={this.state.articles.length}
//                     next={this.fetchMoreData}
//                     hasMore={this.state.articles.length !== this.state.totalResults}
//                     loader={<Spinner />}
//                 >
//                     <div className="container">
//                         <div className="row">
//                             {this.state.articles.map((element) => {
//                                 return <div className="col-md-4" key={element.url}>
//                                     <NewsItem
//                                         title={element.title ? element.title : ""}
//                                         description={element.description ? element.description : ""}
//                                         imageUrl={element.urlToImage}
//                                         newsUrl={element.url}
//                                         author={element.author}
//                                         date={element.publishedAt}
//                                         source={element.source.name}
//                                     />
//                                 </div>
//                             })}
//                         </div>
//                     </div>
//                 </InfiniteScroll>
//             </>
//         );
//     }
// }

// export default News

import React, { useEffect, useState } from 'react'

import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        setArticles(parsedData.articles || []);  // Use an empty array as fallback
        setTotalResults(parsedData.totalResults || 0);
        setLoading(false);
        props.setProgress(100);
    };


    useEffect(() => {
         document.title = `${capitalizeFirstLetter(props.category)} - HeadLine Hub`;
        updateNews();
    }, [])

    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page + 1);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(articles.concat(parsedData.articles || []));  // Append an empty array if undefined
        setTotalResults(parsedData.totalResults || 0);
    };


    return (
        <>
            <h1 className="text-center" style={{ margin: '35px 0px',marginTop:'90px' }}>HeadLine Hub- Top {capitalizeFirstLetter(props.category)} News</h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles ? articles.length : 0}
                next={fetchMoreData}
                hasMore={articles && articles.length !== totalResults}
                loader={<Spinner />}
            >

                <div className="container">

                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                </div>
            </InfiniteScroll>

        </>
    )

}

News.defaultProps = {
    country: 'us',
    pageSize: 8,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News