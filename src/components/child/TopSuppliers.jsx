import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TopSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(
          "https://instagrocerrenderserver.up.railway.app/api/merchants"
        );
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  return (
    <div className='col-xxl-4 col-md-6'>
      <div className='card h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>Top Suppliers</h6>
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
                  <th scope='col'>Name </th>
                  <th scope='col'>Phone</th>
                  <th scope='col'>Address</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                  <td>
                    <span className='text-secondary-light'>1</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Esther Howard</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$30,00.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>2</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Wade Warren</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$40,00.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>3</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Jenny Wilson</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$50,00.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>4</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Kristin Watson</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$60,00.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>5</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>Eleanor Pena</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$70,00.00</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='text-secondary-light'>6</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>
                      Darlene Robertson
                    </span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$80,00.00</span>
                  </td>
                </tr> */}
                 {suppliers.length > 0 ? (
                  suppliers.slice(0, 6).map((supplier, index) => (
                    <tr key={index}>
                      <td>
                        <span className='text-secondary-light'>{index + 1}</span>
                      </td>
                      <td>
                        <span className='text-secondary-light'>{supplier.merchant_name}</span>
                      </td>
                      <td>
                        <span className='text-secondary-light'>{supplier.phone_number}</span>
                      </td>
                      <td>
                        <span className='text-secondary-light'>{supplier.address}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='4'>
                      <span className='text-secondary-light'>No supplier data available</span>
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

export default TopSuppliers;
