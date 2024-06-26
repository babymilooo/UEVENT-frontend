"use client"

import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React, { use, useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

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
    DialogOverlay,
    DialogClose,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Skeleton } from "@/components/ui/skeleton"

import { RootStoreContext } from '@/providers/rootStoreProvider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageLoader from '@/components/ImageLoader/ImageLoader';
import { Button } from '@/components/ui/button';
import OrganizationService from '@/service/orgService';
import GoogleMap from '@/components/googlemap/GoogleMap';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import AuthService from '@/service/authService';

const Render = () => {
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;
    const [selectedImage, setSelectedImage] = useState(null);
    const [name, Setname] = useState('');
    const [description, SetDescription] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');

    const [logo, setLogo] = useState(null);
    const [bg, setBg] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;
    const [pageCount, setPageCount] = useState(0);
    const [auth, setAuth] = useState(true);
    const router = useRouter();

    const [searchInput, setSearchInput] = useState('');
    const [filteredOrganizations, setFilteredOrganizations] = useState(organizations);

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setSearchInput(inputValue);

        if (inputValue.trim() === '') {
            // Если поле ввода пустое, отобразить полный список организаций
            setFilteredOrganizations(organizations);
        } else {
            // Иначе выполнить фильтрацию по имени организации
            const filtered = organizations.filter((org) =>
                org.name.toLowerCase().includes(inputValue.trim().toLowerCase())
            );
            setFilteredOrganizations(filtered);
        }
    };

    const handleLogoChange = (e) => {
        setLogo(e.target.files[0]);
    };

    const handleBgChange = (e) => {
        setBg(e.target.files[0]);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const response = await AuthService.checkToken();
            if (response.data) {
                console.log('User is logged in');
                setAuth(false);
            } else {
                router.push('/auth/login');
            }
        }
        checkAuth();
    }, []);


    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true);
            try {
                const response = await OrganizationService.getOrganizations(currentPage + 1, itemsPerPage);
                const res = response.data;
                const organizationsData = Object.values(res.organizations);
                setOrganizations(organizationsData);
                setFilteredOrganizations(organizationsData);
                setPageCount(res.totalPages);
                setTotalItems(res.totalItems);
            } catch (error) {
                console.error('Failed to fetch organizations:', error);
            }
            setLoading(false);
        }
        fetchOrganizations();

    }, [currentPage]);

    const handleNameChange = (e) => {
        Setname(e.target.value);
    }

    const handleDescriptionChange = (e) => {
        SetDescription(e.target.value);
    }

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleCreate = async () => {
        const location = { latitude: selectedPlace.latLng.lat, longitude: selectedPlace.latLng.lng, address: selectedPlace.address, countryCode: selectedPlace.countryCode }
        const data = { name, description, location, email: website, phone };
        const response = await OrganizationService.createOrganization(data);
        if (backgroundImage, selectedImage) {
            const orgLogo = await OrganizationService.addLogoToOrg(response.data._id, logo);
            const picture = await OrganizationService.addBgToOrg(response.data._id, bg);
            const res = { ...response.data, logo: orgLogo.data.logo, picture: picture.data.picture }
            setOrganizations([...organizations, res]);
            setFilteredOrganizations([...organizations, res]);
        }
        else {
            setOrganizations([...organizations, response.data]);
            setFilteredOrganizations([...organizations, response.data]);
        }
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

    if (auth) {
        return null;
    }

    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col bg-muted overflow-x-hidden h-full min-h-[94vh] select-none mb-[50px] lg:mb-0">
            <div className='ipad:px-5 ipad:pt-40 pt-20 ipad:pb-5 items-center flex flex-col ipad:flex-row w-full'>
                <Image src={userStore.user?.profilePicture ? userStore.user?.profilePicture : "/BigLogo.png"} alt='logo' height={200} width={200} className='rounded-lg ' />
                <div className='ipad:pl-5 flex-col'>
                    <h1 className='iphone:text-6xl text-5xl font-bold pt-5 ipad:pt-0'>My organizations</h1>
                    {loading ?
                        <Skeleton className="h-4 w-[200px] rounded-md mt-3" /> :
                        <div className='flex items-center gap-1'>
                            <p className='text-xl font-bold'>{totalItems}</p>
                            <p className='font-bold text-xs pt-1'>organizations</p>
                        </div>
                    }

                </div>
            </div>
            <div className='bg-background ipad:mr-2 rounded-t-md min-h-[63vh] ipad:p-5'>
                <div className='flex justify-center w-full gap-2 border-b pb-5'>
                    <Dialog>
                        <DialogTrigger className=" bg-lime-400 px-6 rounded-3xl font-bold text-xs">
                            Create new
                        </DialogTrigger>
                        <DialogOverlay />
                        <DialogContent className="max-w-[1000px] ">
                            <DialogHeader>
                                <DialogTitle>Create new organization</DialogTitle>
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
                                                <Input onChange={(e) => handleNameChange(e)} placeholder="organization name" />
                                            </div>
                                            <Textarea placeholder="Description" className="mt-4 h-[150px]" onChange={(e) => handleDescriptionChange(e)} />
                                            <div className='flex items-center mt-4 gap-4'>
                                                <Input onChange={(e) => setPhone(e.target.value)} placeholder="phone number" />
                                                <Input onChange={(e) => setWebsite(e.target.value)} placeholder="email" />
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
                        placeholder='Search my organizations'
                        value={searchInput}
                        onChange={handleInputChange}
                    />
                </div>
                {
                    loading ?
                        // <Card className="relative flex w-full items-start select-none overflow-hidden h-[300px] mt-5 cursor-pointer " >
                        Array.from({ length: 1 }).map((_, index) => (
                            <div key={index} className='flex pt-12 pl-12 w-full gap-4'>
                                <Skeleton className="h-[200px] w-[200px] rounded-lg" />
                                <div className=' flex flex-col gap-8 py-6'>
                                    <Skeleton className="h-4 w-[300px] rounded-md" />
                                    <div className=' flex flex-col gap-2'>
                                        <Skeleton className="h-4 w-[600px] rounded-md" />
                                        <Skeleton className="h-4 w-[500px] rounded-md" />
                                        <Skeleton className="h-4 w-[550px] rounded-md" />
                                    </div>
                                    <Skeleton className="h-4 w-[200px] rounded-md" />
                                </div>
                            </div>
                        )) :
                        filteredOrganizations.map((organization, index) => (
                            <Card key={index} className="relative flex w-full items-start select-none overflow-hidden h-[300px] mt-5 cursor-pointer hover:bg-neutral-100" onClick={() => router.push(`/organizations/${organization._id}/management`)}>
                                <div className='flex pt-12 pl-12 w-full'>
                                    <Image src={organization.logo ? organization?.logo : "/BigLogo.png"} alt='logo' height={200} width={200} className='rounded-lg'
                                        style={{
                                            objectFit: 'cover',
                                            objectPosition: 'center'
                                        }} />
                                    <div className='ipad:pl-5 flex-col justify-between flex h-[200px]'>
                                        <div className='pt-10'>
                                            {organization.isVerified && (
                                                <div className="flex items-center gap-2 mr-4">
                                                    <Image src="/verified.svg" alt="verified" width={20} height={20} />
                                                    <div className="text-primary">Verified</div>
                                                </div>

                                            )}
                                            <h1 className='iphone:text-6xl text-5xl font-bold pt-5 ipad:pt-0'>{organization?.name}</h1>
                                            <div className='w-3/4 text-muted-foreground '>
                                                {organization?.description}
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <p className='text-xl font-bold'>{organization?.followers?.length}</p>
                                            <p className='font-bold text-xs pt-1'>followers</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                }

                {!loading && totalItems > itemsPerPage && (
                    <div className="mt-10">
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            onPageChange={handlePageClick}
                            containerClassName="flex list-none justify-center p-4"
                            activeClassName="bg-black text-white rounded-full"
                            pageClassName="mx-1"
                            pageLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                            previousClassName="mx-1"
                            nextClassName="mx-1"
                            previousLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                            nextLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                            breakClassName="mx-1"
                            breakLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                            forcePage={currentPage}
                            disabledClassName="opacity-30 cursor-not-allowed"
                        />
                    </div>
                )

                }

            </div>
        </div >
    );
};

export default observer(Render);