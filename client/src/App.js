import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks'
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Headers from './components/Headers';
import Homepage from './components/Homepage';
import Threads from './components/Threads';
import Setting from './components/Setting';
import Profiles from './components/Profiles';
import CreatePost from './components/CreatePost';
import MainPage from './components/MainPage';
import NotFound from './components/NotFound';
import ModelLogin from './components/ModelLogin';
import ModelSignup from './components/ModelSignup';
import Chat from './components/Chat';
import apolloClient from './apolloClients';
import { TokensProvider } from './context/TokensContext';
import { PostsThreadsProvider } from './context/PostsThreadsContext';
import { HeaderProvider } from './context/HeaderContext';
import { ProfileProvider } from './context/ProfileContext';
import { ThreadProvider } from './context/ThreadContext';
import { MainProvider } from './context/MainContext';
import { NotificationProvider } from './context/NotificationContext';
import { FriendsProvider } from './context/FriendsContext';
import { ChatSystemProvider } from './context/ChatSystemContext';
import { ThreadVoteProvider } from './context/ThreadVoteContext';
import { NightModeProvider } from './context/NightModeContext';
import PrivateRoutes from './components/PrivateRoutes';
import './Style.scss'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ToastProvider>
        <TokensProvider>
          <NightModeProvider>
            <ProfileProvider>
                <HeaderProvider>
                  <ChatSystemProvider>
                    <NotificationProvider>
                      <FriendsProvider>
                        <MainProvider>
                          <ThreadProvider>
                            <ThreadVoteProvider>
                              <PostsThreadsProvider>
                                <div className="App">
                                  <Router>
                                    <Headers />
                                    <Switch>
                                      <Route exact path="/" component={Homepage}/>
                                      <Route exact path="/main/:id" component={MainPage}/>
                                      <Route path="/user/:id" component={Profiles}/>
                                      <PrivateRoutes path="/profile/:id" component={Profiles}/>
                                      <PrivateRoutes path="/setting/:id" component={Setting}/>
                                      <Route exact path="/main/thread/:id" component={Threads}/>
                                      <PrivateRoutes exact path="/createPost" component={CreatePost}/>
                                      <Route component={NotFound} />
                                    </Switch>
                                    <ModelLogin />
                                    <ModelSignup />
                                    <Chat />
                                  </Router>
                                </div>
                              </PostsThreadsProvider>
                            </ThreadVoteProvider>
                          </ThreadProvider>
                        </MainProvider>
                      </FriendsProvider>
                    </NotificationProvider>
                  </ChatSystemProvider>
                </HeaderProvider>
            </ProfileProvider>
          </NightModeProvider>
        </TokensProvider>
      </ToastProvider>
    </ApolloProvider>
  );
}

export default App;
