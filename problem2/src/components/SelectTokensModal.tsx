import { styled } from "styled-components";
import TokenImage from "./TokenImage";
import CloseIcon from "../assets/img/icons/close.svg";
import { TokenPriceInfo } from "../types";

const SelectTokensModalContainer = styled.div`
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const SelectTokensModalInner = styled.div`
    width: 400px;
    padding: 32px 0;
    background-color: white;
    border-radius: 16px;
`;

const SelectTokensModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 24px;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: rgb(34, 34, 34);
    width: 100%;
`;

const CloseModalIcon = styled.img`
    cursor: pointer;
    padding: 16px 24px 16px;
`;

const SelectTokensModalContent = styled.div`
    height: 600px;
    overflow-y: auto;
    padding: 0 16px;
`;

const TokenImageItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    margin-bottom: 16px;
    padding: 8px;
    border-radius: 8px;
    transition: 0.3s;
    &:hover {
        background-color: #d2d9ee60;
    }
`;

const Currency = styled.div`
    font-size: 16px;
    font-weight: 700;
    color: rgb(34, 34, 34);
    width: 100%;
    width: 100%;
    height: 100%;
`;

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
