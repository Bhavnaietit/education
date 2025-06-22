import React from 'react'
import { useContext } from 'react'
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../Components/student/Loading';

const Verify = () => {
    const { navigate, getToken,backendUrl} = useContext(AppContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get('success');
    const purchaseId = searchParams.get('purchaseId');

    const verifyPayment = async (token) => {
        try {
            if (!token) {
                return null;
            }
            const response = await axios.post(
							backendUrl + "/api/user/verifyStripe",
							{ success, purchaseId },
							{ headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                navigate('/my-enrollments');
            } else {
                navigate('/failed')
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        const token = getToken();
        verifyPayment(token);
    }, [purchaseId]);
    
  return (
      <div>
        <Loading></Loading>
    </div>
  )
}

export default Verify