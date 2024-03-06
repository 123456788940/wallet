import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './index.css'; // Import the CSS file


const StakingApp = () => {
    const [depositAmount, setDepositAmount] = useState('');
    const [unstakeAmount, setUnstakeAmount] = useState('');
    const [depositStatus, setDepositStatus] = useState('');
    const [unstakeStatus, setUnstakeStatus] = useState('');
    const [web3, setWeb3] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [contract, setContract] = useState(null);
    const [stakingBalance, setStakingBalance] = useState(0);
    const [rewardBalance, setRewardBalance] = useState(0);

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                try {
                    // Request account access if needed
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const accounts = await web3Instance.eth.getAccounts();
                    setAccounts(accounts);
                } catch (error) {
                    console.error('Error fetching accounts:', error);
                }
            } else {
                console.error('Web3 not found in window.ethereum');
            }
        };

        initWeb3();
    }, []);

    useEffect(() => {
        if (web3) {
            const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
            const contractABI = [
              [
                {
                  "inputs": [],
                  "name": "deposit",
                  "outputs": [],
                  "stateMutability": "payable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "_user",
                      "type": "address"
                    },
                    {
                      "internalType": "uint256",
                      "name": "_amount",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "nonpayable",
                  "type": "constructor"
                },
                {
                  "inputs": [],
                  "name": "unstake",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "amount",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "name": "reward",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "rewardEarned",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "name": "stakerDeposit",
                  "outputs": [
                    {
                      "internalType": "bool",
                      "name": "",
                      "type": "bool"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "totalAmountStaked",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "user",
                  "outputs": [
                    {
                      "internalType": "address",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                }
              ]
            ];

            const stakingContract = new web3.eth.Contract(contractABI, contractAddress);
            setContract(stakingContract);
        }
    }, [web3]);

    useEffect(() => {
        const fetchStakingInfo = async () => {
            if (contract && accounts.length > 0) {
                const stakingBalance = await contract.methods.totalAmountStaked().call();
                setStakingBalance(web3.utils.fromWei(stakingBalance, 'ether'));

                const rewardBalance = await contract.methods.rewardEarned().call({ from: accounts[0] });
                setRewardBalance(web3.utils.fromWei(rewardBalance, 'ether'));
            }
        };

        fetchStakingInfo();
    }, [contract, accounts, web3]);

    const handleDeposit = async () => {
        try {
            if (!contract || !web3.utils.isAddress(accounts[0])) {
                console.error('Contract or account not initialized');
                return;
            }

            const valueInWei = web3.utils.toWei(depositAmount, 'ether');
            await contract.methods.deposit().send({ from: accounts[0], value: valueInWei });
            setDepositStatus('Deposit successful');
        } catch (error) {
            console.error('Error depositing:', error);
            setDepositStatus('Error depositing');
        }
    };

    const handleUnstake = async () => {
        try {
            if (!contract || !web3.utils.isAddress(accounts[0])) {
                console.error('Contract or account not initialized');
                return;
            }

            const valueInWei = web3.utils.toWei(unstakeAmount, 'ether');
            await contract.methods.unstake().send({ from: accounts[0], value: valueInWei });
            setUnstakeStatus('Unstake successful');
        } catch (error) {
            console.error('Error unstaking:', error);
            setUnstakeStatus('Error unstaking');
        }
    };

    return (
        <div className="container">
            <div className="box">
                <h2>Deposit</h2>
                <div className="input-container">
                    <input type="text" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Enter amount to deposit" />
                </div>
                <div className="button-container">
                    <button onClick={handleDeposit}>Deposit</button>
                </div>
                <div className="status-container">
                    <p>{depositStatus}</p>
                </div>
            </div>
            <div className="box">
                <h2>Unstake</h2>
                <div className="input-container">
                    <input type="text" value={unstakeAmount} onChange={(e) => setUnstakeAmount(e.target.value)} placeholder="Enter amount to unstake" />
                </div>
                <div className="button-container">
                    <button onClick={handleUnstake}>Unstake</button>
                </div>
                <div className="status-container">
                    <p>{unstakeStatus}</p>
                </div>
            </div>
            <div className="balance-container">
                <p>Staking Balance: {stakingBalance} ETH</p>
                <p>Reward Balance: {rewardBalance} ETH</p>
            </div>
        </div>
    );
};

export default StakingApp;
