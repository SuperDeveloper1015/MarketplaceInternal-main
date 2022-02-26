import React from 'react';
import Modal from "../components/Modal";
import { FaFacebookSquare, FaTwitter, FaTelegramPlane, FaCopy } from 'react-icons/fa';
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";

interface IShareModalProps {
    data: string;
    modalId: number;
}

interface IShareModalState {
}

class ShareModal extends React.Component<IShareModalProps, IShareModalState> {
    render() {
        const { data: link, modalId } = this.props;

        return (
            <Modal title='Share artwork' modalId={modalId}>
                <div className="modal__body">
                    <div className="input-text">
                        <input readOnly value={link} />
                        <button type='button' onClick={() => { copy(link); toast.success('Link was copied to clipboard') }}><FaCopy /></button>
                        <a href={`https://twitter.com/share?url=${link}`} target='_blank'><FaTwitter /></a>
                        <a href={`https://www.facebook.com/sharer.php?u=${link}`} target='_blank'><FaFacebookSquare /></a>
                        <a href={`https://telegram.me/share/url?url=${link}`} target='_blank'><FaTelegramPlane /></a>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default ShareModal;
