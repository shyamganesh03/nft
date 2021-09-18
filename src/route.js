import React,{useState} from 'react';
import { useHistory } from 'react-router-dom';

function Routes() {
    const history = useHistory();
    const[repeat,setrepeat] = useState(true);
  React.useEffect(() => { 
      
        async function nftcreation(){
        if(repeat === true){
          if(window.ethereum){
            await window.ethereum.enable();
            
             }
          const Web3 = require('web3');
          const web3 = new Web3(Web3.givenProvider);
      
          var url = new URLSearchParams(window.location.search);
       
          let nftnameparams = url.get('nftname');
          let setprice = url.get('setprice');
          let email = url.get('email');
          let algon = url.get('algon');
          let buy = url.get('buy');   
          let id ;
             if(algon !== 'true'){
               id = await web3.eth.net.getId();
             }
      
             const nftdata = await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${nftnameparams}.json`,);
             const resdata = await nftdata.json(); 
             
            
             if(resdata !== null){
               console.log(resdata);
             if(resdata['Nft_Symbol'] === 'BNB' && id !== 0){
              if(id === 97){
                  navigation(nftnameparams,setprice,email,algon);
              }
              else{
                alert(`please change your network to ${resdata['Nft_Symbol']}`);
                
              }
             }
             if(resdata['Nft_Symbol'] === 'MATICMUM' && id !== 0){
              if(id === 80001){
                  navigation(nftnameparams,setprice,email,algon);
              }
              else{
                alert(`please change your network to ${resdata['Nft_Symbol']}(POLYGON)`);
               
              }
             }
             if(resdata['Nft_Symbol'] === 'ETH' && id !== 0){
              if(id === 4){
                  navigation(nftnameparams,setprice,email,algon);
              }
              else{
                alert(`please change your network to ${resdata['Nft_Symbol']}`);
               
              }
            }
            if(algon === 'true'){
              history.push({pathname:'/alg', state:{name:nftnameparams,email:email,buy:buy}});
              console.log('work');
        } 
            }
           
        }
      setrepeat(false);
      }
      function navigation(name,price,email,alg){
   
        if(name !== null && price === null && email === null && alg === null){
            history.push({
                pathname:'/deploy',
                state:name
            });
        }
        if(price === 'true'){
         
           history.push({
               pathname:'/price',
               state:name
           });
        }
        if(price === 'false'){
         
           history.push({pathname:'/buy', state:{name:name,email:email}});
        }
        if(price === 'transfer'){
          history.push({
            pathname:'/nftsend',
            state:{name:name,email:email}
          });
       }
      }
       nftcreation();
  },[repeat,history]);
  
  
  return (
    <div className="App">
     
    </div>
  );
 
}

export default Routes;