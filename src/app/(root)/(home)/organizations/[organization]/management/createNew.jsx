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


const CreateNew = ({ organization }) => {
    const [backgroundImage, setBackgroundImage] = useState("/gradient.jpeg");
    const [bg, setBg] = useState(null);
    const [endDate, setEndDate] = useState(new Date());
    const [startTime, setStartTime] = useState("");
    const [selectedPlace, setSelectedPlace] = useState(organization.location);
    const [name, Setname] = useState("");
    const [description, SetDescription] = useState("");

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

    const handleClose = async () => {
        setBackgroundImage("/gradient.jpeg");
        Setname("");
        SetDescription("");
        setSelectedPlace("");
        setBg(null);
    }

    const handleCreate = async () => {
        const data = { name, description, picture: bg };
        // const response = await OrganizationService.createOrganization(data);
    }

    const [tickets, setTickets] = useState([
        { name: '', price: '' } // Начальный билет с пустыми значениями для имени и цены
    ]);

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

    useEffect(() => {
        console.log(tickets);
    }
        , [tickets]);

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
                                <div className='flex justify-between items-center'>
                                    <h1 className="text-lg font-bold">Tickets</h1>
                                    <div className='flex items-center font-bold text-muted-foreground mt-1'>
                                        <PlusIcon onClick={addTicket} className='w-12 h-6 cursor-pointer' />
                                        <MinusIcon onClick={deleteTicket} className='w-12 h-6 cursor-pointer' />
                                    </div>
                                </div>
                                <ScrollArea className="h-[250px] w-full col-span-1">
                                    {tickets.map((ticket, index) => (
                                        <div key={index}>
                                            <div className='relative'>
                                                <img src="/ticket.png" alt="ticket" className='w-full h-[150px] rounded-lg' />
                                                <div className="absolute inset-0 bg-white ml-6 mr-7 my-6 rounded-md">
                                                    <div className="rounded-lg grid grid-cols-3 gap-4 h-full">
                                                        <h1 className="text-lg font-bold col-span-1 justify-center flex items-center ">Ticket {index + 1}</h1>
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
                    <div className='col-span-1'>
                        <Input placeholder="find artist" />
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