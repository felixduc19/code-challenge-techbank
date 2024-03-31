import { useMemo, useState } from "react";

import { TokenPriceInfo } from "../../types";
import SelectTokensModal from "../SelectTokensModal/SelectTokensModal";
import TokenImage from "../TokenImage/TokenImage";
import ChevronDownWhiteIcon from "../../assets/img/icons/chevron-down-white.svg";
import {
    InputContent,
    PriceInUSD,
    SelectTokenButton,
    SelectTokenButtonContent,
    SelectTokenButtonIcon,
    SelectTokenButtonImage,
    SelectTokenButtonTitle,
    SwapSectionContainer,
    TextInput,
    Title,
} from "./SwapSection.styled";

interface SwapSectionProps {
    title: string;
    amountInput: string;
    isDisabledInput?: boolean;
    selectedToken: TokenPriceInfo;
    tokenPriceInfo: TokenPriceInfo[];
    getAmountInput?: (amount: string) => void;
    onGetSelectedToken: (token: TokenPriceInfo) => void;
}

const SwapSection = ({
    title,
    tokenPriceInfo,
    amountInput,
    getAmountInput,
    selectedToken,
    onGetSelectedToken,
    isDisabledInput = false,
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
                        disabled={isDisabledInput}
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
