import React from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
 
import { Menu } from './components/Menu';
import Auth from './pages/auth/Auth';
import Bookings from './pages/bookings/Bookings';
import NewOffer from './pages/places/offers/new-offer/NewOffer';
import MainTabs from './pages/MainTabs';
import PlaceDetail from './pages/places/discover/place-detail/PlaceDetail';
import EditOffer from './pages/places/offers/edit-offer/EditOffer';

import { configureHookStore } from "./hooks-store";
configureHookStore();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        {/* <IonSplitPane contentId="menuContent"> */}
        <Menu />
        <IonRouterOutlet id="menuContent">
          <Route path="/auth" component={Auth} />
          <Route path="/bookings" component={Bookings} />
          <Route path="/places/offers/new" component={NewOffer} />
          <Route path="/places/offers/edit/:offerId" component={EditOffer} />
          <Route path="/places/discover/:placeId" component={PlaceDetail} />
          <Route path="/" component={MainTabs} />
          {/* <Route path="/" render={() => <Redirect to="/places/discover" />} exact={true} /> */}
        </IonRouterOutlet>
        {/* </IonSplitPane> */}
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
