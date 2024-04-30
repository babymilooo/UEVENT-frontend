import axios from "axios";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const fetchData = async (events, setEvents) => {
    try {
        const processedEvents = await Promise.all(
            events.map(async (event) => {
                const eventDate = new Date(event.date);
                const month = months[eventDate.getMonth()];
                const dayOfWeek = days[eventDate.getDay()];
                const dayOfMonth = eventDate.getDate();

                if (event.location?.latitude && event.location?.longitude) {
                    const response = await axios.get(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.location.latitude},${event.location.longitude}&key=${API_KEY}`
                    );
                    let address = '';
                    let city = '';
                    let country = '';
                    let street = '';
                    let route = '';
                    if (response.data.results.length > 0) {
                        const placeInfo = response.data.results[0];

                        // Iterate over address components to extract short names
                        placeInfo.address_components.forEach((component) => {
                            const types = component.types;
                            const shortName = component.short_name;

                            // Check types and assign short names accordingly
                            if (types.includes('locality')) {
                                city = shortName;
                            } else if (types.includes('country')) {
                                country = shortName;
                            } else if (types.includes('route')) {
                                route = shortName;
                            } else if (types.includes('street_number')) {
                                street = shortName;
                            }
                            // Add additional checks for other types if needed
                        });

                        // Construct formatted address using extracted data

                        if (route && street) {
                            address = `${route} ${street}, ${city}, ${country}`;
                        } else if (route || street) {
                            address = `${route}${street}, ${city}, ${country}`;
                        } else {
                            address = `${city}, ${country}`;
                        }
                    }

                    return {
                        ...event,
                        month,
                        dayOfWeek,
                        dayOfMonth,
                        address
                    };
                } else {
                    // If latitude or longitude is missing, return event without address
                    return {
                        ...event,
                        month,
                        dayOfWeek,
                        dayOfMonth,
                        address: ''
                    };
                }
            })
        );

        setEvents(processedEvents);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export default fetchData;