import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoard from "../components/DashBoard";

const HomePageTen = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Admin' />

        {/* DashBoardLayerTen */}
        <DashBoard />
      </MasterLayout>
    </>
  );
};

export default HomePageTen;
