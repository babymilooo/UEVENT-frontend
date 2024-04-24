import React from 'react';
import Render from './render';
import OrganizationService from '@/service/orgService';


export default async function page({ params }) {
    const response = await getServerSideProps(params);

    return (
        <div>
            <Render organization={response} />
        </div>
    );
};

async function getServerSideProps(params) {
    const res = await OrganizationService.getOrganization(params.organization);

    if (!res)
        return null;
    const org = res.data;
    return org;
}
