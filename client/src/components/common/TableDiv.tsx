import React from 'react';
import { TableCell, TableRow } from '../ui/table';

interface TableDivProps {
    colSpan: number;
    className?: string;
    children: React.ReactNode;
}

const TableDiv: React.FC<TableDivProps> = ({ colSpan, className, children }) => {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className={`text-center py-8 font-semibold ${className}`}>
                {children}
            </TableCell>
        </TableRow>
    );
};

export default TableDiv;
