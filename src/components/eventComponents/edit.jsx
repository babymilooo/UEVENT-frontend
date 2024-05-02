import { use, useEffect, useState } from 'react';

import {
    Dialog,
    DialogOverlay,
    DialogContent,
    DialogDescription,
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
import { Cross2Icon, MinusIcon, Pencil2Icon, PlusIcon } from '@radix-ui/react-icons';
import ArtistService from '@/service/artistService';
import EventService from '@/service/eventService';
import axios from 'axios';
import { GearIcon } from '@radix-ui/react-icons';
import Tickets from './editComponents/tickets';
import { useRouter } from 'next/navigation';

const EditDialog = ({ eventData, setEventData }) => {
    const [backgroundImage, setBackgroundImage] = useState(eventData.picture);
    const [bg, setBg] = useState(null);
    const [name, setName] = useState(eventData.name);
    const [description, setDescription] = useState(eventData.description);
    const [endDate, setEndDate] = useState(new Date(eventData.date));
    const [startTime, setStartTime] = useState(eventData.time);
    const [defaultTickets, setdefaultTickets] = useState(eventData.ticketOptions);
    const [tickets, setTickets] = useState([]);
    const [artists, setArtists] = useState([]);
    const [addedArtistsId, setAddedArtistsId] = useState(eventData.artists);
    const [addedArtists, setAddedArtists] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedPlace, setSelectedPlace] = useState("");
    const [timer, setTimer] = useState(null);
    const [loading, setLoading] = useState(true);

    const orgId = eventData.organizationId;
    const router = useRouter();
    useEffect(() => {
        const loadArtistsInfo = async () => {
            try {
                const response = await ArtistService.getArtists(eventData.artists);
                if (response?.data?.length > 0) {
                    setAddedArtists(response.data.map((artist) => {
                        return {
                            artist: artist.name,
                            id: artist.id,
                            image: artist.images[1]?.url,
                        };
                    }));
                }

            } catch (error) {
                console.error("Ошибка при загрузке информации об исполнителях:", error);
                // Обработка ошибок
            }
        };

        if (eventData.artists.length > 0) {
            loadArtistsInfo();
        }

        const selectPlace = async () => {
            const position = { lat: parseFloat(eventData.location.latitude), lng: parseFloat(eventData.location.longitude) };
            const latLng = { latLng: position, address: eventData.location.address, countryCode: eventData.location.countryCode }
            setSelectedPlace(latLng);
        }

        if (eventData.location.latitude && eventData.location.longitude) {
            selectPlace();
        }

        setLoading(false);

    }, [eventData]);

    const handleBgChange = (e) => {
        setBg(e.target.files[0]);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
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
        setDescription(e.target.value);
    }


    const handleSearch = async () => {
        try {
            const response = await ArtistService.searchArtists(search);
            const artistsToAdd = response.data.map((artist) => {
                return {
                    artist: artist?.name,
                    id: artist?.id,
                    image: artist?.images[1]?.url,
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


    const handleClose = async () => {
        setBackgroundImage(eventData.picture);
        setName(eventData.name);
        setDescription(eventData.description);
        setBg(null);
        setSearch('');
        setTickets([]);
        // setDefaultTickets(eventData.ticketOptions);
        setdefaultTickets(eventData.ticketOptions);
    }

    const handleEdit = async () => {
        const timeHours = Number(startTime.slice(0, 2));
        const timeMinutes = Number(startTime.slice(3, 5));
        endDate.setHours(timeHours);
        endDate.setMinutes(timeMinutes);
        const ticketPromises = tickets.map(async (ticket) => {
            const ticketData = {
                event: eventData._id,
                name: ticket.name,
                price: parseFloat(ticket.price) * 100,
                quantity: parseInt(ticket.quantity)
            };
            // Возвращаем результат создания билета (обещание)
            return EventService.createTicket(ticketData);
        });

        // Дожидаемся завершения всех обещаний создания билетов
        await Promise.all(ticketPromises);

        const location = { latitude: selectedPlace.latLng.lat, longitude: selectedPlace.latLng.lng, countryCode: selectedPlace.countryCode, address: selectedPlace.address }
        const data = { name, description, date: endDate, time: startTime, location, artists: addedArtistsId };
        let res;
        const event = await EventService.updateEvent(eventData._id, data);
        if (bg) {
            res = await EventService.updatePicture(eventData._id, bg);
        }



        if (event.data) {
            const updatedData = { ...event.data };

            if (bg) {
                updatedData.picture = res.data.picture;
            }

            setEventData(updatedData);
            setdefaultTickets(updatedData.ticketOptions);
        }
    }

    const handleDelete = async () => {
        const res = await EventService.deleteEvent(eventData._id);
        router.push(`/organizations/${orgId}/management`);
    }

    return (
        <Dialog>
            <DialogTrigger>
                <GearIcon width={30} height={30} />
            </DialogTrigger>
            <DialogOverlay onClick={handleClose} />
            <DialogContent className="max-w-[1500px] ">
                <DialogHeader>
                    <DialogTitle>Edit event</DialogTitle>
                </DialogHeader>
                <div>

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
                                        <Input onChange={(e) => handleNameChange(e)} placeholder="event name" value={name} />
                                    </div>
                                    <Textarea placeholder="Description" className="mt-4" onChange={(e) => handleDescriptionChange(e)} value={description} />

                                    <div className='flex items-center gap-4 mt-4 border-t pt-4'>
                                        <Label>Choose start date</Label>
                                        <DatePicker date={endDate} setDate={setEndDate} />
                                        <MyTimePicker time={startTime} setTime={setStartTime} />
                                    </div>
                                    <Tickets defaultTickets={defaultTickets} tickets={tickets} setTickets={setTickets} setDefaultTickets={setdefaultTickets} />
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
                            {
                                loading ? <div>Loading...</div> : <GoogleMap selectedPlace={selectedPlace} setSelectedPlace={setSelectedPlace} />
                            }

                        </div>
                    </div>
                    <div className='grid grid-cols-6 justify-end col-span-2 gap-4 w-full'>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <Dialog className="col-span-2">
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
                                <Button onClick={handleEdit} className="w-full">Edit</Button>
                            </div>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditDialog;
