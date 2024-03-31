import axios from "axios";
import { useEffect, useState } from "react";

import { TokenPriceInfo } from "../../types";
import { EInputType } from "../../enums";
import { SwapPageContainer, Heading } from "./SwapPage.styled";
import SwapSection from "../../components/SwapSection/SwapSection";
import {
    DEFAULT_CURRENCY_YOU_PAY,
    MOCK_TOKEN_PRICE_INFO_API,
} from "../../constants";

interface SelectedToken {
    youPay: TokenPriceInfo;
    youReceive: TokenPriceInfo;
}

interface AmountOutput {
    amountYouPay: string;
    amountYouReceive: string;
}

const SwapPage = () => {
    const [tokenPriceInfo, setTokenPriceInfo] = useState<TokenPriceInfo[]>([]);

    const [selectedToken, setSelectedToken] = useState<{
        youPay: TokenPriceInfo;
        youReceive: TokenPriceInfo;
    }>({
        youPay: {} as TokenPriceInfo,
        youReceive: {} as TokenPriceInfo,
    });

    const [amountOutput, setAmountOutput] = useState<AmountOutput>({
        amountYouPay: "",
        amountYouReceive: "",
    });

    const getPrices = async () => {
        try {
            const response = await axios.get(MOCK_TOKEN_PRICE_INFO_API);
            if (response && response.data) {
                setTokenPriceInfo(response.data);

                const defaultSelectedTokenYouPay = response.data.find(
                    (token: TokenPriceInfo) =>
                        token.currency === DEFAULT_CURRENCY_YOU_PAY
                );

                setSelectedToken({
                    youPay: defaultSelectedTokenYouPay,
                    youReceive: {} as TokenPriceInfo,
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
                    youPay: token,
                });
                break;
            }

            case EInputType.RECEIVE: {
                setSelectedToken({
                    ...selectedToken,
                    youReceive: token,
                });
                break;
            }

            default: {
                return null;
            }
        }
    };

    const calculateAmountYouReceive = (selectedToken: SelectedToken) => {
        const amountYouPay = parseFloat(amountOutput.amountYouPay);
        const tokenPrice = tokenPriceInfo.find(
            (token) => token.currency === selectedToken.youReceive.currency
        );
        if (tokenPrice) {
            const amountYouReceive =
                (amountYouPay * selectedToken.youPay.price) / tokenPrice.price;
            setAmountOutput({
                ...amountOutput,
                amountYouReceive: amountYouReceive.toString(),
            });
        }
    };

    useEffect(() => {
        getPrices();
    }, []);

    useEffect(() => {
        if (selectedToken.youReceive.currency)
            calculateAmountYouReceive(selectedToken);
    }, [selectedToken, amountOutput.amountYouPay]);

    return (
        <SwapPageContainer>
            <Heading>Swap anytime, anywhere.</Heading>
            <SwapSection
                tokenPriceInfo={tokenPriceInfo}
                title="You Pay"
                amountInput={amountOutput.amountYouPay}
                getAmountInput={(amountInput: string) =>
                    handleAmountInput(EInputType.PAY, amountInput)
                }
                selectedToken={selectedToken.youPay}
                onGetSelectedToken={(selectedTokenYouPay: TokenPriceInfo) =>
                    handleGetSelectedToken(EInputType.PAY, selectedTokenYouPay)
                }
            />
            <SwapSection
                tokenPriceInfo={tokenPriceInfo}
                title="You Receive"
                amountInput={amountOutput.amountYouReceive}
                isDisabledInput
                selectedToken={selectedToken.youReceive}
                onGetSelectedToken={(selectedTokenYouReceive: TokenPriceInfo) =>
                    handleGetSelectedToken(
                        EInputType.RECEIVE,
                        selectedTokenYouReceive
                    )
                }
            />
        </SwapPageContainer>
    );
};

export default SwapPage;
