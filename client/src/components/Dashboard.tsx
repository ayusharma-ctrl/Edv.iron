import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { ModeToggle } from './common/ToggleTheme';
import { CopyIcon, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import TableDiv from './common/TableDiv';
import Info from './common/Info';

interface Transaction {
    collect_id: string;
    school_id: string;
    gateway: string;
    order_amount: number;
    transaction_amount: number;
    status: string;
    custom_order_id: string;
}

interface ApiResponse {
    data: Transaction[];
    resultCount: number;
    totalCount: number;
    page: number;
    limit: number;
}

type TransactionQueryKey = [string, number, number, string, string];

const server_url = import.meta.env.VITE_SERVER_URL;
const server_api_key = import.meta.env.VITE_SERVER_API_KEY;

const isValidMongoId = (id: string) => id?.length >= 24;

const Dashboard = () => {
    const limit = 10;
    const [page, setPage] = useState<number>(1);
    const [status, setStatus] = useState<string>('ALL');
    const [schoolId, setSchoolId] = useState<string>('');
    const [tempSchoolId, setTempSchoolId] = useState<string>('');
    const [customOrderId, setCustomOrderId] = useState<string>('');
    const [tempCustomOrderId, setTempCustomOrderId] = useState<string>('');

    const [genPayLink, setGenPayLink] = useState<boolean>(false); // loader - establish pg connnection

    // method to fetch transactions data from backend
    const fetchTransactions = async ({ queryKey }: { queryKey: TransactionQueryKey }): Promise<ApiResponse> => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, currPage, currLimit, currSchoolId, currCustomOrderId] = queryKey;

        const headers = {
            authorization: `Bearer ${server_api_key}`,
        };

        if (currCustomOrderId) {
            const { data } = await axios.get(`${server_url}/transactions/check-status/${currCustomOrderId}`, {
                headers,
            });

            return {
                data: data?.data ? [data?.data] : [],
                resultCount: 1,
                totalCount: 1,
                page: 1,
                limit: 1,
            };
        } else if (currSchoolId && isValidMongoId(currSchoolId)) {
            const { data } = await axios.get(`${server_url}/transactions/school/${currSchoolId}`, {
                params: { page: currPage, limit: currLimit },
                headers,
            });
            return data?.data;
        } else {
            const { data } = await axios.get(`${server_url}/transactions/all`, {
                params: { page: currPage, limit: currLimit },
                headers,
            });
            return data?.data;
        }

    };

    // filter transactions on UI based on 'Status'
    const filterTransactions = (transactions: Transaction[]): Transaction[] => {
        if (!status || status.toLowerCase() === 'all') {
            return transactions;
        }
        return transactions?.filter((transaction) =>
            transaction?.status?.toLowerCase() === status.toLowerCase()
        );
    };

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery<ApiResponse, Error, ApiResponse, TransactionQueryKey>({
        queryKey: ['transactions', page, limit, schoolId, customOrderId],
        queryFn: fetchTransactions,
    });

    // method to redirect to payment page
    const handlePayment = async (schoolId: string, amount: number) => {
        if (!schoolId && !isValidMongoId(schoolId)) return alert('Invalid School Id');
        try {
            const headers = {
                authorization: `Bearer ${server_api_key}`,
            };

            const body = {
                school_id: schoolId,
                amount
            }

            setGenPayLink(true);

            const response = await axios.post(`${server_url}/transactions/collect-payment`, body, {
                headers,
            });

            if (response?.data?.data) {
                window.location.href = response?.data?.data;
            } else {
                alert("Unable to generate payment link for this Institution as these are dummy IDs.")
            }

            setGenPayLink(false);
        } catch (e) {
            setGenPayLink(false);
            console.log(e);
        }
    }

    const handleResetFilters = () => {
        setSchoolId('');
        setTempSchoolId('');
        setStatus('ALL');
        setCustomOrderId('');
        setTempCustomOrderId('');
        setPage(1);
        refetch();
    };

    const filteredTransactions = data?.data ? filterTransactions(data?.data) : [];

    const capitalizeText = (text: string): string => {
        return text[0]?.toUpperCase() + text?.slice(1)?.toLowerCase();
    }

    useEffect(() => {
        const id = setTimeout(() => {
            setCustomOrderId(tempCustomOrderId);
        }, 2000);
        return () => clearTimeout(id);
    }, [tempCustomOrderId]);

    useEffect(() => {
        const id = setTimeout(() => {
            setSchoolId(tempSchoolId);
        }, 2000);
        return () => clearTimeout(id);
    }, [tempSchoolId]);

    const renderPagination = () => {
        if (!data) return null;
        const totalPages = Math.ceil(data.totalCount / limit);
        return (
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <Button
                        key={index}
                        onClick={() => setPage(index + 1)}
                        variant={page === index + 1 ? 'default' : 'outline'}
                        className="mx-1"
                    >
                        {index + 1}
                    </Button>
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-wrap justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className='flex justify-end items-center gap-2'>
                    {genPayLink && (
                        <div className="flex justify-center items-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    )}
                    <Info message='Do not pay. Just for the demo' className='text-xs'>
                        <Button disabled={genPayLink} onClick={() => handlePayment("65b0e6293e9f76a9694d84b4", 563)} size="sm" className="text-xs">
                            Demo Pay
                        </Button>
                    </Info>
                    <Link to="/">
                        <Button size="sm" className="text-xs">
                            Home
                        </Button>
                    </Link>
                    <ModeToggle />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Input
                    placeholder="School ID"
                    value={tempSchoolId}
                    disabled={customOrderId.length > 0}
                    onChange={(e) => setTempSchoolId(e.target.value)}
                />
                <Select value={status ? status : undefined} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        <SelectItem value="SUCCESS">Success</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Custom Order ID"
                    value={tempCustomOrderId}
                    disabled={schoolId.length >= 24}
                    onChange={(e) => setTempCustomOrderId(e.target.value)}
                />
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
                </div>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow className='bg-gray-200 dark:bg-gray-500 transition-colors border-none'>
                            <TableHead className='rounded-l-lg'>Collect ID</TableHead>
                            <TableHead>School ID</TableHead>
                            <TableHead>Gateway</TableHead>
                            <TableHead>Order Amount</TableHead>
                            <TableHead>Transaction Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='rounded-r-lg'>Custom Order ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='text-center min-w-full'>
                        {isLoading ? (
                            <TableDiv colSpan={7}>
                                <div className="flex justify-center items-center">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            </TableDiv>
                        ) : isError ? (
                            <TableDiv colSpan={7} className='text-red-500'>
                                Something went wrong, please come back later!
                            </TableDiv>
                        ) : data && filteredTransactions?.length > 0 ? (
                            <>
                                {filteredTransactions?.map((transaction) => (
                                    <TableRow
                                        key={transaction?.collect_id}
                                        className='border-b text-start transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800 hover:shadow-md hover:scale-[1.01] hover:cursor-pointer'
                                    >
                                        <TableCell className='rounded-l-lg'>
                                            <div className='flex justify-between items-center gap-2 pr-6'>
                                                <span>{transaction?.collect_id}</span>
                                                <CopyIcon onClick={() => navigator.clipboard.writeText(transaction?.collect_id)} strokeWidth={1.25} className='hover:opacity-80 transition-opacity' />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex justify-between items-center gap-2 pr-6'>
                                                <span>{transaction?.school_id}</span>
                                                <CopyIcon onClick={() => navigator.clipboard.writeText(transaction?.school_id)} strokeWidth={1.25} className='hover:opacity-80 transition-opacity' />
                                            </div>
                                        </TableCell>
                                        <TableCell>{transaction?.gateway}</TableCell>
                                        <TableCell>₹{transaction?.order_amount}</TableCell>
                                        <TableCell>₹{transaction?.transaction_amount}</TableCell>
                                        <TableCell className={`${transaction?.status?.toLowerCase() === 'success' ? 'text-green-500' : (transaction?.status?.toLowerCase() === 'failed' || transaction?.status?.toLowerCase() === 'failure') ? 'text-red-500' : 'text-yellow-500'}`}>{transaction?.status && capitalizeText(transaction?.status)}</TableCell>
                                        <TableCell className='rounded-r-lg'>
                                            <div className='flex justify-between items-center gap-2'>
                                                <span>{transaction?.custom_order_id}</span>
                                                {transaction?.status?.toLowerCase() !== 'success' && (
                                                    <Button onClick={() => handlePayment(transaction?.school_id, transaction?.transaction_amount)} size="sm" className="text-xs h-6 py-0 px-2">
                                                        Pay
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableDiv colSpan={7}>{renderPagination()}</TableDiv>
                            </>
                        ) : (
                            <TableDiv colSpan={7}>No data found.</TableDiv>
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
    );
};

export default Dashboard;
