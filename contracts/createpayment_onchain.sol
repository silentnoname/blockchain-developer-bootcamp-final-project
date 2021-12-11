// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// @title Create Payment on chain
/// @author Silentnoname
/// @notice This is an experimental contract，please use at your own risk. Anyone can use this contract to create payment,pay payment
/// @dev This contract can be implemented as a upgradeable contract 
contract createpayment_onchain is PausableUpgradeable ,OwnableUpgradeable{  
    /// @notice Initialize the owner and pause situation
    /// @dev the initial owner is msg.sender,paused is false
    function initialize() initializer public {
      __Ownable_init();
      __Pausable_init();
    }

    /// @dev An increment interger for recording payment id
    uint counter;

    /// @notice A structure for each payment.
    struct Payment {
          uint id;
          string name;
          address  receiver;
          uint256 total_am;
          string[]  payer_list;
          string[]  paid_payer_list;
          uint256 received_am;
          uint256 balance;
          bool iscanceled;
          bool isfinished;  
          uint256 price;
      }

    /// @dev A map from id to payment
    mapping (uint => Payment) public payments;

    /// @dev A map from address to id array
    mapping (address => uint[]) public paymentsbook;

    /// @notice Event when createpayment
    event Logcreatepayment(uint indexed id,address receiver,uint256 total_am,string[] _payer_list );

    /// @notice Event when cancelpayment
    event Logcancelpayment(uint indexed id);

    /// @notice Event when pay
    event Logpay(uint id,string payer,address payer_address,uint256 price,uint256 received_am );

    /// @notice Event when withdraw
    event Logwithdraw(uint id,uint256 amount,uint256 balance,address receiver);

    /// @notice Event when payment finish
    event Logfinish(uint indexed id);

    modifier isReiceiver(uint _id){
      require(msg.sender==payments[_id].receiver,"You are not the payment receiver,cannot do this");
      _;
    } 

    modifier notcanceled (uint _id){
      require(payments[_id]. iscanceled== false,"The payment is already canceled");
      _;
    } 
    
    /// Check the payment finished or no by compare the length of payer_list and paid_payer_list, if equal,payment is finished
    modifier checkfinished (uint _id){
      _;
      if (payments[_id].payer_list.length== payments[_id].paid_payer_list.length)
      {
        payments[_id].isfinished=true;
        emit Logfinish(_id);
      }
    }

    modifier checkValue(uint _id) {
    /// Refund them after pay for item (why it is before, _ checks for logic before func)
      _;
      uint256 _price=payments[_id].total_am/payments[_id].payer_list.length;
      uint amountToRefund = msg.value - _price;
      payable(msg.sender).transfer(amountToRefund);
    }
    
    /// @notice Only owner can pause 
    function pause() public onlyOwner {
      _pause();
    }

    /// @notice Only owner can unpause 
    function unpause() public onlyOwner {
      _unpause();
    }

    /// @notice Create a payment by name,total amount,payer list.The payment receiver will be the man who create this payment.
    /// @dev Store payment in payments[counter].Payment id will be same as the counter. Payment id will be pushed into paymentsbook[msg.sender]. counter +1
    /// @param _name Name of the payment as the people who create the payment want
    /// @param _total_am Total amount of this paymeny
    /// @param _payer_list The list of the payer name
    function createpayment (string memory _name,uint256 _total_am,string[] memory _payer_list) public whenNotPaused() returns (bool) {
      payments[counter]=Payment({
        id:counter,
        name:_name,
        receiver: msg.sender,
        total_am: _total_am,
        payer_list:_payer_list,
        paid_payer_list:new string[](0),
        received_am:0,
        balance:0,
        iscanceled:false,
        isfinished:false,
        price: _total_am/_payer_list.length
      });
      emit Logcreatepayment(counter,msg.sender,_total_am, _payer_list);
      paymentsbook[msg.sender].push(counter);
      counter++;
      return true;
    }
    
    /// @notice Cancel the payment by payment id(only payment receiver can cancel this payment,finised payment cannot be canceled)
    /// @dev Change payments[_id].iscanceled to be true
    /// @param _id ID of the payment 
    function cancelpayment(uint _id) public whenNotPaused() isReiceiver(_id) notcanceled(_id) returns(bool){
      require(payments[_id].isfinished==false,"The payment is already finished,cannot be canceled");
      payments[_id].iscanceled=true;
      emit Logcancelpayment(_id);
      return true;
    }

    /// @notice Pay the payment by payment id and payer name,should pay enough money and give right payer name.One payer can only pay once,extra money will be refunded.(canceled payment cannot pay) 
    /// @dev  payments[_id].received_am and payments[_id].balance both +payments[_id].price. Push _payer in payments[_id].paid_payer_list. 
    /// @param _id ID of the payment
    /// @param _payer Name of the payer 
    function pay(uint _id, string memory _payer)payable public whenNotPaused() checkValue(_id)  checkfinished (_id) notcanceled(_id) returns(bool){
      bool ispayer=false;
      bool paid=false;
      for(uint i=0;i<payments[_id].payer_list.length;i++)
      {
        if( keccak256(abi.encodePacked(_payer)) ==keccak256(abi.encodePacked(payments[_id].payer_list[i])) ){
          ispayer=true;
        }
      }
      require(ispayer==true,"the payer name is not in this payment's payer list");
          for(uint i=0;i<payments[_id].paid_payer_list.length;i++)
      {
        if( keccak256(abi.encodePacked(_payer)) ==keccak256(abi.encodePacked(payments[_id].paid_payer_list[i])) ){
          paid=true;
        }
      }
      require (paid ==false,"You have already paid,should not pay twice");
      require(msg.value>=payments[_id].price,"should pay enough money");
      payments[_id].paid_payer_list.push(_payer);
      payments[_id].received_am=payments[_id].received_am+payments[_id].price;
      payments[_id].balance=payments[_id].balance+payments[_id].price;
      emit Logpay(_id,_payer,msg.sender,payments[_id].price,payments[_id].received_am);
      return true ;
    }

    /// @notice Withdraw the balance of payment by payment id and withdraw amount (only payment receiver can withdraw this payment's balance)
    /// @dev payments[_id].balance minus _withdraw_amount,transfer _withdraw_amount to msg.sender
    /// @param _id ID of the payment
    /// @param _withdraw_amount The amount payment receiver want to withdraw
    function withdraw(uint _id,uint256 _withdraw_amount)public whenNotPaused() isReiceiver(_id)  {
      require(payments[_id].balance>=_withdraw_amount,"payment should have enough balance to withdraw");
      payments[_id].balance=payments[_id].balance-_withdraw_amount;
      payable(msg.sender).transfer(_withdraw_amount);
      emit Logwithdraw(_id, _withdraw_amount, payments[_id].balance, msg.sender);
    }  
    
    /// @notice Get the payment detail by payment ID
    /// @dev  Get the payment detail by payments[_id]
    /// @param _id ID of the payment
    /// @return name Payment name
    /// @return receiver Payment receiver address
    /// @return total_am Payment total amount
    /// @return payer_list Payment payer list
    /// @return paid_payer_list Payment paid payer list
    /// @return received_am Payment total received amount
    /// @return balance Payment current balance
    /// @return iscanceled Payment canceled or no
    /// @return isfinished payment finished or no
    /// @return price payment price
    function fetch_payment (uint _id) public view returns(string memory name,address receiver,uint256  total_am,string[] memory payer_list,string[] memory paid_payer_list,uint256 received_am,uint256 balance,bool iscanceled,bool isfinished,uint256 price){
      name=payments[_id].name;
      receiver=payments[_id].receiver;
      total_am=payments[_id].total_am;
      payer_list=payments[_id].payer_list;
      paid_payer_list=payments[_id].paid_payer_list;
      received_am=payments[_id].received_am;
      balance=payments[_id].balance;
      iscanceled=payments[_id].iscanceled;
      isfinished=payments[_id].isfinished;
      price=payments[_id].price;
      return (name,receiver,total_am,payer_list,paid_payer_list,received_am,balance,iscanceled,isfinished,price);
    }

    /// @notice Get the payments created by given address
    /// @dev Get the array of payments' id by paymentsbook[_receiver_address]
    /// @param _receiver_address address who created payments
    /// @return payments_book Array of payments' id created by given address
    function fetch_paymentsbook (address _receiver_address) public view returns(uint[] memory payments_book){
      payments_book=paymentsbook[_receiver_address];
      return payments_book;
    }
}
