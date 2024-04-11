import React from 'react';
import Render from './render';
import ArtistService from '@/service/artistService';

export default async function page({ params }) {
    const artist = await getServerSideProps(params);
    return <Render artist={artist} />;
};


async function getServerSideProps(params) {
    const res = await ArtistService.getArtist(params.artist);
    const artist = res.data;
    return artist;
}
