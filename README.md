# Reddit-Clone-Application

Hi this is the reddit clone application

Reddit Clone, as the name suggests it is the clone of the famous site Reddit, to develop this web app I used ReactJS, Node, Express and Postgres.
For the API instead of REST,  I decided to use GraphQL for three reasons
I had to create many routes for this app and with GraphQL I just had to use one endpoint for all the API calls.
With GraphQL I could manage and retrieve only pieces of information that I needed for the client-side instead of retrieving unused data.
I needed to use WebSockets for chat and notification, and GraphQL has also a feature called Subscriptions that is based on it.
For styling, I used sass pre-processor so I could organize my code,
with variables to not repeat myself and also create the Night mode feature.
For the login-system, I didn't use JWT tokens instead I used cookie with set-attribute httponly so it cannot be modified by client-side javascript.
This app includes almost all the basics actions of Reddit such as read, write, delete and update comments inside threads, create new threads, join different subject groups, vote system, friends system and create/chat with other users.<br/>


Deployment: Git, GitHub, Docker for containerization and AWS (EC2, RDS, ECR, ECS, ELB and route53)


<b>Things to add or to fix<b/><br/>
  <ul>
    <li>Pagination for user profile, so API doesn't need to load all the extra informations</li>
    <li>The tree structure for comments</li>
    <li>Improve ui error handling</li>
    <li>Improve the voting system, sometimes there are delays among API calls so the user has to refresh to see the selected vote</li>
  </ul>
  
 
 <h1>Suggestions</h1>
 <p>For login you can create your own account or you can login with root account</p>
 
 <h3>Root credentials</h3>
 <ul>
  <li>Email: root@gmail.com</li>
  <li>Password: 12345678</li>
 </ul>
 
