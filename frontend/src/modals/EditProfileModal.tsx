import React, { useState } from 'react';
import { ModalsEnum, ModalStore } from "../stores/ModalStore";
import Modal from "../components/Modal";
import Dropzone from 'react-dropzone';
import { ProfileType } from "../utils/graphql-urql";
import { generateSignature, processRequestError } from "../utils/utils";
import { useInjection } from "inversify-react";
import { Api } from "../utils/api";
import { toast } from "react-toastify";
import { OperationContext } from "@urql/core";
import { WalletStore } from "../stores";
import { ProfileFormImage } from "../components/ProfileFormImage";
import Button from "../components/Button";

interface IEditProfileModalProps {
    data: ProfileType & {
        email?: string;
        refetchProfile?: (opts?: Partial<OperationContext>) => void;
    };
    modalId: number;
}

const EditProfileModal = ({ data, modalId }: IEditProfileModalProps) => {
    const api = useInjection(Api);
    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);

    const [ name, setName ] = useState(data?.name || '');
    const [ username, setUsername ] = useState(data?.username || '');
    const [ email, setEmail ] = useState(data?.email || '');
    const [ bio, setBio ] = useState(data?.bio || '');
    const [ twitch, setTwitch ] = useState(data?.twitch || '');
    const [ instagram, setInstagram ] = useState(data?.instagram || '');
    const [ twitter, setTwitter ] = useState(data?.twitter || '');
    const [ onlyfans, setOnlyfans ] = useState(data?.onlyfans || '');
    const [ avatar, setAvatar ] = useState<File | string>(data?.avatar);
    const [ avatarDirty, setAvatarDirty ] = useState(false);
    const [ cover, setCover ] = useState<File | string>(data?.cover);
    const [ coverDirty, setCoverDirty ] = useState(false);

    const [ loading, setLoading ] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!/^[a-z0-9_-]*$/i.test(username)) {
            toast.error(<>Username could only contain following characters:<br/><code>a-z, A-Z, 0-9, -, _</code></>);
            return;
        }

        if (!/^[a-z0-9 _-]*$/i.test(name)) {
            toast.error(<>Name could only contain following characters:<br/><code>a-z, A-Z, 0-9, -, _, space</code></>);
            return;
        }

        setLoading(true);
        try {
            await api.updateProfile(name, username, email, bio, twitter, instagram, onlyfans, twitch,
                avatarDirty && !avatar, coverDirty && !cover,
                avatarDirty ? avatar as File : null, coverDirty ? cover as File : null);
            data.refetchProfile?.({ requestPolicy: 'network-only' });
            await walletStore.loadProfile();
            modalStore.hideModal(modalId);
            toast.success('Profile was changed');
        } catch (e) {
            console.log(e);
            processRequestError(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal title='Edit your Profile' modalId={modalId}>
            <form onSubmit={onSubmit}>
                <div className="modal__body">
                    <div className="form-profile">
                        <div className="form-profile__item">
                            <div className="form-profile__name">
                                <span className="modal__subtitle">Name</span>
                                <input className="input-text" type="text" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="form-profile__username">
                                <span className="modal__subtitle">Username</span>
                                <label htmlFor="#"> <span className="modal__subtitle">@</span>
                                    <input className="input-text" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                                </label>
                            </div>
                        </div>
                        <div className="form-profile__item">
                            <div className="form-profile__email">
                                <span className="modal__subtitle">Email</span>
                                <input className="input-text" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                            <p className="modal__text">Add your email address to receive notifications about
                                your activity on Foundation. This will not be shown on your profile.</p>
                        </div>
                        <label className="modal__subtitle">BIO</label>
                        <textarea className="input-text" name="BIO" value={bio} onChange={e => setBio(e.target.value)}/>
                        <div className="form-profile__item">
                            <ProfileFormImage title='Profile image' image={avatar} onChange={val => { setAvatar(val); setAvatarDirty(true) }} />
                            <ProfileFormImage title='Cover image' image={cover}  onChange={val => { setCover(val); setCoverDirty(true) }} />
                        </div>
                        <div className="modal__contacts">
                            <span className="modal__subtitle">Contacts</span>
                            <div className="social-item">
                                <div className="social-item__name">
                                    <img src={require('../images/twitch.svg')} alt="twitch"/>
                                    <span className="social-item__title">Twitch</span>
                                </div>
                                <div className="input-text">
                                    <span>https://twitch.tv/</span>
                                    <input type="text" value={twitch} pattern='^[a-zA-Z0-9_]+$' onChange={e => setTwitch(e.target.value)}/>
                                </div>
                            </div>
                            <div className="social-item">
                                <div className="social-item__name">
                                    <img src={require('../images/instagram.svg')} alt="Instagram"/>
                                    <span className="social-item__title">Instagram</span>
                                </div>
                                <div className="input-text">
                                    <span>https://instagram.com/</span>
                                    <input type="text" value={instagram} pattern='^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$' onChange={e => setInstagram(e.target.value)}/>
                                </div>
                            </div>
                            <div className="social-item">
                                <div className="social-item__name">
                                    <img src={require('../images/twitter.svg')} alt="Twitter"/>
                                    <span className="social-item__title">Twitter</span>
                                </div>
                                <div className="input-text">
                                    <span>https://twitter.com/</span>
                                    <input type="text" value={twitter} pattern='^[a-zA-Z0-9_]{1,15}$' onChange={e => setTwitter(e.target.value)}/>
                                </div>
                            </div>
                            <div className="social-item">
                                <div className="social-item__name">
                                    <img src={require('../images/onlyfans.svg')} alt="Onlyfans"/>
                                    <span className="social-item__title">Onlyfans</span>
                                </div>
                                <div className="input-text">
                                    <span>https://onlyfans.com/</span>
                                    <input type="text" value={onlyfans} pattern='^[a-zA-Z0-9_]+$' onChange={e => setOnlyfans(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal__footer">
                    <Button className="primary" loading={loading} type="submit">Save changes</Button>
                </div>
            </form>
        </Modal>
    );
}

export default EditProfileModal;
