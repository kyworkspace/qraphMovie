// pakage.json에 type module을 추가해주면 require가 아닌 import 사용 가능

import { ApolloServer, gql } from 'apollo-server';
import fetch from 'node-fetch';


//graphql 의 법칙을 따라야함
let tweets = [
    {
        id: "1",
        text: "first",
        userId: "2"
    },
    {
        id: "2",
        text: "second",
        userId: "1"
    }
]
let users = [
    {
        id: "1",
        firstName: "park",
        lastName: "KIYOUNG",
    },
    {
        id: "2",
        firstName: "Egon",
        lastName: "Ailyon",
        //fullName은 다이나믹 로직이다.
    }
]
//SDL ==> Schema Definition Language
const typeDefs = gql`

type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is the sum of first Name and Last Name
    """
    fullName : String!
  }

    """
    Tweet object represents a resourece for Tweet
    """
  type Tweet {
    id: ID!
    text: String!
    author : User
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping:String!
    allUsers:[User!]!
    allMovies:[Movie!]!
    movie(id:String!) : Movie
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """Delete a Tweet if found, els returns false"""
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
    }
`;
// 배열 형태의 Tweet 리턴
// 1개의 Tweet 사용 ==> argument 필요 ==> id를 받아서 표현


const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        tweet(root, { id }) {
            return tweets.find(tweet => tweet.id === id);
        },
        allUsers() {
            console.log("all users Called")
            return users;
        },
        allMovies() {
            return fetch("https://yts.mx/api/v2/list_movies.json").then(res => res.json()).then(json => {
                return json.data.movies
            });
        },
        movie(_, {id}) {
            return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
            .then(res =>res.json())
            .then(json => json.data.movie);
        }

    },
    Mutation: {
        //postTweet(text: String!, userId: ID!): Tweet!
        postTweet(_, { text, userId }) {
            try {
                if (users.find(user => user.id === userId)) {
                    const newTweet = {
                        id: tweets.length + 1,
                        text: text,
                        userId
                    }
                    tweets.push(newTweet);
                    return newTweet;
                } else {
                    throw new Error("no User there");
                }
            } catch (error) {
                console.log(error)
            }
        },
        deleteTweet(_, { id }) {
            // Boolean!
            const tweet = tweets.find(tweet => tweet.id === id);
            if (!tweet) return false;
            tweets = tweets.filter(tweet => tweet.id !== id)
            return true;
        }
    },
    User: {
        firstName({ firstName }) {
            return firstName;
        },
        fullName({ firstName, lastName }) {
            return `${firstName} ${lastName}`;
        }
    },
    Tweet: {
        author({ userId }) {
            return users.find(u => u.id === userId);
        }
    }
}
//root안에는 각 데이터의 객체가 들어있음

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`)
})
// Apollo Server requires either an existing schema, modules or typeDefs ==> 아폴로 서버는 스키마, 모듈 또는 타입 정의가 필요하다.