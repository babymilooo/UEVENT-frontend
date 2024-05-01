import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

import {
    Dialog,
    DialogOverlay,
    DialogDescription,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { GearIcon } from '@radix-ui/react-icons';
import ImageLoader from '@/components/ImageLoader/ImageLoader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import OrganizationService from '@/service/orgService';
import GoogleMap from '@/components/googlemap/GoogleMap';
import { Button } from '@/components/ui/button';

const Edit = ({ organization, setOrganization }) => {

    const [selectedImage, setSelectedImage] = useState(organization.logo);
    const [name, Setname] = useState(organization.name);
    const [description, SetDescription] = useState(organization.description);
    const [backgroundImage, setBackgroundImage] = useState(organization.picture);
    const [selectedPlace, setSelectedPlace] = useState(organization.location);
    const [phone, setPhone] = useState(organization.phone);
    const [website, setWebsite] = useState(organization.email);
    const router = useRouter();
    const [logo, setLogo] = useState(null);
    const [bg, setBg] = useState(null);

    const handleNameChange = (e) => {
        Setname(e.target.value);
    }

    const handleDescriptionChange = (e) => {
        SetDescription(e.target.value);
    }

    const handleLogoChange = (e) => {
        setLogo(e.target.files[0]);
    };

    const handleBgChange = (e) => {
        setBg(e.target.files[0]);
    };

    const handleClose = async () => {
        setSelectedImage(organization.logo);
        setBackgroundImage(organization.picture);
        Setname(organization.name);
        SetDescription(organization.description);
        setSelectedPlace(organization.location);
        setPhone(organization.phone);
        setWebsite(organization.email);
        setLogo(null);
        setBg(null);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImage(reader.result);
                // setBg(reader.result);
                handleBgChange(e);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async () => {
        const response = await OrganizationService.deleteOrganization(organization._id);
        if (response) {
            router.push("/organizations")
        }
    }

    const handeEdit = async () => {
        const location = { latitude: selectedPlace.latLng.lat, longitude: selectedPlace.latLng.lng, address: selectedPlace.address, countryCode: selectedPlace.countryCode };
        const data = { name, description, location: location, email: website, phone };
        const response = await OrganizationService.editOrganization(organization._id, data);
        let orgLogo;
        let picture;

        if (selectedImage && selectedImage != organization.logo) {
            orgLogo = await OrganizationService.addLogoToOrg(response.data._id, logo);
        }
        if (backgroundImage && backgroundImage != organization.picture) {
            picture = await OrganizationService.addBgToOrg(response.data._id, bg);
        }

        if (response.data) {
            const updatedData = { ...response.data };

            if (orgLogo) {
                updatedData.logo = orgLogo.data.logo;
            }

            if (picture) {
                updatedData.picture = picture.data.picture;
            }

            setOrganization(updatedData);
        } else {
            setOrganization(null); // Пример установки состояния по умолчанию
        }
    }


    return (
        <Dialog>
            <DialogTrigger>
                <GearIcon width={30} height={30} />
            </DialogTrigger>
            <DialogOverlay onClick={handleClose} />
            <DialogContent className="max-w-[1000px] ">
                <DialogHeader>
                    <DialogTitle>Edit organization</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <div className='col-span-1'>
                        <div className='flex flex-col gap-4 items-center'>

                            <div className="relative flex h-[200px] w-full items-end bg-cover bg-center select-none overflow-hidden"
                                style={{
                                    backgroundImage: `url('${backgroundImage ? backgroundImage : "/gradient.jpeg"}')`
                                }}>
                                <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                                <label htmlFor="background-image-upload" className="absolute inset-0 cursor-pointer">
                                    <input
                                        id="background-image-upload"
                                        type="file"
                                        className="absolute inset-0 h-full opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                            <div className="relative w-full p-6 mt-[-50px] bg-background z-30 rounded-[40px]">
                                <div className='flex items-center gap-4'>
                                    <ImageLoader selectedImage={selectedImage} setSelectedImage={setSelectedImage} handleLogoChange={handleLogoChange} className="w-[100px]" />
                                    <Input onChange={(e) => handleNameChange(e)} placeholder="organization name" defaultValue={organization.name} />
                                </div>
                                <Textarea placeholder="Description" className="mt-4 h-[150px]" onChange={(e) => handleDescriptionChange(e)} defaultValue={organization.description} />
                                <div className='flex items-center mt-4 gap-4'>
                                    <Input onChange={(e) => setPhone(e.target.value)} placeholder="phone number" defaultValue={organization.phone} />
                                    <Input onChange={(e) => setWebsite(e.target.value)} placeholder="email" defaultValue={organization.email} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1'>
                        <GoogleMap selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} />
                    </div>
                    <div className='grid grid-cols-6 justify-end col-span-2 gap-4'>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <Dialog className="col-span-1">
                            <DialogTrigger><Button variant="destructive" className="w-full">delete</Button></DialogTrigger>
                            <DialogOverlay />
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete your organization
                                        and remove your data from our servers.
                                    </DialogDescription>
                                    <DialogClose className='flex justify-end' onClick={handleClose}>
                                        <Button variant="destructive" className="w-24" onClick={handleDelete}>delete</Button>
                                    </DialogClose>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <DialogClose className='col-span-1' onClick={handleClose}>
                            <div className='col-span-1 flex gap-4'>
                                <Button onClick={handeEdit} className="w-full">Edit</Button>
                            </div>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Edit;