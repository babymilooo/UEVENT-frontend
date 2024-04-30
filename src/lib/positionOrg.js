import axios from "axios";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const positionOrg = async (position, setAddress) => {
    const { lat, lng } = position;
    let address = '';
    let city = '';
    let country = '';
    let street = '';
    let route = '';
    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
        );
        if (response.data.results.length > 0) {
            const placeInfo = response.data.results[0];

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

            address = `${route} ${street}, ${city}, ${country} `;
            setAddress(address);
        }
    } catch (error) {
        console.error('Error fetching place information:', error);
    }
};

export default positionOrg;