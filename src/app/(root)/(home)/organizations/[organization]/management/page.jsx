import React from 'react';
import Render from './render';
import OrganizationService from '@/service/orgService';
import EventService from '@/service/eventService';

export default async function page({ params }) {
    const response = await getServerSideProps(params);
    const { evdata, org, totalItems, totalPages } = response;
    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col h-full overflow-hidden">
            <Render res={org} eventsData={evdata} total={totalItems} totalPages={totalPages} />
        </div>
    );
};

async function getServerSideProps(params) {
    const res = await OrganizationService.getOrganization(params.organization);
    const result = await EventService.getEvents(res.data._id, params.limit, params.currentPage);

    if (!result)
        return null;
    const org = res.data;
    const evdata = result.data.events;
    const totalItems = result.data.totalItems;
    const totalPages = result.data.totalPages;
    return {
        evdata,
        org,
        totalItems,
        totalPages
    };
}
