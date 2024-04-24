import Image from 'next/image';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ImageLoader = ({ selectedImage, setSelectedImage, handleLogoChange, className }) => {

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                handleLogoChange(e);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative overflow-hidden">

            <Avatar>
                <AvatarImage src={`${selectedImage || '/bigLogo.png'}`} alt='logo' className={className} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            < input
                id="image-upload"
                type="file"
                className="absolute inset-0 h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
                accept="image/*,video/*,.gif"
            />
        </div>
    );
};

export default ImageLoader;