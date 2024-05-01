import React from 'react';
import Events from './EventManagement';
import EventService from '@/service/eventService';
import OrganizationService from '@/service/orgService';

export default async function page({ params }) {
    const response = await getServerSideProps(params);
    const { evdata, org } = response;
    return (
        <div className='flex bg-muted h-full'>
            <Events org={org} eventData={evdata} />
        </div>
    );
};

async function getServerSideProps(params) {
    const event = await EventService.getEvent(params.event);
    const res = await OrganizationService.getOrganization(event.data.organizationId);

    const org = res.data;
    const evdata = event.data;
    return {
        evdata,
        org
    };
}
