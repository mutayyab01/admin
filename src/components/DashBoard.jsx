import React from "react";
import UnitCountSeven from "./child/UnitCountSeven";
import IncomeVsExpense from "./child/IncomeVsExpense";
import UsersChart from "./child/UsersChart";
import TopSuppliers from "./child/TopSuppliers";
import TopCustomer from "./child/TopCustomer";
import OverallReport from "./child/OverallReport";
import PurchaseAndSales from "./child/PurchaseAndSales";
import RecentTransactions from "./child/RecentTransactions";

const DashBoard = () => {
  return (
    <div className='row gy-4'>
      {/* UnitCountSeven */}
      {/* <UnitCountSeven /> */}
      <iframe title="DirectDBDashboard" width="600" height="900" src="https://app.powerbi.com/view?r=eyJrIjoiYjYxZjdiOWYtZDBhMi00YzI1LTkyODAtMDMyOGMxYmRmNzc2IiwidCI6IjYyZWU5NzYyLWI0YWMtNDEzNC1iZmU5LTdjYTZiNjE3MjRhYiIsImMiOjl9" frameborder="0" allowFullScreen="true"></iframe>
      {/* IncomeVsExpense */}
      {/* <IncomeVsExpense /> */}

      {/* UsersChart */}
      {/* <UsersChart /> */}

      {/* TopSuppliers */}
      <TopSuppliers />

      {/* TopCustomer */}
      <TopCustomer />

      {/* OverallReport */}
      {/* <OverallReport /> */}

      {/* PurchaseAndSales */}
      {/* <PurchaseAndSales /> */}

      {/* RecentTransactions */}
      <RecentTransactions />
    </div>
  );
};

export default DashBoard;
