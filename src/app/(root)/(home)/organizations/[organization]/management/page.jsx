import React from 'react';
import Render from './render';
import OrganizationService from '@/service/orgService';
import EventService from '@/service/eventService';

export default async function page({ params }) {
    const response = await getServerSideProps(params);
    const { evdata, org } = response;
    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col h-full overflow-hidden">
            <Render res={org} eventsData={evdata} />
        </div>
    );
};

async function getServerSideProps(params) {
    const res = await OrganizationService.getOrganization(params.organization);
    const events = await EventService.getEvents(res.data._id);

    if (!res)
        return null;
    const org = res.data;
    const evdata = events.data;
    return {
        evdata,
        org
    };
}
