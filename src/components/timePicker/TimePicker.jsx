import { useState } from 'react';

const MyTimePicker = ({ time, setTime }) => {

    const [value, onChange] = useState(time);

    return (
        // <div>
        //     <TimePicker onChange={onChange} value={value} />
        // </div>
        <div className='flex-1'>
            <input type="time" className='flex border rounded-md items-center justify-center px-4 py-2 w-full text-center font-bold' defaultValue={value} onChange={(e) => setTime(e.target.value)}></input>
        </div>
    );
};

export default MyTimePicker;