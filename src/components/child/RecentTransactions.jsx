import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "https://instagrocerrenderserver.up.railway.app/api/sale/getAllSales"
        );
        setTransactions(response.data.sales);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchTransactions();
  }, []);
  return (
    <div className='col-xxl-8'>
      <div className='card h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>Recent Transactions</h6>
            <Link
              to='#'
              className='text-primary-600 hover-text-primary d-flex align-items-center gap-1'
            >
              View All
              <iconify-icon
                icon='solar:alt-arrow-right-linear'
                className='icon'
              />
            </Link>
          </div>
        </div>
        <div className='card-body p-24'>
          <div className='table-responsive scroll-sm'>
            <table className='table bordered-table mb-0'>
              <thead>
                <tr>
                <th scope='col'>SL</th>
                  <th scope='col'>Product ID</th>
                  <th scope='col'>Quantity</th>
                  <th scope='col'>Sales Amount</th>
                </tr>
              </thead>
              <tbody>
              {transactions.length > 0 ? (
                  transactions.slice(0, 6).map((item, index) => (
                    <tr key={index}>
                      <td>
                        <span className='text-secondary-light'>{index + 1}</span>
                      </td>
                      <td>
                        <span className='text-secondary-light'>{item.product_id}</span>
                      </td>
                      <td>
                        <span className='text-secondary-light'>{item.quantity}</span>
                      </td>
                      <td>
                        <span className='text-secondary-light'>${item.sales_amount}</span>
                      </td>
                      {/* <td>
                        <span className='text-secondary-light'>$0.00</span>
                      </td>
                      <td>
                        <span className='text-secondary-light'>${item.sales_amount}</span>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='6'>
                      <span className='text-secondary-light'>No transactions available</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
