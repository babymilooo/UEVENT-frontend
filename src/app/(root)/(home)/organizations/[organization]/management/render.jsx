"use client"

import React, { useState } from 'react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Image from 'next/image';

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

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import GoogleMap from '@/components/googlemap/GoogleMap';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/datePicker/DatePicker';
import { Calendar } from '@/components/ui/calendar';
import MyTimePicker from '@/components/timePicker/TimePicker';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import MapHandler from '@/components/googlemap/map-handler';
import { GearIcon } from '@radix-ui/react-icons';
import ImageLoader from '@/components/ImageLoader/ImageLoader';
import OrganizationService from '@/service/orgService';
import { useRouter } from 'next/navigation';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Render = ({ res }) => {
    const [organization, setOrganization] = useState(res);
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState("");
    const [search, setSearch] = useState('');
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

    const handleCreate = async () => {
        const data = { name, description, picture: selectedImage };
        // const response = await OrganizationService.createOrganization(data);
    }

    const handeEdit = async () => {
        const data = { name, description, location: selectedPlace, email: website, phone };
        const response = await OrganizationService.editOrganization(organization._id, data);
        let orgLogo;
        let picture;
        console.log(response);
        if (selectedImage && selectedImage != organization.logo) {
            orgLogo = await OrganizationService.addLogoToOrg(response.data._id, logo);
        }
        if (backgroundImage && backgroundImage != organization.picture) {
            picture = await OrganizationService.addBgToOrg(response.data._id, bg);
        }

        const org = { ...response.data, logo: orgLogo?.data, picture: picture?.data };
        setOrganization(org);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImage(reader.result);
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

    const isVerified = organization.IsVerified;

    return (
        <div className='grid grid-cols-4 bg-muted h-full'>
            <div className=" lg:col-span-3 col-span-4 rounded-md mt-2 flex flex-col">
                <div className='ipad:px-5 ipad:pt-20 pt-5 ipad:pb-5 items-center flex flex-col ipad:flex-row w-full'>
                    <Image src={organization.logo ? organization?.logo : "/BigLogo.png"} alt='logo' height={200} width={200} className='rounded-lg h-[200px]' style={{
                        objectFit: 'cover',
                        objectPosition: 'center'
                    }} />
                    <div className='ipad:pl-5 flex-col'>
                        {isVerified && (
                            <div className="hidden ipad:flex items-center none">
                                <Image src="/verified.svg" alt="verified" width={20} height={20} />
                                <div className="text-primary">Verified</div>
                            </div>
                        )}

                        <h1 className='iphone:text-6xl text-5xl font-bold pt-5 ipad:pt-0'>{organization.name}</h1>

                        <div className='flex items-center ipad:justify-normal justify-between ipad:mt-16 mb-5 ipad:mb-0 gap-1 '>
                            <div className='flex items-center gap-1'>
                                <p className='text-xl font-bold'>{organization.followerCount}</p>
                                <p className='font-bold text-xs pt-1'>Followers</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='lg:hidden fixed right-0'>
                    <Sheet>
                        <SheetTrigger>Open</SheetTrigger>
                        <SheetContent>
                            <div className="flex flex-col fixed h-full">
                                <div className="bg-background h-full rounded-md">
                                    <ScrollArea className="h-full w-full rounded-md">
                                        <div className="relative flex h-[360px] w-full items-end bg-cover bg-center select-none rounded-t-md"
                                            style={{
                                                backgroundImage: `url('/gradient.jpeg')`,
                                            }}>
                                            <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                                        </div>
                                        <div className="relative w-full mt-[-35px] bg-background z-30 rounded-[40px]">
                                            <div className="flex items-center gap-2 p-4 pb-0">
                                                <Avatar>
                                                    <AvatarImage src="/BigLogo.png" alt="@avatar" className="w-[50px]" />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <div></div>
                                                <div className="font-bold">
                                                    Organization
                                                </div>

                                                {isVerified && (
                                                    <div className="hidden ipad:flex items-center none">
                                                        <Image src="/verified.svg" alt="verified" width={20} height={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-4 p-1">
                                                <div className="font-bold">Hard Rock Stadium, Miami Gardens, US</div>
                                                <p className="font-bold mt-4 text-sm">
                                                    About us
                                                </p>
                                                <p className=' text-muted-foreground text-sm'>     Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam, at dignissimos deleniti commodi adipisci beatae aperiam saepe harum. Incidunt doloribus quibusdam aspernatur reiciendis quod vel numquam! Officiis sunt aliquid rem.
                                                </p>
                                                <p className="font-bold mt-4 mb-2 text-sm">
                                                    Events
                                                </p>
                                                {Array.from({ length: 3 }).map((_, index) => (

                                                    <Card
                                                        className="relative flex w-full items-end bg-cover bg-center select-none overflow-hidden h-[80px] mb-1"
                                                        style={{
                                                            backgroundImage: `url('/rolingLoud.webp')`,
                                                        }}>
                                                        <div className="absolute inset-0 bg-black opacity-50"></div>
                                                        <CardContent className="flex items-center h-full w-full">
                                                            <div className="bg-neutral-800 w-[75px] rounded-md h-full flex ">
                                                                <div className="flex flex-col items-center justify-center w-full h-full z-10">
                                                                    <p className="font-bold text-white">May</p>
                                                                    <p className="text-4xl font-bold text-white">18</p>

                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <p className="text-sm font-bold ml-2 text-white z-10">Location</p>
                                                                <p className="text-sm font-bold ml-2 text-white z-10">Name</p>
                                                                <p className="text-sm font-bold ml-2 text-white z-10">Mon. 17:00</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className='bg-background rounded-t-md h-full ipad:p-5'>
                    <div className='flex justify-center items-center w-full gap-2 border-b pb-5'>
                        <Dialog>
                            <DialogTrigger className=" bg-lime-400 px-6 py-1 rounded-3xl font-bold text-xs">
                                Create new
                            </DialogTrigger>
                            <DialogContent className="max-w-[1000px] ">
                                <DialogHeader>
                                    <DialogTitle>New event</DialogTitle>
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
                                                    <Input onChange={(e) => handleNameChange(e)} placeholder="organization name" />
                                                </div>
                                                <Textarea placeholder="Description" className="mt-4" onChange={(e) => handleDescriptionChange(e)} />

                                                <div className='flex items-center gap-4 mt-4 border-t pt-4'>
                                                    <Label>Choose start date</Label>
                                                    <DatePicker date={endDate} setDate={setEndDate} />
                                                    <MyTimePicker time={startTime} setTime={setStartTime} />
                                                </div>

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


                        <Dialog>
                            <DialogTrigger>
                                <GearIcon width={30} height={30} />
                            </DialogTrigger>
                            <DialogContent className="max-w-[1000px] ">
                                <DialogHeader>
                                    <DialogTitle>Edit organization</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className='col-span-1'>
                                        <div className='flex flex-col gap-4 items-center'>

                                            <div className="relative flex h-[200px] w-full items-end bg-cover bg-center select-none overflow-hidden"
                                                style={{
                                                    backgroundImage: `url('${organization?.picture ? organization?.picture : "/gradient.jpeg"}')`
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
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                                    <DialogDescription>
                                                        This action cannot be undone. This will permanently delete your organization
                                                        and remove your data from our servers.
                                                    </DialogDescription>
                                                    <DialogClose className='flex justify-end'>
                                                        <Button variant="destructive" className="w-24" onClick={handleDelete}>delete</Button>
                                                    </DialogClose>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                        <DialogClose className='col-span-1'>
                                            <div className='col-span-1 flex gap-4'>
                                                <Button onClick={handeEdit} className="w-full">Edit</Button>
                                            </div>
                                        </DialogClose>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1 z-10 h-full hidden lg:block ">
                <div className="flex flex-col fixed h-full m-2">
                    <div className="bg-background h-full rounded-md">
                        <ScrollArea className="h-full w-full rounded-md border lg:pb-12">
                            <div className="relative flex h-[360px] w-full items-end bg-cover bg-center select-none rounded-t-md"
                                style={{
                                    backgroundImage: `url('${organization.picture ? organization.picture : "/gradient.jpeg"}')`
                                }}>
                                <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                            </div>
                            <div className="relative w-full p-6 mt-[-35px] bg-background z-30 rounded-[40px]">
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage src={organization.logo ? organization?.logo : "/BigLogo.png"} alt="@avatar" className="w-[50px]" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="font-bold">
                                        {organization.name}
                                    </div>

                                    {isVerified && (
                                        <div className="hidden ipad:flex items-center none">
                                            <Image src="/verified.svg" alt="verified" width={20} height={20} />
                                            <div className="text-primary">Verified</div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <div className="font-bold text-lg">Hard Rock Stadium, Miami Gardens, US</div>
                                    <p className="font-bold mt-4 text-sm">
                                        About us
                                    </p>
                                    <p className=' text-muted-foreground text-sm'>
                                        {organization.description}
                                    </p>
                                    <div>
                                        <APIProvider apiKey={API_KEY}>
                                            <Map
                                                className='w-full h-[450px]'
                                                defaultCenter={{ lat: 22.54992, lng: 0 }}
                                                defaultZoom={1}
                                                gestureHandling={'greedy'}
                                                disableDefaultUI={true}

                                            >

                                                {selectedPlace && (
                                                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: 10 }}>
                                                        <p>{selectedPlace.address}</p>
                                                    </div>
                                                )}
                                            </Map>

                                            <MapHandler place={selectedPlace} />
                                        </APIProvider>
                                    </div>
                                    <p className="font-bold mt-4 mb-2 text-sm">
                                        Events
                                    </p>
                                    {Array.from({ length: 3 }).map((_, index) => (

                                        <Card
                                            className="relative flex w-full items-end bg-cover bg-center select-none overflow-hidden h-[80px] mb-1"
                                            style={{
                                                backgroundImage: `url('/rolingLoud.webp')`,
                                            }}>
                                            <div className="absolute inset-0 bg-black opacity-50"></div>
                                            <CardContent className="flex items-center h-full w-full">
                                                <div className="bg-neutral-800 w-[75px] rounded-md h-full flex ">
                                                    <div className="flex flex-col items-center justify-center w-full h-full z-10">
                                                        <p className="font-bold text-white">May</p>
                                                        <p className="text-4xl font-bold text-white">18</p>

                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-bold ml-2 text-white z-10">Location</p>
                                                    <p className="text-sm font-bold ml-2 text-white z-10">Name</p>
                                                    <p className="text-sm font-bold ml-2 text-white z-10">Mon. 17:00</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Render;
