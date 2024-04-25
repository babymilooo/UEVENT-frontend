import { useState } from 'react';

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
        console.log("close");
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

    return (
        <Dialog>
            <DialogTrigger className=" bg-lime-400 px-6 py-1 rounded-3xl font-bold text-xs">
                Create new
            </DialogTrigger>
            <DialogOverlay onClick={handleClose}>
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
                                            onChange={(e) => handleImageChange(e)}
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
            </DialogOverlay>
        </Dialog>
    );
};

export default CreateNew;