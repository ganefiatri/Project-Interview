import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react'
import Layout from '@/components/Layout';
import { getError } from '@/utils/error';

function reducer(state:any, action:any){
    switch (action.type) {
         case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''};
         case 'FETCH_SUCCESS':
            return {...state, loading: false, orders: action.payload, error: ''};
         case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload};
              default: 
              state;   
    }
}

const AdminOrderScreen = () => {
    const[{ loading, error, orders }, dispatch] = useReducer(reducer,{
        loading:true,
        orders:[],
        error: '',
    });


    useEffect(()=>{
        const fetchData = async () => {
            try {
                dispatch({type: 'FETCH_REQUEST'})
                const { data } = await axios.get(`/api/admin/orders`)
                dispatch({type: 'FETCH_SUCCESS', payload: data})
              }   catch(err){
                dispatch({type: 'FECTH_FAIL', payload: getError(err) });
              }
          };
        fetchData();
        },[])

console.log(orders)

  return (
  <Layout title='Painel Admin'>
    
    <div className='grid md:grid-cols-4 md:gap-5'>
    <div>
                <ul>
                    <li>
                        <Link className='text-indigo' href="/admin/dashboard">
                            <p>Admin Panel</p>
                        </Link>
                    </li>
                    <li>
                        <Link className='text-indigo' href='/admin/orders'>
                            <p className='font-bold text-xl'>Order</p>
                         </Link>
                    </li>
                    <li>
                        <Link className='text-indigo' href='/admin/products'>Product</Link>
                    </li>
                    <li>
                        <Link className='text-indigo' href='/admin/users'>User</Link>
                    </li>
                    
                </ul>
            </div>
          <div className='overflow-x-auto md:col-span-3 '>
                <h1 className='mb-4 text-3xl font-semibold'>Order</h1>
                <div className='bg-white rounded-md bg-opacity-80 m-2 p-2'>
                {loading ? (
                 <div>Loading...</div>
                 ): error ? (
                 <div className='alert-error'>{error}</div>
                 ):(
                 <div className='overflow-x-auto'>
                    <table className='min-w-full'>
                        <thead className='border-b'>
                            <tr>
                                <th className='px-5 text-left'>ID</th>
                                <th className='p-5 text-left'>USERS</th>
                                <th className='p-5 text-left'>DATA</th>
                                <th className='p-5 text-left'>TOTAL</th>
                                <th className='p-5 text-left'>PAYMENT</th>
                                <th className='p-5 text-left'>DELIVERY</th>
                                <th className='p-5 text-left'>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {orders.map((order:any)=> (
                                <tr key={order._id} className='border-b'>
                                    <td className='p-5'>{order._id.substring(20,24)}</td>
                                    <td className='p-5'>
                                        {order.user ? order.user.name : 'User Not Found '}
                                    </td>
                                    <td className='p-5'>
                                        {order.createdAt.substring(0, 10)}
                                    </td>
                                    <td className='p-5'>Rp{order.totalPrice}K</td>
                                    <td className='p-5'>{order.isPaid ? `${order.paidAt.substring(0,10)}`: 'No Payment'}</td>
                                    <td className='p-5'>{order.isDeliveredAt ? `${order.isDeliveredAt.substring(0,10)}`:'Do Not Deliver' }</td>
                                    <td className='p-5'><Link href={`/order/${order._id}`} passHref><p className='text-indigo '>Detail</p></Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
                 )}
          </div>
          </div>
    </div>
  </Layout>
  )
}
AdminOrderScreen.auth = { adminOnly: true }
export default AdminOrderScreen



