import { memo } from "react";
import { images } from "../assets/img";
import { styled } from "styled-components";

interface TokenImageProps {
    currency: string;
    width?: string;
    height?: string;
}

const TokenImageContainer = styled.img`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
`;
const TokenImage = ({
    currency,
    width = "44px",
    height = "44px",
}: TokenImageProps) => {
    return (
        <TokenImageContainer
            width={width}
            height={height}
            src={images[currency]}
            alt={currency}
        />
    );
};

export default memo(TokenImage);
