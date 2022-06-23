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


  #### resolver _root
   - resolver 의 root는 각 데이터의 객체가 들어가있다
   - 데이터가 아래와 같은 경우
  ```
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
  ```

    - 그리고 각 데이터를 호출하는 함수를 아래와 같이 했을때

  ```
  User(root){
    console.log(root)
    return users;
  }
  ```
  - console.log(root)에 찍히는 것은 아래와 같다.

  ```
    { id: '1', firstName: 'park', lastName: 'KIYOUNG' }
    { id: '2', firstName: 'Egon', lastName: 'Ailyon' }
  ```

  #### 다이나믹 로직
  1. 위의 users 데이터에서 fullname을 가지고 싶다.
  2. 그래서 defs에 fullName : String! 을 추가해주었다.
  3. 하지만 실질적인 데이터는 없다.
  4. resolver에 추가해주면 된다.
  ```
  Query: {
        ...,
        allUsers() {
            return users;
        }
    },
  User:{
    ...,
        fullName({firstName, lastName}){
            return `${firstName} ${lastName}` ;
        }
    }
  ```

  - 위의 코드를 통해 Query에서 allUsers를 실행시키게 되면 Apollo 서버가 user 의 fullName을 찾을 때 resolver의 fullName을 참고하게 된다.
  - 그래서 실제 데이터는 없지만 String! 에 위배 되지 않게, firstName 과 lastName이 조합된 모습을 볼 수 있다.


  #### connection
   - tweet을 저장할때 author이라는 user를 매핑하고 싶다.
   - postTweet을 할때 userId를 추가로 받는다. Tweet에 author:User! 추가해 준다.
   - resolvers에 아래와 같은 코드를 추가해준다.
   ```
   const resolvers = {
      Query: {
          allTweets() {
              return tweets;
          },
          ...
      },
      Mutation: {
        ...,
          postTweet(_, { text, userId }) {
              try {
                  if(users.find(user=>user.id === userId))
                  {
                      const newTweet = {
                          id: tweets.length + 1,
                          text: text,
                          userId
                      }
                      tweets.push(newTweet);
                      return newTweet;    
                  }else{
                      throw new Error("no User there");
                  }
              } catch (error) {
                  console.log(error)
              }
          },
      ...,
      Tweet : {
          author({userId}){
              return users.find(u=>u.id === userId);
          }
      }
  }
  ```
  - 위의 코드에서 postTweet이 실행될때 userId가 들어가게 되고 해당 userId는 return 되는 Tweet에서 root argument의 userId로 users를 참조하여 해당 데이터를 가져온다.


  #### schema description
   ```
   https://studio.apollographql.com/sandbox/schema/reference
   ```
  - 위를 보면 본인이 정의한 스키마를 확인하는데 description이 필요할 때가 있다.
  - 작성법은 아래와 같다.

  ```
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is the sum of first Name and Last Name
    """
    fullName : String!
  }
  ```

  - 원하는 대상 위에 """{contents}""" 를 쓰면 된다.

  ```
  https://altair.sirmuel.design/
  ```

  - apollo 서버에서 제공하는 API를 확인하는 서드파티 프로그램 혹은 웹이다.


 #### REST API 를 GraphQL 가져와보기
 - resolver에서 node-fetch를 사용해서 해당 데이터를 불러온다.
