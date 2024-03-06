import React, { useState } from 'react';
import './App.css';

function MultiSigWallet() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [approvedTransactions, setApprovedTransactions] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !recipient) {
      setError('Please enter both amount and recipient.');
      return;
    }
    const transaction = { amount, recipient };
    setPendingTransactions([...pendingTransactions, transaction]);
    setAmount('');
    setRecipient('');
    setError('');
  };

  const handleApprove = (index) => {
    const approvedTransaction = pendingTransactions[index];
    setApprovedTransactions([...approvedTransactions, approvedTransaction]);
    setPendingTransactions(pendingTransactions.filter((_, i) => i !== index));
    setError('');
  };

  const handleExecute = (index) => {
    const executedTransaction = approvedTransactions[index];
    console.log('Executing transaction:', executedTransaction);
    setApprovedTransactions(approvedTransactions.filter((_, i) => i !== index));
    setError('');
  };

  const submitTransaction = async () => {
    try {
      // Here you can add the logic to submit the transaction to the blockchain
      console.log('Submitting transaction:', pendingTransactions[0]);
      // Simulate a delay to mimic transaction submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Remove the submitted transaction from pendingTransactions
      setPendingTransactions(pendingTransactions.slice(1));
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setError('Error submitting transaction.');
    }
  };

  return (
    <div className="multisig-wallet">
      <h1>MultiSig Wallet</h1>
      <div className="container">
        <div className="transaction-form">
          <h2>Submit Transaction</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient" />
            <button type="submit">Submit</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="transaction-approval">
          <h2>Approve Transaction</h2>
          {pendingTransactions.map((transaction, index) => (
            <div key={index} className="transaction-item">
              <p>Amount: {transaction.amount}, Recipient: {transaction.recipient}</p>
              <button onClick={() => handleApprove(index)}>Approve</button>
            </div>
          ))}
        </div>

        <div className="transaction-execution">
          <h2>Execute Transaction</h2>
          {approvedTransactions.map((transaction, index) => (
            <div key={index} className="transaction-item">
              <p>Amount: {transaction.amount}, Recipient: {transaction.recipient}</p>
              <button onClick={() => handleExecute(index)}>Execute</button>
            </div>
          ))}
        </div>

        <div className="transaction-submission">
          <h2>Submit Transaction to Blockchain</h2>
          {pendingTransactions.length > 0 && (
            <div className="transaction-item">
              <p>Amount: {pendingTransactions[0].amount}, Recipient: {pendingTransactions[0].recipient}</p>
              <button onClick={submitTransaction}>Submit</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MultiSigWallet;
