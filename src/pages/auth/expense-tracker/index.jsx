import { useAddTransaction } from "../../../hooks/useAddTransaction";
import { useGetTransactions } from "../../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../../hooks/useGetUserInfo";
import { useState } from "react";
import { signOut } from "firebase/auth";
import "./styles.css";
import { auth } from "../../../config/firebase-config";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TextExtraction } from "../../../hooks/TextExtraction";
import React, { useCallback, useEffect } from 'react';
import Tesseract from 'tesseract.js';


export const ExpenseTracker=()=>{


    const {addTransaction}=useAddTransaction();
    const {transactions, transactionTotals}=useGetTransactions();
    const {name, profilePhoto}=useGetUserInfo()||{};
    const Navigate=useNavigate();
    const {isAuth}=useGetUserInfo();

    const[description, setDescription]=useState("");
    const[transactionAmount, setTransactionAmount]=useState(0);
    const[transactionType, setTransactionType]=useState("expense");

    const{balance, income, expenses}=transactionTotals;

    
    const[answer, setAnswer]=useState("") 
    const API_KEY = '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';
    const[selectedImage,setSelectedImage]=useState(null);
    const[textResult,setTextResult]=useState("");
    const [text, setText] = useState("");
  const [answers, setAnswers] = useState({
    totalAmount: '',
    shopName: ''
  });
    const convertImageToText=useCallback(
        async()=>{
          if(!selectedImage)return;
          try{
            const{data}=await Tesseract.recognize(selectedImage,'eng',{
              logger:(info)=>console.log(info),
            });
            setTextResult(data.text);
          }catch(error){
            console.error('Error during recognition:',error);
          }
        }, [selectedImage]);
      useEffect(()=>{
    
        convertImageToText();
      },[selectedImage,convertImageToText]);
    
    
      useEffect(()=>{
        if (textResult !== "") {
          setText(textResult);
        }
      },[textResult]);

      useEffect(()=>{
        if(text!==""){
          handleSubmit();
        }
      },[text]);
    
      const handleChangeImage=(e)=>{
        if(e.target.files[0]){
          setSelectedImage(e.target.files[0]);
        }else{
          setSelectedImage(null);
          setTextResult('');
        }
      };



      const handleSubmit = async () => {
        try {
          const questions = ['What is the total amount?', 'What is the name of the shop?'];
          const answersData = {};
          for (const question of questions) {
            const response = await fetch('https://api-inference.huggingface.co/models/google-bert/bert-large-uncased-whole-word-masking-finetuned-squad', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
              },
              body: JSON.stringify({
                question,
                context: text,
              }),
            });
    
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            answersData[question] = data.answer;
          }
          setAnswers(answersData);
          if (answersData['What is the total amount?']) {
            setTransactionAmount(parseFloat(answersData['What is the total amount?']));
        }
        if (answersData['What is the name of the shop?']) {
            setDescription(answersData['What is the name of the shop?']);
        }
        } catch (error) {
          console.error('Error:', error);
        }
      };
    
 
    

    const onSubmit=(e)=>{
        e.preventDefault()
        addTransaction({description,transactionAmount, transactionType})
        setDescription("");
        setTransactionAmount(0);
    };
    const signUserOut=async()=>{
        try {
            await signOut(auth);
            localStorage.clear()
            Navigate("/")

        }
        catch(err)
        {
            console.error(err)
        }
        
    };
    return(
        <div className="entire">
            <div className="expense-tracker">
                <div className="container">
                    <h1>Hey {name}, </h1>
                    <h2>Welcome to your expense tracker.</h2>
                    <div className="balance">
                        <h3>Your Balance:</h3>
                        {balance >=0 ? <h2>${balance}</h2>:<h2>-${balance*-1}</h2>}
                        
                    </div>
                    <div className="summary">
                        <div className="income">
                            <h4>Income:</h4>
                            <p>${income}</p>
                        </div>
                        <div className="expenses">
                            <h4>Expenses:</h4>
                            <p>${expenses}</p>
                        </div>

                    </div>
                    <form className="add-transaction" onSubmit={onSubmit} >
                        <input type="text" placeholder="Description" value={answers['What is the name of the shop?']} required onChange={(e)=>setDescription(e.target.value)}/>
                        <input type="number" placeholder="Amount" value={answers['What is the total amount?']} required onChange={(e)=>setTransactionAmount(e.target.value)}/>
                        <input type="radio" id='expense' value="expense" checked={transactionType==="expense"} onChange={(e)=>setTransactionType(e.target.value)}/>
                        <label htmlFor="">Expense</label>
                        <input type="radio" id='income' value="income" checked={transactionType==="income"} onChange={(e)=>setTransactionType(e.target.value)} />
                        <label htmlFor="">Income</label>

                        

                        <button type="submit">Add Transaction</button>
                    </form>


                    

                    


                </div>
                {profilePhoto && 
                    <div className="profile"><img className="profile-photo" src={profilePhoto}/>
                    <button className="sign-out-button" onClick={signUserOut}>
                        Sign Out
                    </button>
                    </div>
                }
            </div>
            <div className="transactions">
                <h3>Transactions</h3>
                <ul>
                    {transactions.map((transactions)=>{
                        const {description,transactionAmount, transactionType }=
                        transactions;
                        return (
                            <li>
                                <h4>{description}</h4>
                                <p>${transactionAmount}<label style={{color: transactionType==="expense"?"red":"green"}}> {transactionType}</label></p>
                            </li>
                        )
                    }
                    )}
                </ul>

            </div>



            <div className='text-extract'>
        <h1>ImText</h1>
        <p>Get words in an image</p>
        <div className='input-wrapper'>
          <label htmlFor='upload'>Upload Image</label>
          <input type='file' id='upload' accept='image/*' onChange={handleChangeImage} />
        </div>
        <div className='result'>
          {selectedImage &&(
            <div className='box-image'>
              <img src={URL.createObjectURL(selectedImage)} alt='thumb' />
            </div>
          )}
          {/* {textResult &&(
            <div className='box-p'>
              <p>{textResult}</p>
            </div>
          )} */}
        </div>
      </div>

      
      {/* <h1>Ask a Question</h1>
      <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Enter text..."></textarea>
      <br /> */}
      {/*<button onClick={handleSubmit}>Get Answers</button>*/}
      {/* <h2>Total Amount Answer: {answers['What is the total amount?']}</h2>
      <h2>Shop Name Answer: {answers['What is the name of the shop?']}</h2> */}
            

            
        
        
        </div>
    ) 
}