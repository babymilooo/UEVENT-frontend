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
import withAuth from '@/components/withAuth';
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

    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true);
            try {
              const response = await OrganizationService.getOrganizationsForVerification(currentPage + 1, itemsPerPage);
              const res = response.data;
              const organizationsData = Object.values(res.organizations);
              setOrganizations(organizationsData);
              setFilteredOrganizations(organizationsData);
              setPageCount(res.totalPages);
              setTotalItems(res.totalItems);
            } catch(error) {
              console.error('Failed to fetch organizations:', error);
            }
            setLoading(false);
        }
        fetchOrganizations();

    }, [currentPage]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };


    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col bg-muted overflow-x-hidden h-full min-h-[94vh] select-none mb-[50px] lg:mb-0">
            <div className='ipad:px-5 ipad:pt-20 pt-5 ipad:pb-5 items-center flex flex-col ipad:flex-row w-full'>
                <div className='ipad:pl-5 flex-col'>
                    <h1 className='iphone:text-6xl text-5xl font-bold pt-5 ipad:pt-0'>Organizations for Verification</h1>
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
                <Input
                  placeholder='Search organizations'
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

export default withAuth(observer(Render));