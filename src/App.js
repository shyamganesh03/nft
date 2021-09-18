import React  from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Contract from './contractdeploy';
import SetPrice from './setprice';
import Buyers from './buyers';
import Nftsend from './nftsend';
import Routes from './route';
import Alg from './alg';

function App() {
  return(
    
       <Router>
    <Switch>
      <Route exact path="/" component={Routes} />
      <Route path="/deploy" component={Contract} />
      <Route path="/price" component={SetPrice}/>
      <Route path="/buy" component={Buyers}/>
      <Route path="/nftsend" component={Nftsend}/>
      <Route path="/alg" component = {Alg}/> 
    </Switch>
  </Router>
    
  );
}


export default App;