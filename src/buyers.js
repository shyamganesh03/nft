import React,{useState} from 'react';
import * as js  from "./contracts/MyNFT.json";
import * as js2  from "./contracts/ethsend.json";
import {useLocation} from 'react-router-dom';

function Buyers(){
  const {state} = useLocation();
    React.useEffect(() => {
    
if(repeat === true){
buy();

}
    });
    async function buy(){
      alert();
      let nftnameparams = state.name;
      let email = state.email;
    try{
      const Web3 = require('web3');

      const web3 = new Web3(Web3.givenProvider);

    if(window.ethereum){
      await window.ethereum.enable();
      
       }

       const accounts = window.ethereum.selectedAddress; 

          
       
    if(nftnameparams !== 'null'){
      const nftdata = await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${nftnameparams}.json`,);
 
    const resdata = await nftdata.json();
    const metadata = js.default;
    const metadata2 = js2.default;
    const nftContract = new web3.eth.Contract(metadata,  resdata['ContractAddress']);
    const ethersend = new web3.eth.Contract(metadata2.abi,'0x5fCCB9Db10A632d4B7854Aca76af5E8D77AD0466');
  

       await ethersend.methods.sendss(resdata['WalletAddress']).send({
          from: accounts,
          value: web3.utils.toWei(resdata['Price'].toString(), 'ether')//ether
         });

      
       await nftContract.methods.transferFrom(resdata['WalletAddress'],accounts,resdata['Token']).send({
          from: accounts
        });
      
        const wallet = await  fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/User/${email}.json`);
        const resdata1 = await wallet.json();
          
       await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${nftnameparams}.json`,
        {
          method:'PATCH',
          headers:{
            'CONTENT-TYPE': 'application/json',
          },
          
          body:JSON.stringify({
            'buyed': 'true',
            'buyedowner': resdata1['address'],
            'buyername': resdata1['user'],
          })
        }
        );
  alert('nft successfully Buyed');
  setrepeat(false);
    }
  }
  catch(e){
  alert(e.message);
 
  setrepeat(false);
  }
}
    const[repeat,setrepeat] = useState(true);
    return(
        <div>
        <p>hello</p>
        </div>
    );
}

export default Buyers;