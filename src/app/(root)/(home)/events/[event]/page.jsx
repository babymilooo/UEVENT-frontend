import React from 'react';
import Event from './Event';
import EventService from '@/service/eventService';
import OrganizationService from '@/service/orgService';

export default async function page({ params }) {
    const response = await getServerSideProps(params);
    const { evdata, org } = response;
    return (
        <div>
            <Event org={org} eventData={evdata} />
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
