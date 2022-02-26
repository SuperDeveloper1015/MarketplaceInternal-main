import Modal from "../components/Modal";
import React, { useState } from "react";
import classNames from "classnames";
import Dropzone from "react-dropzone";
import Button from "../components/Button";
import { useInjection } from "inversify-react";
import { Api } from "../utils/api";
import { ModalStore } from "../stores";
import { RouterStore } from "mobx-react-router";
import { toast } from "react-toastify";

interface IProps {
    modalId: number;
}

const UploadArtworkModal = ({ modalId }: IProps) => {
    const api = useInjection(Api);
    const modalStore = useInjection(ModalStore);
    const routerStore = useInjection(RouterStore);

    const [ step, setStep ] = useState(1);
    const [ artworkType, setArtworkType ] = useState<'image' | 'video'>('image');
    const [ originalFile, setOriginalFile ] = useState<File>();
    const [ censoredFile, setCensoredFile ] = useState<File>();
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ copies, setCopies ] = useState('1');
    const [ loading, setLoading ] = useState(false);

    const onFileSelected = (files: File[], callback: (val: File) => any) => {
        if (!files.length) {
            toast.error('File is not selected or not supported');
            return;
        }
        const file = files[0];
        if (file.size > (artworkType === 'image' ? 8 : 20) * 2**20) {
            toast.error(`File size exceeds ${'image' ? 8 : 20} MB`);
            return;
        }
        callback(file);
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const artwork = await api.createArtwork(title, description, parseInt(copies), originalFile, censoredFile);
            toast.success('Artwork was successfully created. Please await moderation.');
            routerStore.push(`/artworks/${artwork.id}`);
            modalStore.hideModal(modalId);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            modalId={modalId}
            onBack={step !== 1 && (() => {
                if (step === 2) {
                    setOriginalFile(undefined);
                } else if (step === 3) {
                    setCensoredFile(undefined);
                }
                setStep(step - 1);
            })}
            headerAddon={[
                <div className="modal__dots">
                    <span className="modal__dot active"/>
                    <span className={classNames('modal__dot', { active: step >= 2 })} />
                    <span className={classNames('modal__dot', { active: step >= 3 })} />
                </div>,
                <span className="modal__text">Step {step} from 3</span>
            ]}
            title='Creating artwork'
        >
            <form onSubmit={onSubmit}>
                {step === 1 && (
                    <div className="modal__body">
                        <span className="modal__subtitle">Upload the artwork you will be selling</span>
                        <div className="form-creat">
                            <div className="modal__select-inner">
                                <label className="modal__subtitle">Artwork type</label>
                                <select name="category" value={artworkType} onChange={e => { setArtworkType(e.target.value as any); setOriginalFile(undefined); setCensoredFile(undefined) }}>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>
                        </div>
                        {originalFile ? (
                            <>
                                <div className="label-img label-img-with-media">
                                    {artworkType === 'image' ? (
                                        <img src={URL.createObjectURL(originalFile)} />
                                    ) : (
                                        <video controls>
                                            <source src={URL.createObjectURL(originalFile)} />
                                        </video>
                                    )}
                                </div>
                                <label className='remove-media' onClick={() => setOriginalFile(undefined)}>&times; Remove</label>
                            </>
                        ) : (
                            <Dropzone accept={artworkType === 'image' ? ['image/jpeg', 'image/png'] : 'video/mp4'} onDrop={f => onFileSelected(f, setOriginalFile)}>
                                {({ getRootProps, getInputProps }) => (
                                    <div className="label-img" {...getRootProps()}>
                                        {artworkType === 'image' ? (
                                            <p className="label-img__text">Min. 1080x1080px.<br />JPG or PNG.<br />Max size 8 MB.</p>
                                        ) : (
                                            <p className="label-img__text">Min. 720p MP4.<br />Max size 20 MB.</p>
                                        )}
                                        <p className="label-img__text">Drag and drop {artworkType === 'image' ? 'an image' : 'a video'} here, or click to browse</p>
                                        <input {...getInputProps()} />
                                    </div>
                                )}
                            </Dropzone>
                        )}
                    </div>
                )}
                {step === 2 && (
                    <div className="modal__body">
                        <span className="modal__subtitle">Upload a censored version of artwork (if applicable)</span>
                        {censoredFile ? (
                            <>
                                <label className="label-img label-img-with-media">
                                    {artworkType === 'image' ? (
                                        <img src={URL.createObjectURL(censoredFile)} />
                                    ) : (
                                        <video controls>
                                            <source src={URL.createObjectURL(censoredFile)} />
                                        </video>
                                    )}
                                </label>
                                <label className='remove-media' onClick={() => setCensoredFile(undefined)}>&times; Remove</label>
                            </>
                        ) : (
                            <Dropzone accept={artworkType === 'image' ? ['image/jpeg', 'image/png'] : 'video/mp4'} onDrop={f => onFileSelected(f, setCensoredFile)}>
                                {({ getRootProps, getInputProps }) => (
                                    <label className="label-img" {...getRootProps()}>
                                        {artworkType === 'image' ? (
                                            <p className="label-img__text">Min. 1080x1080px.<br />JPG or PNG.<br />Max size 8 MB.</p>
                                        ) : (
                                            <p className="label-img__text">Min. 720p MP4.<br />Max size 20 MB.</p>
                                        )}
                                        <p className="label-img__text">Drag and drop {artworkType === 'image' ? 'an image' : 'a video'} here, or click to browse</p>
                                        <input {...getInputProps()} />
                                    </label>
                                )}
                            </Dropzone>
                        )}
                    </div>
                )}
                {step === 3 && (
                    <div className="modal__body">
                        <form className="form-creat" action="#">
                            <label className="modal__subtitle">Artwork name</label>
                            <input className="input-text" type="text" value={title} onChange={e => setTitle(e.target.value)} />
                            <label className="modal__subtitle">Description</label>
                            <textarea className="input-text" value={description} onChange={e => setDescription(e.target.value)}/>
                            {/*<div className="modal__select-inner">
                                <label className="modal__subtitle">Category</label>
                                <select name="category">
                                    <option value="Category name">Category name</option>
                                    <option value="Category name 1">Category name 1</option>
                                    <option value="Category name 2">Category name 2</option>
                                </select>
                            </div>*/}
                            <div className="modal-calc">
                                <div className="modal-calc__copy">
                                    <span className="modal__subtitle">Copies</span>
                                    <div className="modal-calc__num">
                                        <button className={classNames('modal-calc__btn', { disabled: copies === '1' })} type="button" onClick={() => setCopies((parseInt(copies) - 1).toString())}/>
                                        <input type="number" value={copies} onChange={e => setCopies(e.target.value)}/>
                                        <button className="modal-calc__btn" type="button" onClick={() => setCopies((parseInt(copies) + 1).toString())}/>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
                <div className="modal__footer">
                    {step === 1 && (
                        <Button className="btn primary" type='button' disabled={(!originalFile)} onClick={() => setStep(2)}>
                            Next step
                        </Button>
                    )}
                    {step === 2 && (
                        <Button className="btn primary" type='button' onClick={() => setStep(3)}>
                            Next step
                        </Button>
                    )}
                    {step === 3 && (
                        <Button className="btn primary" type='submit' loading={loading}
                                disabled={!title || !description || !parseInt(copies) || parseInt(copies) <= 0}>
                            Finish creating
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    )
}

export default UploadArtworkModal;
