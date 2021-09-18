import React from 'react';
import {useLocation} from 'react-router-dom';
import './alg.css';

 function Alg(){
    const {state} = useLocation();
    
    const algosdk = require('algosdk');
    
  const name = state.name;
  const em = state.email;
  const buys = state.buy;
  
    const indexerserver = 'https://testnet-algorand.api.purestake.io/idx2';
    const indexport='';
    const server = "https://testnet-algorand.api.purestake.io/ps2";
    const port = "";
    const token = {
        'X-API-key' : '0ZUqoC9fEd3NCgXW6V8SA8USTDFBupGGfArfcQK6',
    }
    let algodclient = new algosdk.Algodv2(token, server, port);
    let algoindexer = new algosdk.Indexer(token,indexerserver,indexport);
    
     const waitForConfirmation = async function (algodclient, txId) {
        let response = await algodclient.status().do();
        let lastround = response["last-round"];
        while (true) {
            const pendingInfo = await algodclient.pendingTransactionInformation(txId).do();
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                console.log("Transaction " + txId + " confirmed in round " + pendingInfo["confirmed-round"]);
                break;
            }
            lastround++;
            await algodclient.statusAfterBlock(lastround).do();
        }
    };
    
    const printCreatedAsset = async function (algodclient, account, assetid) {
       
        let accountInfo = await algodclient.accountInformation(account).do();
        for (let idx = 0; idx < accountInfo['created-assets'].length; idx++) {
            let scrutinizedAsset = accountInfo['created-assets'][idx];
            if (scrutinizedAsset['index'] === assetid) {
                console.log("AssetID = " + scrutinizedAsset['index']);
                let myparms = JSON.stringify(scrutinizedAsset['params'], undefined, 2);
                console.log("parms = " + myparms);
                break;
            }
        }
    };
   
    const printAssetHolding = async function (algodclient, account, assetid) {
        
        let accountInfo = await algodclient.accountInformation(account).do();
        for (let idx = 0; idx < accountInfo['assets'].length; idx++) {
            let scrutinizedAsset = accountInfo['assets'][idx];
            if (scrutinizedAsset['asset-id'] === assetid) {
                let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
                console.log("assetholdinginfo = " + myassetholding);
                break;
            }
        }
    };
    if(buys === 'true'){
            buy();
        }
    
async function create(assetName){
    const nftdata =await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${name}.json`,);
    const resdata =await nftdata.json();
    
    let params = await algodclient.getTransactionParams().do();
    params.fee = 100;
    params.flatFee = true;
    const program = new Uint8Array(Buffer.from('ASAEADoKAS0VIhJAACIvFSISQAAVLRUjEkAAAC4VIg1AAAAvFSQNQAAGLS4TQAAAJQ==', "base64"));
    const args=[];
    args.push([...Buffer.from(resdata['Wallet'])]);
    args.push([...Buffer.from(assetName)]);
    args.push([...Buffer.from(resdata['Image_url'])]);
    args.push([...Buffer.from('')]);
    let lsig = algosdk.makeLogicSig(program,args);
    const addrc = lsig.address();
    let note = undefined;    
    let defaultFrozen = false;
    let decimals = 0;
    let totalIssuance = 1;
    let unitName = "ALGO";
    let assetMetadataHash = '';
    
    let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(lsig.address(), note,
         totalIssuance, decimals, defaultFrozen, addrc, addrc,addrc,
        addrc, unitName, assetName, resdata['Image_url'], assetMetadataHash, params);
    
         let rawSignedTxn = algosdk.signLogicSigTransaction(txn, lsig).blob;
        console.log('result: '+ rawSignedTxn);
       let result = await algodclient.sendRawTransaction(rawSignedTxn).do();
    await waitForConfirmation(algodclient, result.txId);
    let ptx = await algodclient.pendingTransactionInformation(result.txId).do();
    let assetID = ptx["asset-index"];
    await printCreatedAsset(algodclient,lsig.address(), assetID);
    await printAssetHolding(algodclient,lsig.address(), assetID);
    await transfer(lsig.address(),resdata['Wallet'],assetID);
    await  fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${name}.json`,
    {
      method:'PATCH',
      headers:{
        'CONTENT-TYPE': 'application/json',
      },
      body:JSON.stringify({
        'ContractAddress': lsig.address(),
        'Token': assetID,
      })
    }
    );
    alert('asset created successfully');
}

async function transfer(addr1,addr2,id){
    const nftdata =await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${name}.json`,);
    const resdata =await nftdata.json();
    if(addr1 === ''){
        addr1 = resdata['WalletAddress'];
    }
    if(addr2 === ''){
        addr2 = prompt("ENTER WALLET ADDRESS IN WHICH YOU NEED TO SEND YOUR NFT");
       console.log(addr2);
    }
    let program = new Uint8Array(Buffer.from("ASAEADoKAS0VIhJAACIvFSISQAAVLRUjEkAAAC4VIg1AAAAvFSQNQAAGLS4TQAAAJQ==", "base64"));
    const args=[];
    args.push([...Buffer.from(addr1)]);
    args.push([...Buffer.from(addr2)]);
    args.push([...Buffer.from('')]);
    
    let lsig = algosdk.makeLogicSig(program,args);
    let  params = await algodclient.getTransactionParams().do();
      params.fee = 1000;
      params.flatFee = true;
      let revocationTarget = undefined;
     let closeRemainderTo = undefined;
       let  amount = 0;
    let note = undefined;
  
       let opttxn = algosdk.makeAssetTransferTxnWithSuggestedParams(addr1, addr2, closeRemainderTo, revocationTarget,
            amount, note, id, params);
        
       let rawSignedTxn = algosdk.signLogicSigTransaction(opttxn,lsig).blob;
      let opttx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
      console.log("Transaction : " + opttx.txId);
      
      await waitForConfirmation(algodclient, opttx.txId);
      let opttxn2 = algosdk.makeAssetTransferTxnWithSuggestedParams(addr2, addr2, closeRemainderTo, revocationTarget,
          1, note, id, params);
     
     let rawSignedTxn2 = algosdk.signLogicSigTransaction(opttxn2,lsig).blob;
    let opttx2 = (await algodclient.sendRawTransaction(rawSignedTxn2).do());
    console.log("Transaction : " + opttx2.txId);
    
    await waitForConfirmation(algodclient, opttx2.txId);
     let manager = addr2;
     let reserve = addr2;
     let freeze = addr2;
     let clawback = addr2;
      let ctxn = algosdk.makeAssetConfigTxnWithSuggestedParams(addr1, note, 
      id, manager, reserve, freeze, clawback, params);
  
      rawSignedTxn = algosdk.signLogicSigTransaction(ctxn,lsig).blob;
      let ctx = (await algodclient.sendRawTransaction(rawSignedTxn).do());
      console.log("Transaction : " + ctx.txId);
    
      await waitForConfirmation(algodclient, ctx.txId);
      await printCreatedAsset(algodclient,addr1, id);
      await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${name}.json`,
      {
        method:'PATCH',
        headers:{
          'CONTENT-TYPE': 'application/json',
        },
        body:JSON.stringify({
          'WalletAddress': addr2,
        })
      }
      );
  }
  
  async function buy(){
    const nftdata =await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${name}.json`,);
    const resdata =await nftdata.json();
    const userdata = await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/User/${em}.json`,);
    const resdata2 = await userdata.json();
    
   let program = new Uint8Array(Buffer.from("ASAEADoKAS0VIhJAACIvFSISQAAVLRUjEkAAAC4VIg1AAAAvFSQNQAAGLS4TQAAAJQ==", "base64"));
   const args=[];
    args.push([...Buffer.from('')]);
   let lsig = algosdk.makeLogicSig(program,args);
     
      let a1response = await algoindexer.searchForTransactions()
      .address(resdata2['algorand_address']).do();
      let a1length = a1response.transactions.length;
     let a2response = await algoindexer.searchForTransactions()
     .address(lsig.address()).txid(a1response.transactions[a1length - 1].id).do();
     
    if(a2response.transactions.length !== 0){
           if(a2response.transactions.amount !== algosdk.algosToMicroalgos(parseInt(resdata['Price']))){
        let bigamount;
        let smallamount;
        if(a2response.transactions.amount > algosdk.algosToMicroalgos(parseInt(resdata['Price']))){
            bigamount = a2response.transactions.amount;
            smallamount = algosdk.algosToMicroalgos(parseInt(resdata['Price']));
        }
        else{
            bigamount = algosdk.algosToMicroalgos(parseInt(resdata['Price']));
            smallamount = a2response.transactions.amount;
        }
        let balance = bigamount - smallamount;
       await buy2(lsig.address(),resdata2['algorand_address'],balance,lsig);
           }
   else{
       await buy2(lsig.address(),resdata['WalletAddress'],algosdk.algosToMicroalgos(parseInt(resdata['Price'])),lsig);
   }
    
      await transfer(resdata['WalletAddress'],resdata2['algorand_address'],resdata['Token']);
      await fetch(`https://nft-app-ec882-default-rtdb.firebaseio.com/NFT/${name}.json`,
      {
        method:'PATCH',
        headers:{
          'CONTENT-TYPE': 'application/json',
        },
        body:JSON.stringify({
         'buyed': 'true'
        })
      }
      );
    }
  }
  async function buy2(a1,a2,amount,lis){
    let  params = await algodclient.getTransactionParams().do();
    params.fee = 1000;
  params.flatFee = true;
    const waitForConfirmation1 = async function (algodClient, txId, timeout) {
        if (algodClient == null || txId == null || timeout < 0) {
            throw new Error("Bad arguments");
        }
    
        const status = (await algodClient.status().do());
        if (status === undefined) {
            throw new Error("Unable to get node status");
        }
    
        const startround = status["last-round"] + 1;
        let currentround = startround;
    
        while (currentround < (startround + timeout)) {
            const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
            if (pendingInfo !== undefined) {
                if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                    //Got the completed Transaction
                    return pendingInfo;
                } else {
                    if (pendingInfo["pool-error"] != null && pendingInfo["pool-error"].length > 0) {
                        // If there was a pool error, then the transaction has been rejected!
                        throw new Error("Transaction " + txId + " rejected - pool error: " + pendingInfo["pool-error"]);
                    }
                }
            }
            await algodClient.statusAfterBlock(currentround).do();
            currentround++;
        }
    }
    let txn = algosdk.makePaymentTxnWithSuggestedParams(a1,a2,amount,undefined,undefined,params);
     
    let signedTxn = algosdk.signLogicSigTransaction(txn,lis);
    console.log('txn: '+ txn);
    console.log(signedTxn);
let txId = txn.txID().toString();
await algodclient.sendRawTransaction(signedTxn.blob).do();
        // Wait for confirmation
        let confirmedTxn = await waitForConfirmation1(algodclient, txId, 4);
        //Get the completed Transaction
        console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
        let mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
        console.log("Transaction information: %o", mytxinfo);
        var string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
        console.log("Note field: ", string);
  }
    return(<div>
        
     <button onClick={()=>create(name)}>CREATE</button>
     <button onClick={()=>{transfer('','')}}>TRANSFER</button>
    </div>);
}

export default Alg;