import { TokenPriceInfo } from "../../types";
import TokenImage from "../TokenImage/TokenImage";
import CloseIcon from "../../assets/img/icons/close.svg";
import {
    CloseModalIcon,
    Currency,
    SelectTokensModalContainer,
    SelectTokensModalContent,
    SelectTokensModalHeader,
    SelectTokensModalInner,
    Title,
    TokenImageItem,
} from "./SelectTokenModal.styled";

interface SelectTokensModalProps {
    tokenPriceInfo: TokenPriceInfo[];
    onToggleModal: () => void;
    onSelectToken: (token: TokenPriceInfo) => void;
}

const SelectTokensModal = ({
    tokenPriceInfo,
    onToggleModal,
    onSelectToken,
}: SelectTokensModalProps) => {
    return (
        <SelectTokensModalContainer>
            <SelectTokensModalInner>
                <SelectTokensModalHeader>
                    <Title>Select Token</Title>
                    <CloseModalIcon
                        src={CloseIcon}
                        alt="close"
                        onClick={onToggleModal}
                    />
                </SelectTokensModalHeader>

                <SelectTokensModalContent>
                    {tokenPriceInfo?.map(
                        (token: TokenPriceInfo, index: number) => (
                            <TokenImageItem
                                key={`token.currency${index}`}
                                onClick={() => onSelectToken(token)}
                            >
                                <Currency>{token.currency}</Currency>
                                <TokenImage currency={token.currency} />
                            </TokenImageItem>
                        )
                    )}
                </SelectTokensModalContent>
            </SelectTokensModalInner>
        </SelectTokensModalContainer>
    );
};

export default SelectTokensModal;
