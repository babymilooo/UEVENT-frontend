import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from "date-fns"
// import { CalendarIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

function DatePicker({ date, setDate }) {
    return (<Popover>
        <PopoverTrigger asChild>
            <Button variant={"outline"} className={cn("w-[150px] justify-start text-center font-bold", !date && "text-muted-foreground")}>
                {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} />
        </PopoverContent>
    </Popover>);
}

export default DatePicker;