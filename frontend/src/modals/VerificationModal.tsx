import { ModalsEnum } from "../stores/ModalStore";
import Modal from "../components/Modal";
import React, { useEffect } from "react";
import snsWebSdk from '@sumsub/websdk';
import { useInjection } from "inversify-react";
import { Api } from "../utils/api";

const VerificationModal = ({ modalId }: { modalId: number }) => {
    const api = useInjection(Api);

    useEffect(() => {
        (async () => {
            const token = await api.getKycToken();

            const snsWebSdkInstance = snsWebSdk.Builder('https://test-api.sumsub.com', 'basic-kyc')
                .withAccessToken(
                    token,
                    async (callback) => callback(await api.getKycToken())
                )
                .withConf({
                    lang: 'en',
                    onMessage: (type, payload) => {
                        // see below what kind of messages the WebSDK generates
                        console.log('WebSDK onMessage', type, payload)
                    },
                    onError: (error) => {
                        console.error('WebSDK onError', error)
                    },
                })
                .build();
            snsWebSdkInstance.launch('#sumsub-container');
            console.log(snsWebSdkInstance);
        })();
    }, []);

    return (
        <Modal title='Verification' modalId={modalId}>
            <div className="modal__body">
                <div id='sumsub-container'>
                    <div className="loader-wrap">
                        <div className="loader-img">
                            <img src={require('../images/lof.svg')} alt=""/>
                        </div>
                        <svg className="loader">
                            <circle cx="30" cy="30" r="28"/>
                        </svg>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default VerificationModal;
