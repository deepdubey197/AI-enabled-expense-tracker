import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useGetUserInfo } from './useGetUserInfo';

export const useGetTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [transactionTotals, setTransactionsTotals] = useState({ balance: 0.0, income: 0.0, expenses: 0.0 });
    const transactionCollectionRef = collection(db, 'transactions');
    const { userID } = useGetUserInfo();

    const getTransactions = async () => {
        try {
            const queryTransactions = query(
                transactionCollectionRef,
                where('userID', '==', userID),
                orderBy('createdAt')
            );

            const unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
                let docs = [];
                let totalIncome = 0;
                let totalExpenses = 0;
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    docs.push({ ...data, id });
                    if (data.transactionType === 'expense') {
                        totalExpenses += Number(data.transactionAmount);
                    } else {
                        totalIncome += Number(data.transactionAmount);
                    }
                    console.log(totalExpenses, totalIncome)
                });

                setTransactions(docs);
                let balance = totalIncome - totalExpenses;
                setTransactionsTotals({
                    balance,
                    expenses: totalExpenses,
                    income: totalIncome
                });
            });

            return () => unsubscribe();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getTransactions();
        };

        fetchData();
    }, [userID]);

    // Destructuring with default values
    const { balance = 0.0, income = 0.0, expenses = 0.0 } = transactionTotals;

    return { transactions, transactionTotals: { balance, income, expenses } };
};