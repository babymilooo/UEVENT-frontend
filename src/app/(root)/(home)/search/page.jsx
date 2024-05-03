"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import ArtistService from "@/service/artistService";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import $api from "@/https/axios";
import { getUserCountryCode } from "@/lib/userCountryCode";
import ReactPaginate from "react-paginate";

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
const days = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

const Page = () => {
    const [search, setSearch] = useState("");
    const [timer, setTimer] = useState(null);
    const [eventTimer, setEventTimer] = useState(null);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadSearch, setLoadSearch] = useState(true);
    const [searchHistory, setSearchHistory] = useState([]);
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem("searchHistory");
            setSearchHistory(savedHistory ? JSON.parse(savedHistory) : []);
        } catch (error) {
            setSearchHistory([]);
        }
    }, []);
    const [artistsInfo, setArtistsInfo] = useState([]);

    const [showAllArtists, setShowAllArtists] = useState(false);
    const artistsToShow = useMemo(
        () => (showAllArtists ? artists : artists.slice(0, 6)),
        [showAllArtists, artists]
    );

    //event search
    const [now, setNow] = useState(new Date());
    const [onlyLocalEvents, setOnlyLocalEvents] = useState(true);
    const [startDate, setStartDate] = useState(now);
    const [endDate, setEndDate] = useState(
        new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30)
    ); //default - till next month
    const [order, setOrder] = useState("oldest"); // 'newest' | 'oldest'
    const [searchResultEvents, setSearchResultEvents] = useState({
        total: 0,
        page: 1,
        pages: 0,
        events: [],
    });

    const events = useMemo(() => {
        return searchResultEvents.events.map((event) => {
            const eventDate = new Date(event.date);
            const month = months[eventDate.getMonth()];
            const dayOfWeek = days[eventDate.getDay()];
            const dayOfMonth = eventDate.getDate();
            const time = eventDate.toTimeString().substring(0, 5);

            return {
                ...event,
                month,
                dayOfWeek,
                dayOfMonth,
                time,
            };
        });
    }, [searchResultEvents]);

    const [currentPage, setCurrentPage] = useState(0);
    const totalItems = searchResultEvents?.total;
    const itemsPerPage = 10;
    const pageCount = searchResultEvents?.pages;

    const router = useRouter();
    const handlePageClick = (data) => {
        // console.log(data);
        setCurrentPage(data.selected);
    };


    useEffect(() => {
        if (searchHistory.length > 0) {
            loadArtistsInfo(searchHistory);
        }
    }, [searchHistory]);

    const loadArtistsInfo = async (artistIds) => {
        try {
            const response = await ArtistService.getArtists(artistIds);
            setArtistsInfo(
                response.data.map((artist) => {
                    return {
                        artist: artist.name,
                        id: artist.id,
                        image: artist.images[1]?.url,
                    };
                })
            );
            setLoading(false);
        } catch (error) {
            console.error("Ошибка при загрузке информации об исполнителях:", error);
            // Обработка ошибок
        }
    };

    const handleSearch = async () => {
        try {
            const response = await ArtistService.searchArtists(search);
            setArtists(
                response.data.map((artist) => {
                    return {
                        artist: artist.name,
                        id: artist.id,
                        image: artist.images[1]?.url,
                    };
                })
            );
            setLoadSearch(false);
        } catch (error) {
            console.error("Ошибка при поиске артистов:", error);
            // Обработка ошибок при запросе
        }
    };

    const handleSearchEvents = useCallback(async () => {
        try {
            if (onlyLocalEvents) {
                const resp = await $api.get("/events/get-events", {
                    params: {
                        countryCode: await getUserCountryCode(),
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                        order,
                        eventName: search,
                        page: currentPage + 1,
                    },
                });
                setSearchResultEvents(resp.data);
            } else {
                const resp = await $api.get("/events/get-events", {
                    params: {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                        order,
                        eventName: search,
                        page: currentPage + 1,
                    },
                });
                setSearchResultEvents(resp.data);
            }
        } catch (error) {
            console.error(error?.response?.data?.message);
        }
    }, [endDate, onlyLocalEvents, order, search, startDate, currentPage]);

    useEffect(() => {
        setLoadSearch(true);
        if (timer) {
            clearTimeout(timer);
        }

        if (search.length === 0) {
            setArtists([]); // Очистить список артистов, если строка поиска пуста
        } else {
            setTimer(
                setTimeout(() => {
                    if (search) {
                        handleSearch();
                    }
                }, 500)
            ); // Задержка в 500 мс
        }

        // Очистка таймера при размонтировании компонента
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [search]);

    useEffect(() => {
        // setLoadSearch(true);
        if (eventTimer) {
            clearTimeout(eventTimer);
        }

        if (search.length === 0) {
            // setArtists([]); // Очистить список артистов, если строка поиска пуста
        } else {
            setEventTimer(
                setTimeout(() => {
                    if (search) {
                        handleSearchEvents();
                    }
                }, 500)
            ); // Задержка в 500 мс
        }

        // Очистка таймера при размонтировании компонента
        return () => {
            if (eventTimer) {
                clearTimeout(eventTimer);
            }
        };
    }, [handleSearchEvents]);



    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col items-center lg:items-start mb-12 w-full pt-14">
            <Input
                placeholder="Search for artists or events"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-2/3 mt-10 lg:ml-10"
            />
            <div className="flex flex-wrap flex-row gap-3 w-2/3 mt-5 lg:ml-10 items-center ">
                <div className="flex flex-row items-center gap-2">
                    <label htmlFor="startDate" className="align-center">
                        From
                    </label>
                    <Input
                        type="date"
                        id="startDate"
                        value={startDate.toISOString().substring(0, 10)}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                        className="w-fit"
                    />
                </div>

                <div className="flex flex-row items-center gap-2">
                    <label htmlFor="endDate">To</label>
                    <Input
                        type="date"
                        id="endDate"
                        value={endDate.toISOString().substring(0, 10)}
                        onChange={(e) => setEndDate(new Date(e.target.value))}
                        className="w-fit"
                    />
                </div>
                <div className="flex flex-row items-center gap-2">
                    <label htmlFor="eventsOtherCountries">
                        Events from other countries
                    </label>
                    <Checkbox
                        id="eventsOtherCountries"
                        checked={!onlyLocalEvents}
                        onCheckedChange={() => setOnlyLocalEvents(!onlyLocalEvents)}
                    />
                </div>
                <div className="flex flex-row items-center gap-2">
                    <label htmlFor="order">Order</label>
                    <Select value={order} onValueChange={(val) => setOrder(val)}>
                        <SelectTrigger>
                            <SelectValue>
                                {order == "newest"
                                    ? "Later first"
                                    : order == "oldest"
                                        ? "Sooner first"
                                        : "Select Order"}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="newest">Later first</SelectItem>
                                <SelectItem value="oldest">Sooner first</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {search === "" && searchHistory.length > 0 ? (
                <p className="mt-4 mb-2 font-bold pl-2">Search History</p>) : (!loadSearch &&
                    <>
                        <div className="flex justify-between items-center w-full p-4">
                            <p className=" font-bold pl-2">Artists</p>
                            <button
                                onClick={() => setShowAllArtists(!showAllArtists)}
                                className="font-bold text-md pl-5"
                            >
                                {showAllArtists ? "Less" : "More"}
                            </button>
                        </div>
                    </>
            )}
            <div className="grid grid-cols-1 ipad:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-y-auto p-2 gap-4 w-full">
                {/* Отображение истории поиска */}
                {search === "" && searchHistory.length > 0 ? (
                    loading ? (
                        Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className="col-span-1">
                                <Card className="h-[80px] ipad:h-[300px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] flex items-center cursor-pointer hover:bg-secondary w-full">
                                    <CardContent className="p-4 flex flex-row ipad:items-start items-center ipad:flex-col w-full pt-4">
                                        <Skeleton className="w-[230px] h-[230px] rounded-full" />
                                        <div className="flex flex-col gap-2 mt-4">
                                            <Skeleton className="h-4 w-[120px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    ) : (
                        artistsInfo.map((artist, index) => (
                            <div key={index} className="col-span-1">
                                <Card
                                    onClick={() => router.push(`/artist/${artist.id}`)}
                                    className="h-[80px] ipad:h-[300px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] flex items-center cursor-pointer hover:bg-secondary w-full"
                                >
                                    <CardContent className="p-4 flex flex-row ipad:items-start items-center ipad:flex-col w-full pt-4">
                                        <Avatar>
                                            <AvatarImage
                                                src={artist.image}
                                                alt={artist.artist}
                                                className="ipad:w-full w-10"
                                            />
                                            <AvatarFallback>AR</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col ml-2">
                                            <p className="text-xd font-bold ml-2 pt-2">
                                                {artist.artist}
                                            </p>
                                            <p className="text-muted-foreground text-xs ml-2">
                                                Artist
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    )
                ) : (
                    !loadSearch && search !== "" && (
                        artistsToShow.map((artist) => (
                            <div key={artist.id} className="">
                                <Card
                                    onClick={() => router.push(`/artist/${artist.id}`)}
                                    className="h-[80px] ipad:h-[300px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] flex items-center cursor-pointer hover:bg-secondary w-full"
                                >
                                    <CardContent className="p-4 flex flex-row ipad:items-start items-center ipad:flex-col w-full pt-4">
                                        <Avatar>
                                            <AvatarImage
                                                src={artist.image}
                                                alt={artist.artist}
                                                className="ipad:w-full w-10"
                                            />
                                            <AvatarFallback>AR</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col ml-2">
                                            <p className="text-xd font-bold ml-2 pt-2">
                                                {artist.artist}
                                            </p>
                                            <p className="text-muted-foreground text-xs ml-2">
                                                Artist
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    )
                )}

            </div>
            {!loadSearch && <p className="font-bold p-4 pl-6">Events</p>}
            <div className="grid ipad:grid-cols-2 grid-cols-1 p-1 gap-2 2xl:grid-cols-3 items-center w-full">
                {
                    search != '' && !loadSearch &&
                    <>
                    {events?.map((event, index) => (

                        <Card key={index} className="relative flex col-span-1 items-end bg-cover bg-center select-none overflow-hidden h-[200px] mb-1 cursor-pointer"
                            style={{ backgroundImage: `url('${event.picture ? event.picture : "/gradient.jpeg"}` }}
                            onClick={() => (router.push(`/events/${event._id}`))}
                        >
                            <div className="absolute inset-0 bg-black opacity-60"></div>
                            <CardContent className="flex h-full w-full">
                                <div className="bg-neutral-800 w-[200px] rounded-md h-[200px] flex ">
                                    <div className="flex flex-col items-center justify-center w-full h-full z-10">
                                        <p className="font-bold text-5xl text-white">{event.month}</p>
                                        <p className="text-6xl font-bold text-white">{event.dayOfMonth}</p>

                                    </div>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <p className=" font-bold ml-2 text-xl text-white mt-16 z-10">{event.name}</p>
                                    <div className='flex flex-col mb-8'>
                                        <p className="font-bold ml-2 text-white text-lg z-10 text-wrap">{event.location.address}</p>
                                        <p className=" font-bold ml-2 text-white z-10">{event.dayOfWeek} {event.time}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    
                    </>
                }
            </div>
            {(totalItems > itemsPerPage && search.length != 0 && events.length != 0) && <div className="mt-10 m-auto">
                <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName="flex list-none justify-center p-4"
                    activeClassName="bg-black text-white rounded-full"
                    pageClassName="mx-1"
                    pageLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                    previousClassName="mx-1"
                    nextClassName="mx-1"
                    previousLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                    nextLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                    breakClassName="mx-1"
                    breakLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                    forcePage={currentPage}
                    disabledClassName="opacity-30 cursor-not-allowed"
                />
            </div>}
        </div>
    );
};

export default Page;
