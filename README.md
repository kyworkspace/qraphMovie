## Graphql 연습

### 테스트 URL
```
https://graphql.org/swapi-graphql
```
- 위의 주소로 확인해볼것

### 특징
 - under-fetching , over-fetching을 예방한다.
 - 오버페칭은 원하는 데이터 보다 더 많은 양의 데이터를 가져온 경우
 - 언더페칭은 원하는 데이터를 제대로 보고자 할때 여러번의 API요청이 필요한 경우라고 보면 된다. (필요한 데이터보다 더 적다는 뜻)
 - REST API의 위의 단점을 보완하고자 페이스북에서 출시됨
 - 원하는 데이터를 여러번의 API 호출 없이 한번 또는 소수의 API 요청으로 완성하는 것이 그래프QL의 장점이다.


 #### typeDefs 가 필요하다.

 ```
 const typeDefs = gql`
    type Query{
        text : String
        hello : String
    }
`;
 ```
  위의 코드는 REST API의 아래와 같다고 보면 된다.
```
GET /text
GET /hello
```


#### Apollo는 자체적인 서버를 제공한다.
 - 기본적으로 4000번 포트에 서버가 연결된다.

#### Scalar type 은 apollo에 내장된 타입이다.
 - Int, Boolean , String , ID

#### 각각의 스키마를 저장하고 배열 또는 1개의 객체로 불러오는 것이 가능하다.
 - 1개의 객체를 불러올 경우 argument가 필요하다.
 ```
 GET api/Tweet/:id
 ```
 같은 느낌


 #### Mutation
  - Post, DELETE, PUT 등의 역할과 같다
  - 백엔드에서 보여지고 싶지않은 데이터를 사용하고자 할때의 타입이다.

```
mutation Mutation($text: String, $userId: ID) {
  postTweet(text: $text, userId: $userId) {
    id
    author {
      username
      id
    }
    text
  }
}
```
 - Mutation의 경우 Query를 작성할때 명시적으로 적어야 한다.

 #### ! (느낌표) 사용
  - required 표현
  - Not Null과 같은 표현이다.
  - 사용하지 않는다면 해당 필드는 nullable과 같은 표현이다.
  ```
  allTweets : [Tweet!]!
  ```
  - 무조건 Tweet에 의한 배열을 리턴한다는 뜻이다.
  - [null]! 은 에러를 발생한다.


  #### resolvers
 - apollo에서 def를 통해 쿼리를 실행시키면 resolver의 동일한 이름의 데이터(혹은 메서드) 로 연결됨
 - resolvers 함수는 데이터베이스에 액세스한 다음 데이터를 반환.
 - resolvers 에서 함수가 실행될때 첫번째 argument는 root argument 이다. 실제로 사용자가 입력한 argument는 두번쨰 부터 들어간다.
 -  두번째 인자가 mutaion에서 보낸 인자이다.
 ```
     Query:{
        allTweets(){
            return tweets;
        },
        tweet(root,{id}){
            return tweets.find(tweet=>tweet.id === id);
        }

    }
 ```
  * 위에서 {id} 부분이 typeDefs에서 정의한 ID가 들어가는 곳이다.