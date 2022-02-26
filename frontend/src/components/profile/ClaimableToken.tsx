import React, { useState } from 'react';
import { observer } from "mobx-react";
import Button from "../Button";
import { TokenType } from "../../utils/graphql-gqlr";
import { useInjection } from "inversify-react";
import { WalletStore } from "../../stores";
import { Api } from "../../utils/api";
import { processRequestError } from "../../utils/utils";

const ClaimableToken = observer(({ token }: { token: Pick<TokenType, 'tokenId' | 'artwork'> }) => {
    const walletStore = useInjection(WalletStore);
    const api = useInjection(Api);

    const [ loading, setLoading ] = useState(false);

    const onClaim = async () => {
        setLoading(true);
        try {
            const [ tokenId, sig ] = await api.claimToken(token.tokenId);
            await walletStore.storage.methods.withdraw(tokenId, sig).send({ from: walletStore.address });
        } catch (e) {
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="activity__block" key={token.tokenId}>
            <div className="activity__description">
                <div className="activity__img">
                    <img src={token.artwork.previewImage} />
                </div>
                <div className="activity__text">
                    <span className="activity__id">{token.artwork.title}</span>
                    <span className="activity__data">Token #{token.tokenId}</span>
                </div>
            </div>
            <div className="activity__info">
                <Button className='primary' loading={loading} onClick={onClaim}>Claim</Button>
            </div>
        </div>
    )
});

export default ClaimableToken;
