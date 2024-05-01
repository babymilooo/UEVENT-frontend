import { use, useEffect, useState } from 'react';

import {
    Dialog,
    DialogOverlay,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    Card,
    CardContent,
} from "@/components/ui/card"

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from '@/components/datePicker/DatePicker';
import MyTimePicker from '@/components/timePicker/TimePicker';
import { Label } from '@/components/ui/label';
import GoogleMap from '@/components/googlemap/GoogleMap';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import Image from 'next/image';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import ArtistService from '@/service/artistService';
import EventService from '@/service/eventService';
import axios from 'axios';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;


const CreateNew = ({ organization, setEvents, events, setCurrentPage }) => {
    const [backgroundImage, setBackgroundImage] = useState("/gradient.jpeg");
    const [bg, setBg] = useState(null);
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState("");
    const [selectedPlace, setSelectedPlace] = useState(organization.location);
    const [name, Setname] = useState("");
    const [description, SetDescription] = useState("");
    const [artists, setArtists] = useState([]);
    const [addedArtists, setAddedArtists] = useState([]);
    const [addedArtistsId, setAddedArtistsId] = useState([]);
    const [search, setSearch] = useState('');
    const [timer, setTimer] = useState(null);
    const [tickets, setTickets] = useState([{ name: '', price: '', quantity: '' }]);

    const handleBgChange = (e) => {
        setBg(e.target.files[0]);
    };

    const handleNameChange = (e) => {
        Setname(e.target.value);
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

    const handleDescriptionChange = (e) => {
        SetDescription(e.target.value);
    }

    const handleClose = async () => {
        setBackgroundImage("/gradient.jpeg");
        Setname("");
        SetDescription("");
        setSelectedPlace("");
        setBg(null);
        setArtists([]);
        setAddedArtists([]);
        setAddedArtistsId([]);
        setSearch('');
        setTickets([{ name: '', price: '', quantity: '' }]);
    }

    const handleSearch = async () => {
        try {
            const response = await ArtistService.searchArtists(search);
            const artistsToAdd = response.data.map((artist) => {
                return {
                    artist: artist.name,
                    id: artist.id,
                    image: artist.images[1]?.url,
                };
            });

            // Фильтруем только те артисты, которые еще не были добавлены
            const filteredArtists = artistsToAdd.filter((artist) => {
                // Проверяем наличие артиста в addedArtists по id
                return !addedArtists.some((addedArtist) => addedArtist.id === artist.id);
            });

            // Добавляем новых артистов к текущему списку artists
            setArtists((prevArtists) => [...prevArtists, ...filteredArtists]);
        } catch (error) {
            console.error("Ошибка при поиске артистов:", error);
            // Обработка ошибок при запросе
        }
    };

    useEffect(() => {
        if (timer) {
            clearTimeout(timer);
        }

        if (search.length === 0) {
            setArtists([]); // Очистить список артистов, если строка поиска пуста
        } else {
            setTimer(setTimeout(() => {
                if (search) {
                    handleSearch();
                }
            }, 500)); // Задержка в 500 мс
        }

        // Очистка таймера при размонтировании компонента
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [search]);

    const addArtist = (artist) => {
        const updatedArtists = artists.filter(a => a !== artist);
        setArtists(updatedArtists);

        setAddedArtists([...addedArtists, artist]);
        setAddedArtistsId([...addedArtistsId, artist.id]);
    };

    const deleteArtist = (artist) => {
        setAddedArtists(addedArtists.filter((item) => item.id !== artist.id));
        setAddedArtistsId(addedArtistsId.filter((id) => id !== artist.id));

        setArtists([...artists, artist]);
    };

    const handleCreate = async () => {

        const timeHours = Number(startTime.slice(0, 2));
        const timeMinutes = Number(startTime.slice(3, 5));
        endDate.setHours(timeHours);
        endDate.setMinutes(timeMinutes);
        const location = { latitude: selectedPlace.latLng.lat, longitude: selectedPlace.latLng.lng, countryCode: selectedPlace.countryCode, address: selectedPlace.address }
        const data = { organizationId: organization._id, name, description, date: endDate, time: startTime, location, artists: addedArtistsId };
        let res;
        const event = await EventService.createEvent(data);
        if (bg) {
            res = await EventService.updatePicture(event.data._id, bg);
        }
        if (tickets.length > 0) {
            // const res = await 
        }
        tickets.map(async (ticket) => {
            const ticketData = {
                event: event.data._id,
                name: ticket.name,
                price: parseFloat(ticket.price) * 100,
                quantity: parseInt(ticket.quantity)
            };
            // Await the result of EventService.createTicket
            return EventService.createTicket(ticketData);
        });

        setCurrentPage(0);
        handleClose();
    }

    // Функция для добавления нового билета
    const addTicket = () => {
        setTickets([...tickets, { name: '', price: '' }]);
    };

    // Функция для удаления последнего билета
    const deleteTicket = () => {
        setTickets(tickets.slice(0, tickets.length - 1));
    };

    // Функция для обновления значения имени или цены в билете
    const handleTicketChange = (index, fieldName, value) => {
        const newTickets = [...tickets];
        newTickets[index][fieldName] = value;
        setTickets(newTickets);
    };

    return (
        <Dialog>
            <DialogTrigger className=" bg-lime-400 px-6 py-1 rounded-3xl font-bold text-xs">
                Create new
            </DialogTrigger>
            <DialogOverlay onClick={handleClose} />
            <DialogContent className="max-w-[1500px] ">
                <DialogHeader>
                    <DialogTitle>New event</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4">
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
                                        onChange={(e) => handleImageChange(e)}
                                        accept="image/*"
                                    />
                                </label>
                            </div>

                            <div className="relative w-full p-6 mt-[-50px] bg-background z-30 rounded-[40px]">
                                <div className='flex items-center gap-4'>
                                    <Input onChange={(e) => handleNameChange(e)} placeholder="event name" />
                                </div>
                                <Textarea placeholder="Description" className="mt-4" onChange={(e) => handleDescriptionChange(e)} />

                                <div className='flex items-center gap-4 mt-4 border-t pt-4'>
                                    <Label>Choose start date</Label>
                                    <DatePicker date={endDate} setDate={setEndDate} />
                                    <MyTimePicker time={startTime} setTime={setStartTime} />
                                </div>
                                <div className="border rounded-md mt-4">
                                    <div className='flex justify-between items-center py-1 pl-2'>
                                        <h1 className="text-lg font-bold">Tickets</h1>
                                        <div className='flex items-center font-bold text-muted-foreground mt-1'>
                                            <PlusIcon onClick={addTicket} className='w-12 h-6 cursor-pointer' />
                                            <MinusIcon onClick={deleteTicket} className='w-12 h-6 cursor-pointer' />
                                        </div>
                                    </div>
                                    <ScrollArea className="h-[260px] w-full col-span-1">
                                        {tickets.map((ticket, index) => (
                                            <div key={index}>
                                                <div className='relative'>
                                                    <img src="/ticket.png" alt="ticket" className='w-full h-[150px] rounded-lg' />
                                                    <div className="absolute inset-0 bg-white ml-6 mr-7 my-6 rounded-md">
                                                        <div className="rounded-lg grid grid-cols-3 gap-4 h-full">
                                                            <div className='col-span-1 flex flex-col justify-between pb-2 pt-2 pl-2'>
                                                                <h1 className="text-lg font-bold col-span-1 justify-center flex h-full items-center pb-2 ">Ticket {index + 1}</h1>
                                                                <Input
                                                                    className=''
                                                                    onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                                                                    placeholder={`quantity`} />
                                                            </div>

                                                            <div className='col-span-2 flex flex-col gap-2 pt-2 pr-2'>
                                                                <Input onChange={(e) => handleTicketChange(index, 'name', e.target.value)} placeholder={`Enter name`} />
                                                                <Input
                                                                    onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                                                                    placeholder={`Enter price $`} />

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1'>
                        <Input
                            placeholder='Search for artists'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className='w-full mb-2'
                        />
                        <div className='border rounded-md'>
                            <p className='pt-2 pl-2 font-bold'>Finded artists</p>
                            <ScrollArea className="h-[300px] p-2">

                                {
                                    artists.map((artist) => (
                                        <div key={artist.id} className="col-span-1 mb-2">
                                            <Card

                                                className="h-[80px] flex items-center cursor-pointer hover:bg-secondary w-full"
                                            >
                                                <CardContent className="flex flex-row items-center justify-between w-full">
                                                    <div className='flex px-4'>
                                                        <Avatar>
                                                            <AvatarImage src={artist.image} alt={artist.artist} className="w-12 h-12" />
                                                            <AvatarFallback>AR</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col ml-2">
                                                            <p className="text-xd font-bold ml-2 pt-2">{artist.artist}</p>
                                                            <p className="text-muted-foreground text-xs ml-2">Artist</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <PlusIcon onClick={() => addArtist(artist)} className='w-10 h-10   cursor-pointer hover:bg-neutral-200 rounded-full p-2 mr-4' />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </ScrollArea>
                        </div>
                        <div className='border rounded-md mt-2'>
                            <p className='pt-2 pl-2 font-bold'>Added artists</p>
                            <ScrollArea className="h-[300px] p-2">
                                {
                                    addedArtists.map((artist) => (
                                        <div key={artist.id} className="col-span-1 mb-2">
                                            <Card

                                                className="h-[80px] flex items-center cursor-pointer hover:bg-secondary w-full"
                                            >
                                                <CardContent className="flex flex-row items-center justify-between w-full">
                                                    <div className='flex px-4'>
                                                        <Avatar>
                                                            <AvatarImage src={artist.image} alt={artist.artist} className="w-12 h-12" />
                                                            <AvatarFallback>AR</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col ml-2">
                                                            <p className="text-xd font-bold ml-2 pt-2">{artist.artist}</p>
                                                            <p className="text-muted-foreground text-xs ml-2">Artist</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <MinusIcon onClick={() => deleteArtist(artist)} className='w-10 h-10   cursor-pointer hover:bg-neutral-200 rounded-full p-2 mr-4' />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </ScrollArea>
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
    );
};

export default CreateNew;
