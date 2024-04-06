import React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}


const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef(
    ({ className, side, align = 'center', sideOffset = 4, ...props }, ref) => (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                ref={ref}
                align={align}
                sideOffset={sideOffset}
                side={side}
                className={cn(
                    'z-50 bg-background border min-w-52 select-none text-foreground shadow-md outline-none animate-jump-in animate-once animate-duration-200 animate-delay-100 animate-ease-out',
                    className
                )}
                {...props}
            />
        </PopoverPrimitive.Portal>
    )
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
