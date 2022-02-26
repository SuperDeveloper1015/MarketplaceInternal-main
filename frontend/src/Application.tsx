import React  from 'react';
import { Router, Switch, Route } from "react-router-dom";
import { RootStore } from "./stores";
import { ToastContainer } from "react-toastify";
import { Provider } from "inversify-react";
import IndexPage from "./pages/IndexPage";
import Header from "./components/Header";
import { ModalsContainer } from "./modals";
import ProfilePage from "./pages/ProfilePage";
import { Provider as UrqlProvider } from 'urql';
import ArtworkPage from "./pages/ArtworkPage";
import AboutPage from "./pages/AboutPage";
import CreatorListPage from "./pages/CreatorListPage";
import ArtworkListPage from "./pages/ArtworkListPage";

export const rootStore = new RootStore();
const container = rootStore.container

class Application extends React.Component {
    componentDidMount() {
        // rootStore.walletStore.tryReconnect();
    }

    render() {
        return (
            <UrqlProvider value={rootStore.urqlClient}>
                <Provider container={container}>
                    <Router history={rootStore.historyStore}>
                        <Header />

                        <Switch>
                            <Route exact path='/' component={IndexPage} />
                            <Route exact path='/creators' component={CreatorListPage} />
                            <Route path='/creators/:query' component={ProfilePage} />
                            <Route exact path='/artworks' component={ArtworkListPage} />
                            <Route path='/artworks/:artworkId' component={ArtworkPage} />
                            <Route path='/about' component={AboutPage} />
                        </Switch>

                        <ModalsContainer />

                        <ToastContainer theme='light' />
                    </Router>
                </Provider>
            </UrqlProvider>
        );
    }
}

export default Application;
