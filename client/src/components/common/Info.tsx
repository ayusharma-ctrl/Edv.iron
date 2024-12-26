import React from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


interface InfoProps {
    message: string;
    className?: string;
    children: React.ReactNode;
}

const Info: React.FC<InfoProps> = ({ message, className, children }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <p className={`${className}`}>{message}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Info;
