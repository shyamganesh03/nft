import React,{useState} from 'react';
import * as js  from "./contracts/MyNFT.json";
import {useLocation} from 'react-router-dom';

function Nftsend(){
   const {state} = useLocation();
   const[repeat,setrepeat] = useState(true);
 const[nftname,setnftname] = useState('');
    React.useEffect(() => {
      async function nftsend(){
    
        setnftname(state.name);
       let email = state.email;
      try{
        const Web3 = require('web3');

        const web3 = new Web3(Web3.givenProvider);
  
      if(window.ethereum){
        await window.ethereum.enable();
        
         }
         const accounts = prompt("ENTER WALLET ADDRESS IN WHICH YOU NEED TO SEND YOUR NFT");
  
      if(nftname !== null){
       
  
        const nftdata = await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${state}.json`,);
   
      const resdata = await nftdata.json();
    
      const wallet = await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/User/${email}.json`);
      const resdata2 = await wallet.json();
    
      const metadata = js.default;
      const nftContract = new web3.eth.Contract(metadata,  resdata['ContractAddress']);
    
   
      await nftContract.methods.safeTransferFrom(resdata['WalletAddress'],accounts,resdata['Token']).send({
            from:resdata['WalletAddress']
          });
          fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${state}.json`,
          {
            method:'PATCH',
            headers:{
              'CONTENT-TYPE': 'application/json',
            },
            body:JSON.stringify({
                'WalletAddress': accounts,
                'user': resdata2['user'],
            })
          }
          );
    alert('successfully nft transfer finished');
     setrepeat(false);
      }
    }
    catch(e){
        setrepeat(false);
        if(e.message === "Cannot read property 'user' of null"){
          alert("Can't able to find the user account");
        }
        else{
    alert(e.message);
        }
   
    }
  }
if(repeat === true){
nftsend();
setrepeat(false);
}
    },[repeat,nftname,state]);

   
 
    return(
        <div>
        <p>hello</p>
        </div>
    );
}

export default Nftsend;