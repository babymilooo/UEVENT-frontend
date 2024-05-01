import React, { useState } from 'react';
import { CheckIcon, Cross2Icon, MinusIcon, Pencil2Icon, PlusIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import EventService from '@/service/eventService';

export function Tickets({
    defaultTickets,
    setDefaultTickets,
    tickets,
    setTickets,
}) {
    const [editModes, setEditModes] = useState(Array(defaultTickets.length).fill(false));
    const [editedTickets, setEditedTickets] = useState([...defaultTickets]); // Copy of defaultTickets

    // Function to toggle edit mode for a specific ticket
    const toggleEditMode = (index) => {
        const updatedEditModes = [...editModes];
        updatedEditModes[index] = !updatedEditModes[index];
        setEditModes(updatedEditModes);
    };

    const handleDefaultTicketsChange = (index, fieldName, value) => {
        const updatedTickets = [...editedTickets];
        updatedTickets[index] = {
            ...updatedTickets[index],
            [fieldName]: value
        };
        setEditedTickets(updatedTickets);
    };

    const handleSaveChanges = async (index) => {
        const updatedDefaultTickets = [...defaultTickets];
        updatedDefaultTickets[index] = { ...editedTickets[index], price: parseFloat(editedTickets[index].price) * 100, quantity: parseInt(editedTickets[index].quantity) };
        // Update defaultTickets state with the modified array
        const ticketData = {
            name: updatedDefaultTickets[index].name,
            price: parseFloat(updatedDefaultTickets[index].price),
            quantity: parseInt(updatedDefaultTickets[index].quantity)
        };

        await EventService.editTicket(updatedDefaultTickets[index].id, ticketData);
        setDefaultTickets(updatedDefaultTickets);
        toggleEditMode(index); // Disable edit mode
    };

    const handleCancelEdits = (index) => {
        const updatedTickets = [...editedTickets];
        updatedTickets[index] = { ...defaultTickets[index] }; // Revert to original values
        setEditedTickets(updatedTickets);

        // Disable edit mode
        toggleEditMode(index);
    };

    const addTicket = () => {
        setTickets([...tickets, { name: '', price: '' }]);
    };

    // Функция для удаления последнего билета
    const deleteTicket = () => {
        setTickets(tickets.slice(0, tickets.length - 1));
    };

    const handleTicketChange = (index, fieldName, value) => {
        const newTickets = [...tickets];
        newTickets[index][fieldName] = value;
        setTickets(newTickets);
    };

    return <div className="border rounded-md mt-4">
        <div className='flex justify-between items-center py-1 pl-2'>
            <h1 className="text-lg font-bold">Tickets</h1>
            <div className='flex items-center font-bold text-muted-foreground mt-1'>
                <PlusIcon onClick={addTicket} className='w-12 h-6 cursor-pointer' />
                <MinusIcon onClick={deleteTicket} className='w-12 h-6 cursor-pointer' />
            </div>
        </div>
        <ScrollArea className="h-[260px] w-full col-span-1">
            {defaultTickets.map((ticket, index) => (
                <div key={index} className='relative'>
                    <img src="/ticket.png" alt="ticket" className='w-full h-[150px] rounded-lg' />
                    <div className="absolute inset-0 bg-white ml-6 mr-7 my-6 rounded-md">
                        <div className="rounded-lg grid grid-cols-5 gap-4 h-full">
                            <div className='col-span-2 flex flex-col justify-between pb-2 pt-2 pl-2'>
                                <h1 className="text-lg font-bold col-span-1 justify-center flex h-full items-center pb-2">
                                    Ticket {index + 1}
                                </h1>
                                {editModes[index] ? (
                                    <Input
                                        onChange={(e) => handleDefaultTicketsChange(index, 'quantity', e.target.value)}
                                        placeholder={`Quantity`}
                                        defaultValue={ticket.quantity}
                                    />
                                ) : (
                                    <Input disabled value={ticket.quantity} />
                                )}
                            </div>

                            <div className='col-span-2 flex flex-col gap-2 pt-2 pr-2'>
                                {editModes[index] ? (
                                    <Input
                                        onChange={(e) => handleDefaultTicketsChange(index, 'name', e.target.value)}
                                        placeholder={`Enter name`}
                                        defaultValue={ticket.name}
                                    />
                                ) : (
                                    <Input disabled value={ticket.name} />
                                )}
                                {editModes[index] ? (
                                    <Input
                                        onChange={(e) => handleDefaultTicketsChange(index, 'price', e.target.value)}
                                        placeholder={`Enter price $`}
                                        defaultValue={ticket.price / 100}
                                    />
                                ) : (
                                    <Input disabled value={ticket.price / 100} />
                                )}
                            </div>

                            <div className='col-span-1 flex flex-col pt-2 pr-2 items-end mr-2 gap-9'>
                                {editModes[index] ? (
                                    <>
                                        <CheckIcon
                                            className='h-6 w-6 cursor-pointer text-green-700'
                                            onClick={() => handleSaveChanges(index)}
                                        />
                                        <Cross2Icon
                                            className='h-6 w-6 cursor-pointer text-red-500'
                                            onClick={() => handleCancelEdits(index)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Pencil2Icon
                                            className='h-6 w-6 cursor-pointer'
                                            onClick={() => toggleEditMode(index)}
                                        />
                                        <Cross2Icon className='h-6 w-6 cursor-pointer' />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {tickets.map((ticket, index) => <div key={index}>
                <div className='relative'>
                    <img src="/ticket.png" alt="ticket" className='w-full h-[150px] rounded-lg' />
                    <div className="absolute inset-0 bg-white ml-6 mr-7 my-6 rounded-md">
                        <div className="rounded-lg grid grid-cols-3 gap-4 h-full">
                            <div className='col-span-1 flex flex-col justify-between pb-2 pt-2 pl-2'>
                                <h1 className="text-lg font-bold col-span-1 justify-center flex h-full items-center pb-2 ">Ticket {index + 1}</h1>
                                <Input className='' onChange={e => handleTicketChange(index, 'quantity', e.target.value)} placeholder={`quantity`} value={ticket.quantity} />
                            </div>

                            <div className='col-span-2 flex flex-col gap-2 pt-2 pr-2'>
                                <Input onChange={e => handleTicketChange(index, 'name', e.target.value)} placeholder={`Enter name`} value={ticket.name} />
                                <Input onChange={e => handleTicketChange(index, 'price', e.target.value)} placeholder={`Enter price $`} defaultValue={ticket?.price / 100} />

                            </div>
                        </div>
                    </div>
                </div>

            </div>)}
        </ScrollArea>
    </div>;
}
export default Tickets;