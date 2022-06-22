// pakage.json에 type module을 추가해주면 require가 아닌 import 사용 가능

import {ApolloServer,gql} from 'apollo-server';


//graphql 의 법칙을 따라야함
let tweets = [
    {
        id : "1",
        text : "first",
    },
    {
        id : "2",
        text : "second",
    }
]

//SDL ==> Schema Definition Language
const typeDefs = gql`
type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String
  }
  type Tweet {
    id: ID!
    text: String!
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping:String!
    postTweet(text: String!, userId: ID!): Tweet!
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;
// 배열 형태의 Tweet 리턴
// 1개의 Tweet 사용 ==> argument 필요 ==> id를 받아서 표현


const resolvers={
    Query:{
        allTweets(){
            return tweets;
        },
        tweet(root,{id}){
            return tweets.find(tweet=>tweet.id === id);
        }

    },
    Mutation:{
        //postTweet(text: String!, userId: ID!): Tweet!
        postTweet(_,{text,userId}){
            const newTweet={
                id : tweets.length+1,
                text : text,
            }
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_,{id}){
            // Boolean!
            const tweet = tweets.find(tweet=>tweet.id === id);
            if(!tweet) return false;
            tweets = tweets.filter(tweet=>tweet.id !== id)
            return true;
        }
    }

}

const server = new ApolloServer({typeDefs,resolvers})

server.listen().then(({url})=>{
    console.log(`Running on ${url}`)
})
// Apollo Server requires either an existing schema, modules or typeDefs ==> 아폴로 서버는 스키마, 모듈 또는 타입 정의가 필요하다.