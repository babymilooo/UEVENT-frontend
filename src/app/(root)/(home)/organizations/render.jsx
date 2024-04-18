"use client"

import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React, { use, useContext, useEffect, useState } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { RootStoreContext } from '@/providers/rootStoreProvider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageLoader from '@/components/ImageLoader/ImageLoader';
import { Button } from '@/components/ui/button';
import OrganizationService from '@/service/orgService';
import GoogleMap from '@/components/googlemap/GoogleMap';

const Render = () => {
    const [search, setSearch] = useState('');
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;
    const [selectedImage, setSelectedImage] = useState(null);
    const [name, Setname] = useState('');
    const [description, SetDescription] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('/rolingLoud.webp');
    const [selectedPlace, setSelectedPlace] =
        useState(null);

    useEffect(() => {
        console.log(selectedPlace);
    }, [selectedPlace]);

    const handleNameChange = (e) => {
        Setname(e.target.value);
    }

    const handleDescriptionChange = (e) => {
        SetDescription(e.target.value);
    }

    const handleCreate = async () => {
        const data = { name, description, picture: selectedImage };
        const response = await OrganizationService.createOrganization(data);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col bg-muted overflow-x-hidden h-full min-h-[94vh] select-none mb-[50px] lg:mb-0">
            <div className='ipad:px-5 ipad:pt-20 pt-5 ipad:pb-5 items-center flex flex-col ipad:flex-row w-full'>
                <Image src="/bigLogo.png" alt='logo' height={200} width={200} className='rounded-lg bg-lime-400 p-4' />
                <div className='ipad:pl-5 flex-col'>
                    <h1 className='iphone:text-6xl text-5xl font-bold pt-5 ipad:pt-0'>My organizations</h1>
                    <div className='flex items-center gap-1'>
                        <p className='text-xl font-bold'>0</p>
                        <p className='font-bold text-xs pt-1'>organizations</p>
                    </div>

                </div>
            </div>
            <div className='bg-background ipad:mr-2 rounded-t-md min-h-[63vh] ipad:p-5'>
                <div className='flex justify-center w-full gap-2 border-b pb-5'>
                    <Dialog>
                        <DialogTrigger className=" bg-lime-400 px-6 rounded-3xl font-bold text-xs">
                            Create new
                        </DialogTrigger>
                        <DialogContent className="max-w-[1000px] ">
                            <DialogHeader>
                                <DialogTitle>Create new organization</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                                <div className='col-span-1'>
                                    <div className='flex flex-col gap-4 items-center'>

                                        <div className="relative flex h-[200px] w-full items-end bg-cover bg-center select-none overflow-hidden"
                                            style={{
                                                backgroundImage: `url('${backgroundImage}')`,
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
                                                <ImageLoader selectedImage={selectedImage} setSelectedImage={setSelectedImage} className="w-[100px]" />
                                                <Input onChange={(e) => handleNameChange(e)} placeholder="organization name" />
                                            </div>
                                            <Textarea placeholder="Description" className="mt-4 h-[200px]" onChange={(e) => handleDescriptionChange(e)} />

                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-1'>
                                    <GoogleMap selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} />
                                </div>
                                <DialogClose className='col-span-2 justify-end grid grid-cols-3'>
                                    <div></div>
                                    <div></div>
                                    <Button onClick={handleCreate} className="col-span-1">New</Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Input
                        placeholder='Search organization'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Card className="relative flex w-full items-start select-none overflow-hidden h-[300px] mt-5" >
                    <div className='flex pt-12 pl-12 w-full'>
                        <Image src="/bigLogo.png" alt='logo' height={200} width={200} className='rounded-lg bg-lime-400 p-4' />
                        <div className='ipad:pl-5 flex-col justify-between flex h-[200px]'>
                            <div className='pt-10'>
                                <h1 className='iphone:text-6xl text-5xl font-bold pt-5 ipad:pt-0'>My organization</h1>
                                <div className='w-3/4 text-muted-foreground '>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet quidem ullam, quaerat minima odio ratione cupiditate itaque dolor, et officiis doloremque! Sequi non voluptatem magnam nemo suscipit odit enim laboriosam!
                                </div>
                            </div>
                            <div className='flex items-center gap-1'>
                                <p className='text-xl font-bold'>24</p>
                                <p className='font-bold text-xs pt-1'>followers</p>
                            </div>

                        </div>
                    </div>
                </Card>
            </div>

        </div >
    );
};

export default Render;