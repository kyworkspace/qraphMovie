// pakage.json에 type module을 추가해주면 require가 아닌 import 사용 가능

import {ApolloServer,gql} from 'apollo-server';


//SDL ==> Schema Definition Language
const typeDefs = gql`
    type User{
        id : ID
        username : String
    }

    type Tweet {
        id : ID
        text : String
        author : User
    }

    type Query{
        allTweets : [Tweet]
        Tweet(id:ID):Tweet
    }

    type Mutation{
        postTweet(text:String, userId : ID) : Tweet
        deleteTweet(id:ID) : Boolean
    }
`;
// 배열 형태의 Tweet 리턴
// 1개의 Tweet 사용 ==> argument 필요 ==> id를 받아서 표현

const server = new ApolloServer({typeDefs})

server.listen().then(({url})=>{
    console.log(`Running on ${url}`)
})
// Apollo Server requires either an existing schema, modules or typeDefs ==> 아폴로 서버는 스키마, 모듈 또는 타입 정의가 필요하다.