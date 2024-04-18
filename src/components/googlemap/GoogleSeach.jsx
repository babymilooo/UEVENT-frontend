
"use client"

import { useEffect, useState } from 'react';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '../ui/input';


const GoogleSeach = ({ search, setSearch }) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const requestData = {
        textQuery: { search }
    };

    // const headers = {
    //     'Content-Type': 'application/json',
    //     'X-Goog-Api-Key': API_KEY,
    //     'X-Goog-FieldMask': 'places.displayName,places.formattedAddress'
    // };

    // const handleSearch = async () => {
    //     try {
    //         const response = await ArtistService.searchArtists(search);
    //         setArtists(response.data.map((artist) => {
    //             return {
    //                 artist: artist.name,
    //                 id: artist.id,
    //                 image: artist.images[1]?.url,
    //             };
    //         }));
    //         // console.log("Результат поиска артистов:", artists);
    //     } catch (error) {
    //         console.error("Ошибка при поиске артистов:", error);
    //         // Обработка ошибок при запросе
    //     }
    // };

    return (
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
        // <Popover open={open} onOpenChange={setOpen}>
        //     <PopoverTrigger asChild>
        //     </PopoverTrigger>
        //     <PopoverContent>
        //         123123
        //     </PopoverContent>
        // </Popover>

    );
};

export default GoogleSeach;