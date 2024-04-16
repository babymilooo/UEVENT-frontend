import Image from 'next/image';
import React from 'react';

const ImageLoader = ({ selectedImage, setSelectedImage }) => {

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative rounded-lg overflow-hidden">
            <Image src={`${selectedImage || '/bigLogo.png'}`} alt='logo' height={200} width={200} className='rounded-lg bg-lime-400' />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg">Change Image</span>
            </div>
            <input
                id="image-upload"
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
                accept="image/*,video/*,.gif"
            />
        </div>
    );
};

export default ImageLoader;