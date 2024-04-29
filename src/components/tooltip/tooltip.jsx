// components/Tooltip.js
export default function Tooltip({ children, text }) {
    return (
        <div className="group relative flex items-center">
            {children}
            <div className="absolute bottom-full right-2 -mb-[70px] hidden group-hover:block shadow-md z-50 bg-neutral-300 rounded animate-fade-down animate-once animate-duration-200 animate-delay-500 animate-ease-out">
                <div className="bg-background text-foreground text-xs rounded py-1 px-2 right-0">
                    {text}
                </div>
            </div>
        </div>
    );
}

