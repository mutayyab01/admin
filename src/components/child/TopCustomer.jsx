import {React, useEffect,useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const TopCustomer = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(
          "https://instagrocerrenderserver.up.railway.app/api/customers"
        );
        setCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };

    fetchCustomers();
  }, []);
  return (
    <div className='col-xxl-12 col-md-6'>
      <div className='card h-100'>
        <div className='card-header'>
          <div className='d-flex align-items-center flex-wrap gap-2 justify-content-between'>
            <h6 className='mb-2 fw-bold text-lg mb-0'>Top Customer</h6>
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
                  <th scope='col'>Email</th>
                  <th scope='col'>Phone</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                  <td>
                    <span className='text-secondary-light'>1</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>
                      Savannah Nguyen
                    </span>
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
                    <span className='text-secondary-light'>Annette Black</span>
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
                    <span className='text-secondary-light'>Theresa Webb</span>
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
                    <span className='text-secondary-light'>
                      Marvin McKinney
                    </span>
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
                    <span className='text-secondary-light'>
                      Brooklyn Simmons
                    </span>
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
                    <span className='text-secondary-light'>Dianne Russell</span>
                  </td>
                  <td>
                    <span className='text-secondary-light'>$80,00.00</span>
                  </td>
                </tr> */}
                {customers.length > 0 ? (
                  customers.slice(0, 6).map((customer, index) => (
                    <tr key={index}>
                      <td>
                        <span className='text-secondary-light'>{index + 1}</span>
                      </td>
                      <td>
                        <span className='text-secondary-light'>
                          {customer.first_name}
                        </span>
                      </td>
                      <td>
                        <span className='text-secondary-light'>
                          {customer.email}
                        </span>
                      </td>
                      <td>
                        <span className='text-secondary-light'>
                          {customer.phone_number}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='4'>
                      <span className='text-secondary-light'>No data available</span>
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

export default TopCustomer;
