import React, { useEffect, useState, useMemo } from "react";
import WalletRow from "./WalletRow";
import { useWalletBalances } from "./hooks/useWalletBalances";

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string; // Added blockchain property
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Props {
    className?: string;
}

// Implement the Datasource class so that it can retrieve the prices required.
class Datasource {
    url: string;

    constructor(url: string) {
        this.url = url;
    }

    async getPrices(): Promise<any> {
        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error("Failed to fetch prices");
            }
            return response.json();
        } catch (error) {
            throw new Error("Failed to fetch prices: " + error.message);
        }
    }
}

const WalletPage: React.FC<Props> = ({ className }) => {
    const balances = useWalletBalances();
    const [prices, setPrices] = useState<any>({});

    useEffect(() => {
        const datasource = new Datasource(
            "https://interview.switcheo.com/prices.json"
        );
        datasource
            .getPrices()
            .then((prices) => setPrices(prices))
            .catch((error) => console.error(error));
    }, []);
    /**
     * The sortedBalances array is sorted based on the priority of each balance's blockchain.
     * However, the getPriority function is called multiple times during the sorting process, which can be inefficient, especially if the balances array is large.
     * The priority should ideally be computed once for each balance and stored to avoid redundant calculations.
     */

    const sortedBalances = useMemo(() => {
        const getPriority = (blockchain: string): number => {
            switch (blockchain) {
                case "Osmosis":
                    return 100;
                case "Ethereum":
                    return 50;
                case "Arbitrum":
                    return 30;
                case "Zilliqa":
                case "Neo":
                    return 20;
                default:
                    return -99;
            }
        };

        return balances
            .filter(
                (balance: WalletBalance) =>
                    balance.amount <= 0 || getPriority(balance.blockchain) > -99
            )
            .sort(
                (lhs: WalletBalance, rhs: WalletBalance) =>
                    getPriority(rhs.blockchain) - getPriority(lhs.blockchain)
            );
    }, [balances]);

    /**
     * The formattedBalances array is created using map on sortedBalances to add a formatted property to each balance.
     * However, this information is not directly used in the rendering process.
     * If the formatted property is not required elsewhere, this step is redundant and adds unnecessary computation.
     */

    const rows = useMemo(() => {
        return sortedBalances.map((balance: WalletBalance, index: number) => {
            const formattedAmount = balance.amount.toFixed();
            const usdValue = prices[balance.currency] * balance.amount;
            return (
                <WalletRow
                    key={index}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={formattedAmount}
                />
            );
        });
    }, [sortedBalances, prices]);

    return <div className={className}>{rows}</div>;
};

export default WalletPage;
