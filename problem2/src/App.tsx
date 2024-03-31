import axios from "axios";
import { useEffect, useState } from "react";
import { styled } from "styled-components";

import "./App.css";
import SwapSection from "./components/SwapSection";
import { TokenPriceInfo } from "./types";
import { EInputType } from "./enums";

const DEFAULT_CURRENCY_YOUR_PAY = "ETH";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
`;

const Heading = styled.h1`
    font-size: 56px;
    font-weight: 700;
    margin-bottom: 32px;
    color: rgb(34, 34, 34);
    text-align: center;
    width: 100%;
`;

interface SelectedToken {
    yourPay: TokenPriceInfo;
    yourReceive: TokenPriceInfo;
}

function App() {
    const [tokenPriceInfo, setTokenPriceInfo] = useState<TokenPriceInfo[]>([]);

    const [selectedToken, setSelectedToken] = useState<{
        yourPay: TokenPriceInfo;
        yourReceive: TokenPriceInfo;
    }>({
        yourPay: {} as TokenPriceInfo,
        yourReceive: {} as TokenPriceInfo,
    });

    const [amountOutput, setAmountOutput] = useState<any>({
        amountYouPay: "",
        amountYouReceive: "",
    });

    const getPrices = async () => {
        try {
            const response = await axios.get(
                "https://interview.switcheo.com/prices.json"
            );
            if (response && response.data) {
                setTokenPriceInfo(response.data);
                setSelectedToken({
                    yourPay: response.data.find(
                        (token: TokenPriceInfo) =>
                            token.currency === DEFAULT_CURRENCY_YOUR_PAY
                    ),
                    yourReceive: {} as TokenPriceInfo,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAmountInput = (type: EInputType, amountInput: string) => {
        switch (type) {
            case EInputType.PAY: {
                setAmountOutput({
                    ...amountOutput,
                    amountYouPay: amountInput,
                });

                break;
            }

            default: {
                return null;
            }
        }
    };

    const handleGetSelectedToken = (
        type: EInputType,
        token: TokenPriceInfo
    ) => {
        switch (type) {
            case EInputType.PAY: {
                setSelectedToken({
                    ...selectedToken,
                    yourPay: token,
                });
                break;
            }

            case EInputType.RECEIVE: {
                setSelectedToken({
                    ...selectedToken,
                    yourReceive: token,
                });
                break;
            }

            default: {
                return null;
            }
        }
    };

    const calculateAmount = (selectedToken: SelectedToken) => {
        const amountYouPay = parseFloat(amountOutput.amountYouPay);
        const tokenPrice = tokenPriceInfo.find(
            (token) => token.currency === selectedToken.yourReceive.currency
        );
        if (tokenPrice) {
            const amountYouReceive = (
                (amountYouPay * selectedToken.yourPay.price) /
                tokenPrice.price
            ).toFixed(5);
            setAmountOutput({ ...amountOutput, amountYouReceive });
        }
    };

    useEffect(() => {
        getPrices();
    }, []);

    useEffect(() => {
        if (selectedToken.yourReceive.currency) calculateAmount(selectedToken);
    }, [selectedToken, amountOutput.amountYouPay]);

    return (
        <Container>
            <Heading>Swap anytime, anywhere.</Heading>
            <SwapSection
                tokenPriceInfo={tokenPriceInfo}
                title="You Pay"
                amountInput={amountOutput.amountYouPay}
                getAmountInput={(amountInput) =>
                    handleAmountInput(EInputType.PAY, amountInput)
                }
                selectedToken={selectedToken.yourPay}
                onGetSelectedToken={(token) =>
                    handleGetSelectedToken(EInputType.PAY, token)
                }
            />
            <SwapSection
                tokenPriceInfo={tokenPriceInfo}
                title="You Receive"
                amountInput={amountOutput.amountYouReceive}
                isDiabledInput
                selectedToken={selectedToken.yourReceive}
                onGetSelectedToken={(token) =>
                    handleGetSelectedToken(EInputType.RECEIVE, token)
                }
            />
        </Container>
    );
}

export default App;
