import React from 'react';
import Dropzone from "react-dropzone";

interface IProfileFormImageProps {
    title: string;
    image?: File | string;
    onChange: (val: File | string) => any;
}

export function ProfileFormImage({ title, image, onChange }: IProfileFormImageProps) {
    if (!image) {
        return (
            <Dropzone accept={['image/jpeg', 'image/png', 'image/gif']} onDrop={val => val[0] && (val[0].size <= 20 * 10**20) && onChange(val[0])}>
                {({ getRootProps, getInputProps }) => (
                    <div className="form-profile__upload" {...getRootProps()}>
                        <span className="modal__subtitle">{title}</span>
                        <label className="label-img label-img_small" htmlFor="input-img">
                            <p className="label-img__text">JPG, PNG or GIF. <br/> 20MB
                                max size.</p>
                            <p className="label-img__text">Drag and drop an image here, or click to
                                browse</p>
                        </label>
                        <input {...getInputProps()} />
                    </div>
                )}
            </Dropzone>
        )
    }
    return (
        <div className="form-profile__file">
            <span className="modal__subtitle">{title}</span>
            <div className="profile-file">
                <div className="profile-file__img">
                    <img src={image instanceof File ? URL.createObjectURL(image) : image} alt="photo user"/>
                </div>
                <div className="profile-file__description">
                    {image instanceof File && (
                        <>
                            <span>{image.name}</span>
                            <span>{image.size} B</span>
                        </>
                    )}
                    <button className="profile-file__btn" type="button" onClick={() => onChange(null)}>delete file</button>
                </div>
            </div>
        </div>
    )
}