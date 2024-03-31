import { useMemo, useState } from "react";
import styled from "styled-components";

import ChevronDownWhiteIcon from "../assets/img/icons/chevron-down-white.svg";
import { TokenPriceInfo } from "../types";
import SelectTokensModal from "./SelectTokensModal";
import TokenImage from "./TokenImage";

interface SwapSectionProps {
    title: string;
    tokenPriceInfo: TokenPriceInfo[];
    amountInput: string;
    getAmountInput?: (amount: string) => void;
    isDiabledInput?: boolean;
    selectedToken: TokenPriceInfo;
    onGetSelectedToken: (token: TokenPriceInfo) => void;
}

const SwapSectionContainer = styled.div`
    border: 1px solid rgb(249, 249, 249);
    border-radius: 24px;
    padding: 16px;
    margin-bottom: 24px;
    background-color: rgb(249, 249, 249);
`;

const Title = styled.h3`
    font-size: 16px;
    font-weight: 700;
    color: rgb(34, 34, 34);
    margin-bottom: 16px;
    width: 100%;
`;

const InputContent = styled.div`
    width: 500px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TextInput = styled.input`
    padding: 8px 0;
    border: none;
    outline: none;
    color: rgb(34, 34, 34);
    background-color: rgb(249, 249, 249);
    &::placeholder {
        color: rgb(125, 125, 125);
    }
    font-size: 32px;
    font-weight: 700;
    margin-right: 32px;
    width: 60%;
`;

const PriceInUSD = styled.p`
    color: rgb(125, 125, 125);
    font-size: 14px;
    margin-top: 16px;
    width: 100%;
    font-weight: 600;
`;

const SelectTokenButton = styled.div`
    background-color: #fb118e;
    padding: 12px 16px;
    color: white;
    display: flex;
    border-radius: 32px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
        opacity: 0.6;
    }
`;

const SelectTokenButtonContent = styled.div`
    display: flex;
    align-items: center;
`;

const SelectTokenButtonTitle = styled.p`
    color: white;
    font-size: 14px;
    font-weight: 700;
    margin-right: 8px;
`;

const SelectTokenButtonImage = styled.div`
    margin-right: 8px;
`;

const SelectTokenButtonIcon = styled.img`
    width: 16px;
    height: 16px;
`;

const SwapSection = ({
    title,
    tokenPriceInfo,
    amountInput,
    getAmountInput,
    selectedToken,
    onGetSelectedToken,
    isDiabledInput = false,
}: SwapSectionProps) => {
    const [isToggleModal, setIsToggleModal] = useState(false);

    const handleToggleModal = () => {
        setIsToggleModal(!isToggleModal);
    };

    const handleSelectToken = (token: TokenPriceInfo) => {
        onGetSelectedToken(token);
        setIsToggleModal(false);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        getAmountInput && getAmountInput(e.target.value);
    };

    const USDPriceConverted = useMemo(() => {
        if (!selectedToken || !amountInput) return null;
        return selectedToken.price * parseFloat(amountInput);
    }, [amountInput, selectedToken]);

    return (
        <>
            <SwapSectionContainer>
                <Title>{title}</Title>
                <InputContent>
                    <TextInput
                        type="number"
                        inputMode="decimal"
                        placeholder="0"
                        onChange={handleAmountChange}
                        value={amountInput}
                        disabled={isDiabledInput}
                        pattern="^[0-9]*[.,]?[0-9]*$"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                    />
                    <SelectTokenButton onClick={handleToggleModal}>
                        <SelectTokenButtonContent>
                            {selectedToken?.currency && (
                                <SelectTokenButtonImage>
                                    <TokenImage
                                        currency={selectedToken?.currency}
                                        width="20px"
                                        height="20px"
                                    />
                                </SelectTokenButtonImage>
                            )}

                            <SelectTokenButtonTitle>
                                {selectedToken?.currency || "Select Token"}
                            </SelectTokenButtonTitle>
                        </SelectTokenButtonContent>

                        <SelectTokenButtonIcon src={ChevronDownWhiteIcon} />
                    </SelectTokenButton>
                </InputContent>
                <PriceInUSD>${USDPriceConverted || " - "}</PriceInUSD>
            </SwapSectionContainer>
            {isToggleModal && (
                <SelectTokensModal
                    tokenPriceInfo={tokenPriceInfo}
                    onToggleModal={handleToggleModal}
                    onSelectToken={handleSelectToken}
                />
            )}
        </>
    );
};

export default SwapSection;
