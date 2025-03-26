import axios from "axios";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import '../styles/TransactionTable.css'

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const { user, isLoading } = useContext(UserContext);

    // This retrieves the transactions to display in transaction history
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/transactions/history');
                console.log(response.data.data); // Check if the data structure is correct
                setTransactions(response.data.data); // Assuming 'data' contains the transaction array
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div>
            <h1 className="Header">Transaction History</h1>
            <table>
                <thead>
                    <tr>
                    </tr>
                    <tr>
                        {user?.user_type_id !== 1 && <th>Username</th>}
                        <th>Transaction Amount</th>
                        <th>Memo</th>
                        <th>Time</th>
                        <th>Account</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <tr key={transaction.transaction_id}>
                                {user?.user_type_id !== 1 && <td>{transaction.username}</td>}
                                {transaction.transaction_type_id === 1 ? <td>+${transaction.amount}</td> : <td>-${transaction.amount}</td>}
                                <td>{transaction.memo}</td>
                                <td>{new Date(transaction.time).toLocaleString()}</td>
                                {transaction.account_type_id === 1 ? <td>Checking</td> : <td>Savings</td> }
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No transactions available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
