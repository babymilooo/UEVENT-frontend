import React from 'react';
import Render from './organization';
import OrganizationService from '@/service/orgService';
import EventService from '@/service/eventService';


export default async function page({ params }) {
    const response = await getServerSideProps(params);
    const { evdata, org } = response;
    return (
        <div>
            <Render res={org} eventsData={evdata} />
        </div>
    );
};

async function getServerSideProps(params) {
    const res = await OrganizationService.getOrganization(params.organization);
    const events = await EventService.getEvents(res.data._id, 10, 1);

    if (!res)
        return null;
    const org = res.data;
    const evdata = events.data.events;
    return {
        evdata,
        org
    };
}
