# blockchain-developer-bootcamp-final-project
## create payment on blockchain
###  workflow
1. User can create their payment by submit amount,total amount and payer list.
 ```
 function createpayment (string memory _name,uint256 _total_am,string[] memory _payer_list) public{
    //create payment
 }
 ```
2. Payment receiver can cancel the payment.
```
function cancelpayment(uint _id) public{
    //cancel payment
}
```
3. payers can pay.
```
function pay(uint _id, string memory _payer)payable public{
    //pay
}
```
4. After paid,payer name will appear to paid list.
5. Receiver can withdraw the money received.
```
function withdraw(uint _id,uint256 _withdraw_amount)public {
    //withdraw
}
```
6. After all payer paid, the payment should be finished.
```
modifier checkfinished (uint _id){
    //checkfinished
}
```
