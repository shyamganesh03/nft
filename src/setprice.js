import React,{useState} from 'react';
import * as js  from "./contracts/MyNFT.json";
import {useLocation} from 'react-router-dom';

function SetPrice(){
  const {state} = useLocation();
  
 
    React.useEffect(() => {
     
      
if(repeat === true){
price();

}
    });
    async function price(){
      setnftname(state);

     
  try{
 const Web3 = require('web3');

 const web3 = new Web3(Web3.givenProvider);
 

  if(window.ethereum){
    await window.ethereum.enable();
    
     }
     const accounts = window.ethereum.selectedAddress;

   
  if(nftname !== ''){
    const nftdata = await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${nftname}.json`,);

  const resdata = await nftdata.json();
  const metadata = js.default;
  const nftContract = new web3.eth.Contract(metadata,  resdata['ContractAddress']);
  alert(`price:${resdata['Price']}`);
 
 
  
    await nftContract.methods.setTokenState([resdata['Token']],"true").send({from:accounts});
    await nftContract.methods.setTokenPrice([resdata['Token']],resdata['Price']).send({from:accounts});
    await nftContract.methods.items(resdata['Token']).call();
    await nftContract.methods.approve( resdata['ContractAddress'], resdata['Token']).send({from:accounts});
    fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${nftname}.json`,
    {
      method:'PATCH',
      headers:{
        'CONTENT-TYPE': 'application/json',
      },
      body:JSON.stringify({
       'setPrice': 'true'
      })
    }
    );
    alert('Price is successfully upadated in your nft and sended for sale'); 
    setrepeat(false);



  }
}
catch(e){
    setrepeat(false);
alert(e.message);


}
}
    const[repeat,setrepeat] = useState(true);
    const[nftname,setnftname] = useState('');
    return(
        <div>
        <p>hello</p>
        </div>
    );
}

export default SetPrice;