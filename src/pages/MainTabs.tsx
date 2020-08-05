import React  from 'react';
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { Route } from 'react-router';
import { search, cardOutline } from 'ionicons/icons';
 
import Discover from './places/discover/Discover';
import Offers from './places/offers/Offers';

const MainTabs: React.FC  = () => {

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/places/discover" render={() => <Discover />} exact={true} />
        <Route path="/places/offers" render={() => <Offers />} exact={true} />
        <Route path="/" render={() => <Discover />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="discover" href="/places/discover">
          <IonLabel>Discover</IonLabel>
          <IonIcon icon={search} />
        </IonTabButton>
        <IonTabButton tab="offers" href="/places/offers">
          <IonLabel>Offers</IonLabel>
          <IonIcon icon={cardOutline} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;