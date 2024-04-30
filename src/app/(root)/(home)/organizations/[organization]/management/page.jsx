import React from 'react';
import Render from './management';
import OrganizationService from '@/service/orgService';

export default async function page({ params }) {
    const response = await getServerSideProps(params);
    const { org } = response;
    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col h-full overflow-hidden">
            <Render res={org} />
        </div>
    );
};

async function getServerSideProps(params) {
    const res = await OrganizationService.getOrganization(params.organization);
    if (!res)
        return null;
    const org = res.data;
    return {
        org
    };
}
