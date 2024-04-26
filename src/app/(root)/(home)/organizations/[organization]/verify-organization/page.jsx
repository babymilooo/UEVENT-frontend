"use client";

import $api from "@/https/axios";
import { RootStoreContext } from "@/providers/rootStoreProvider";
import OrganizationService from "@/service/orgService";
import UserService from "@/service/userService";
import { Loader } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function OrganizationVerificationPage() {
  const { organization } = useParams();
  const rootStore = useContext(RootStoreContext);
  const { userStore } = rootStore;
  const router = useRouter();
  const [orgData, setOrgData] = useState(null);
  const [creatorData, setCreatorData] = useState(null);

  useEffect(() => {
    if (userStore.role != "admin") router.push("/");
  }, [userStore.role]);

  useEffect(() => {
    OrganizationService.getOrganization(organization).then((resp) => {
      setOrgData(resp?.data);
      UserService.getUserInfoById(resp?.data?.createdBy).then((resp) => {
        setCreatorData(resp?.data);
      });
    });
  }, [organization]);

  const handleClick = async () => {
    try {
      const resp = await $api.post(
        `/organization/verify-organization/${encodeURIComponent(organization)}`
      );
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <>
      <div className="m-auto">
        {!orgData && (
          <>
            <Loader size={40} />
          </>
        )}
        {orgData && (
          <>
            <div className="flex flex-col m-auto">
              {/* organization info */}
              <h2 className="text-xl">Organisation Info</h2>
              <p className="m-0 p-1">Name: {orgData.name}</p>
              <p className="m-0 p-1">Description: {orgData.description}</p>
              <p className="m-0 p-1">Website: {orgData.website}</p>
              <p className="m-0 p-1">Email: {orgData.email}</p>
              <p className="m-0 p-1">Phone: {orgData.phone}</p>
              <p className="m-0 p-1">Verified: {orgData.isVerified}</p>
              {creatorData && (
                <>
                  {/* creator data */}
                  <h2 className="text-xl">Creator Info</h2>
                  <p className="m-0 p-1">Creator Name: {creatorData.name}</p>
                  <p className="m-0 p-1">Creator Email: {creatorData.email}</p>
                  <button
                    type="button"
                    className="bg-lime-400 px-6 py-3 rounded-md font-bold text-xs text-black mt-6"
                    onClick={handleClick}
                  >
                    Verify This Organization
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default observer(OrganizationVerificationPage);
