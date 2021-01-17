const { ApolloServer } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');
const typeDefs = require('./src/schemas/schema');
const resolvers = require('./src/resolvers/mergeResolvers');
const knex = require('./src/database/connection');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req, res}) => {
        return{
            req, 
            res
        }
    }
});

afterAll(async () => {
    await knex.destroy();
})

const { query, mutate } = createTestClient(server);

const getUsers = `
    query getUsers{
        users{
            id,
            id_user,
            username
        }
    }
`;

const registration = `
    mutation userSubmit($username: String!, $email: String!, $password: String!){
        registration(inputsUser: {username: $username, email: $email, password: $password}){
            username,
            email,
            password  
        }
    }
`;

const login = `
    query userLog($email: String!, $password: String!){
        login(email: $email, password: $password)
    }
`

describe('read, registration, login-in', () => {
    test('read', async () => {

        const readRes = await query({query: getUsers});
    
        expect(readRes).toMatchSnapshot();
        
    });

    test('registration', async () => {
        const registrationRes = await mutate(
            {
                mutation: registration,
                variables: {
                    username: 'giggino',
                    email: 'giggino@gmail.com',
                    password: 'gig12345'
                }
            }
        ) 

        expect(registrationRes).toMatchSnapshot()
    })

    test('login', async () => {
        const loginUsers = await query(
            {
                query: login,
                variables: {
                    email: 'giggino@gmail.com',
                    password: 'gig12345'
                }
            }
        )

        expect(loginUsers).not.toBe(null)
    })
});