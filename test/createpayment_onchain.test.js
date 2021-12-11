const createpayment_onchain = artifacts.require("createpayment_onchain");
let { catchRevert } = require("./exceptionsHelpers.js");
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("createpayment_onchain", function ( accounts ) {

  beforeEach(async () => {
    instance = await createpayment_onchain.new()
    await instance.initialize();

  });
  it("should assert true", async function () {
    return assert.isTrue(true);
  });
  it("function createpayment() shouldbeok", async function () {
    const account_one = accounts[0];
    const account_two = accounts[1];
    let name="test";
    let total_am=10;
    let payer_list=["jack","zhang"];
    let price= total_am/payer_list.length

    await instance.createpayment(name,total_am,payer_list,{from: account_one})
    const result = await instance.fetch_payment.call(0)
    assert.equal(
      result[0],
      name,
      "the name of fund does not match the expected value",
    );
    assert.equal(
      result[1],
      account_one,
      "The receiver should be the man who call createfund",
    );
    assert.equal(
      result[2],
      total_am,
      "The total amount should be right",
    );
    assert.equal(
      result[3][0],
      payer_list[0],
      "The payer list should be same as provide",
    );
    assert.equal(
      result[3][1],
      payer_list[1],
      "The payer  list should be same as provide",
    );
    assert.equal(
      result[4].length,
      0,
      "The paid list should be empty",
    );
    assert.equal(
      result[5],
      0,
      "The received amount should be zero",
    );
    assert.equal(
      result[6],
      0,
      "The balance should be zero",
    );
    assert.equal(
      result[7],
      false,
      "The iscanceled should be false",
    );
    assert.equal(
      result[8],
      false,
      "The isfinished should be false",
    );
    assert.equal(
      result[9],
      price,
      "The price should be right",
    );
    await instance.createpayment(name,total_am,payer_list,{from :account_two})
    let resultn = await instance.fetch_payment.call(1)
    assert.equal(
      resultn[1],
      account_two,
      "The receiver should be the man who call createfund",
    );
  });
  it("it should emit Logcreatepayment() event", async () => { 
    let eventEmitted = false;
    const account_one = accounts[0];
    const account_two = accounts[1];
    let name="test";
    let total_am=10;
    let payer_list=["jack","zhang"];

    let tx=await instance.createpayment(name,total_am,payer_list,{from: account_one})
    if (tx.logs[0].event == "Logcreatepayment") {
      eventEmitted = true;
    }

    assert.equal(
      eventEmitted,
      true,
      "create a payment should emit a  Logcreatepayment event",
    );
  });


  it("function cancelpayment() should be ok", async () => { 
  const account_one = accounts[0];
  const account_two = accounts[1];    
  let name="test"; 
  let total_am=5000000000;
  let payer_list=["jack","a"];
  let price= total_am/payer_list.length
  let id=0;
  let value=5000000000;
  await instance.createpayment(name,total_am,payer_list)    
  await catchRevert( instance.cancelpayment(id,{from: account_two}) )
  let result = await instance.fetch_payment.call(0)
    assert.equal(
      result[7],
      false,
      "The iscanceled should still be false ",
    );
  await  instance.cancelpayment(id,{from: account_one}) 
  let result2 = await instance.fetch_payment.call(0)
    assert.equal(
      result2[7],
      true,
      "The iscanceled should be true ",
      ); 
  await catchRevert(instance.pay(id,'a',{from: account_two, value:value}));    //should be reverted because payment is already canceled
  })
  it("function cancelpayment() should be reverted if payment already finished", async () => { 
    const account_one = accounts[1];
    const account_two = accounts[2];    
    let name="test"; 
    let total_am=5000000000;
    let payer_list=["jack","a"];
    let price= total_am/payer_list.length
    let id=0;
    let value=5000000000;
    await instance.createpayment(name,total_am,payer_list,{from: account_one})
    await instance.pay(id,'a',{from: account_two, value:price});
    await instance.pay(id,'jack',{from: account_one, value:price});
    await catchRevert(instance.cancelpayment(id,{from: account_one})) //should be reverted because payment is already finished

  })
  it("it should emit  Logcancelpayment() event", async () => { 
    let eventEmitted = false;
    const account_one = accounts[0];
    const account_two = accounts[1];
    let name="test";
    let total_am=10;
    let payer_list=["jack","zhang"];
    let id=0;

    await instance.createpayment(name,total_am,payer_list,{from: account_one})
    let tx=await instance.cancelpayment(id,{from: account_one})
    if (tx.logs[0].event == "Logcancelpayment") {
      eventEmitted = true;
    }

    assert.equal(
      eventEmitted,
      true,
      "cancel a payment should emit a Logcancelpayment event",
    );
  });
  it(" function pay() should be ok", async function () {
    const account_one = accounts[0];
    const account_two = accounts[1];    
    let name="test"; 
    let total_am=5000000000;
    let payer_list=["jack","a"];
    let price= total_am/payer_list.length
    let id=0;
    let value=5000000000;
    await instance.createpayment(name,total_am,payer_list);
    await catchRevert(instance.pay(id,'b',{from: account_one, value:5}));   //should revert if the person not in payer list
    let account_two_balance=await web3.eth.getBalance(account_two);
    await instance.pay(id,'a',{from: account_two, value:value});
    let  account_two_balance_new=await web3.eth.getBalance(account_two); 
    assert.equal(
      (account_two_balance-account_two_balance_new)>0,
      true,
      "payer should be charged money",
      );
    let result=await instance.fetch_payment.call(id);
    assert.equal(
      result[4][0],
      "a",
      "paid person should append in paid_payer_list ",
      );   
    assert.equal(
      result[5],
      price,
      "received amount should be added as price ",
      );
    assert.equal(
      result[6],
      price,
      "balance should be added as price",
      );         
    await catchRevert(instance.pay(id,'a',{from: account_one, value:5}));//should revert if the person already paid
  })
  it("it should emit  Logpay() event", async () => { 
    let eventEmitted = false;
    const account_one = accounts[0];
    const account_two = accounts[1];    
    let name="test"; 
    let total_am=5000000000;
    let payer_list=["jack","a"];
    let price= total_am/payer_list.length
    let id=0;
    let value=5000000000;
    await instance.createpayment(name,total_am,payer_list,{from: account_one})
    let tx=await  instance.pay(id,'a',{from: account_two, value:price});
    if (tx.logs[0].event == "Logpay") {
      eventEmitted = true;
    }

    assert.equal(
      eventEmitted,
      true,
      "pay should emit a Logpay event",
    );
  });
  it("modifier checkfinished() should work", async function () {
    const account_one = accounts[0];
    const account_two = accounts[1];    
    let name="test"; 
    let total_am=5000000000;
    let payer_list=["jack","a"];
    let price= total_am/payer_list.length
    let id=0;
    let value=5000000000;
    await instance.createpayment(name,total_am,payer_list,{from: account_one})
    await instance.pay(id,'a',{from: account_two, value:price});
    let result1 = await instance.fetch_payment.call(0)
    assert.equal(
      result1[8],
      false,
      "The isfinished should still be false when not all people paid ",
    );
    await instance.pay(id,'jack',{from: account_one, value:price});
    let result2 = await instance.fetch_payment.call(0)
    assert.equal(
      result2[8],
      true,
      "The isfinished should be true after all people paid ",
    );


  });
  it("it should emit  Logfinish() event", async () => { 
    let eventEmitted = false;
    const account_one = accounts[0];
    const account_two = accounts[1];    
    let name="test"; 
    let total_am=5000000000;
    let payer_list=["jack","a"];
    let price= total_am/payer_list.length
    let id=0;
    let value=5000000000;
    await instance.createpayment(name,total_am,payer_list,{from: account_one})
    await  instance.pay(id,'a',{from: account_two, value:price});
    let tx=await   instance.pay(id,'jack',{from: account_two, value:price});
    if (tx.logs[1].event == "Logfinish") {
      eventEmitted = true;
    }
    assert.equal(
      eventEmitted,
      true,
      "pay should emit a Logpay event",
    );
  });

  it("it should emit Logpay() event", async () => { 
    let eventEmitted = false;
    const account_one = accounts[0];
    const account_two = accounts[1];    
    let name="test"; 
    let total_am=5000000000;
    let payer_list=["jack","a"];
    let price= total_am/payer_list.length
    let id=0;
    let value=5000000000;
    await instance.createpayment(name,total_am,payer_list,{from: account_one})
    let tx=await  instance.pay(id,'a',{from: account_two, value:price});
    if (tx.logs[0].event == "Logpay") {
      eventEmitted = true;
    }

    assert.equal(
      eventEmitted,
      true,
      "pay should emit a Logpay event",
    );
  });


  it(" function withdraw() should be ok", async function () {
    const account_one = accounts[0];
    const account_two = accounts[1];    
    let name="test"; 
    let total_am=5000000000;
    let payer_list=["jack","a"];
    let price= total_am/payer_list.length
    let id=0;
    let value=5000000000;
    await instance.createpayment(name,total_am,payer_list,{from:account_one});
    await instance.pay(id,'a',{from: account_two, value:value});
    await catchRevert( instance.withdraw(id,price+1)); //should revert if the withdraw amount more than balance
    await catchRevert( instance.withdraw(id,price,{from:account_two})); //should revert if the man who isn't receiver call withdraw()
    await  instance.withdraw(id,price,{from:account_one});
    let result=await instance.fetch_payment.call(id);
    assert.equal(
      result[5],
      price,
      "received amount should be same ",
      );
    assert.equal(
      result[6],
      0,
      "balance should be charged",
      );          
    

  });
  it("it should emit  Logwithdraw() event", async () => { 
    let eventEmitted = false;
    const account_one = accounts[0];
    const account_two = accounts[1];    
    let name="test"; 
    let total_am=5000000000;
    let payer_list=["jack","a"];
    let price= total_am/payer_list.length
    let id=0;
    let value=5000000000;
    await instance.createpayment(name,total_am,payer_list,{from: account_one})
    await  instance.pay(id,'a',{from: account_two, value:price});
    let tx=await instance.withdraw(id,price,{from:account_one});
    if (tx.logs[0].event == "Logwithdraw") {
      eventEmitted = true;
    }

    assert.equal(
      eventEmitted,
      true,
      "withdraw should emit a Logwithdraw event",
    );
  });
  it("it can pause", async () => { 
    const account_one = accounts[0];
    const account_two = accounts[1]; 

    await instance.pause({from:account_one})
    let paused=await instance.paused.call()
    assert.equal(
      paused,
      true,
      "should paused"
    )
    await catchRevert( instance.unpause({from:account_two}))//should revert when not owner calling unpause
    paused=await instance.paused.call()
    assert.equal(
      paused,
      true,
      "should paused"
    )
    await instance.unpause({from:account_one})
    paused=await instance.paused.call()
    assert.equal(
      paused,
      false,
      "should unpaused"
    )
    await  catchRevert( instance.pause({from:account_two}) ) //should revert when not owner calling pause
    paused=await instance.paused.call()
    assert.equal(
      paused,
      false,
      "should not be pause"
    )
    let name="test";
    let total_am=10;
    let payer_list=["jack","zhang"];
    await instance.pause({from:account_one})
    await  catchRevert( instance.createpayment(name,total_am,payer_list,{from: account_one})) //should revert when pause
    await  instance.unpause({from:account_one})
    await  instance.createpayment(name,total_am,payer_list,{from: account_one}) //should create payment successfully when unpause

    
  });
  it ("Ownership works well" , async () => { 
    const account_one = accounts[0];
    const account_two = accounts[1];  
    let owner=await instance.owner.call()   
    assert.equal(
      owner,
      account_one,
      "the initial owner should be msg.sender"
    )
    await  catchRevert(instance.transferOwnership(account_two,{from:account_two}))//should revert when not owner wanna transfer ownership
    await instance.transferOwnership(account_two,{from:account_one})
    owner=await instance.owner.call()   
    assert.equal(
      owner,
      account_two,
      "the owner should be transfered"
    )

  })
})

//   await instance.cancelpayment(id,{from: account_one}) 
//   const result3 = await instance.fetch_payment.call(0)
//   console.log(result3)
//   assert.equal(
//     result3[6],
//     true,
//     "The iscanceled should be true after canceling",
//   );
//   });

    
// });
