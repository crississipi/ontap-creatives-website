"use client"

import { useClickOutside } from '@/hooks';
import React, { useMemo, useState } from 'react'
import { RiBallPenLine, RiDeleteBinLine, RiMoreFill } from 'react-icons/ri'
import OrderCard from './OrderCard';
import { OrderRecord, StatusColumn } from './types';

interface StatusCategoryProps {
    status: StatusColumn;
    orders: OrderRecord[];
    allStatuses: StatusColumn[];
    showOrderInfo: (orderInfo: boolean) => void;
    onSelectOrder: (order: OrderRecord) => void;
    onMoveOrder: (orderId: string, statusId: string) => void;
    onArchiveRequest: (order: OrderRecord) => void;
    onEditStatus: (statusId: string) => void;
    onDeleteStatus: (statusId: string) => void;
}

const StatusCategory = ({
    status,
    orders,
    allStatuses,
    showOrderInfo,
    onSelectOrder,
    onMoveOrder,
    onArchiveRequest,
    onEditStatus,
    onDeleteStatus,
}: StatusCategoryProps) => {
  const [moreOptions, showMoreOptions] = useState(false);

  const outsideOptions = useClickOutside<HTMLDivElement>(() => showMoreOptions(false), moreOptions);

  const headerCount = useMemo(() => orders.length, [orders]);

  const handleEdit = () => {
    onEditStatus(status.id);
    showMoreOptions(false);
  };

  const handleDelete = () => {
    onDeleteStatus(status.id);
    showMoreOptions(false);
  };

  return (
    <div className='min-h-full h-auto min-w-80 md:min-w-100 bg-white border border-black/10 rounded-xl flex flex-col hover:border-dark-blue hover:shadow-md ease-out duration-200 admin'>
        <div className='w-full flex items-center justify-between p-3 py-2 admin'>
            <span className='w-full font-extrabold text-sm uppercase'>{status.label}<strong className='ml-1 text-sm tracking-widest'>({headerCount})</strong></span>
            <div ref={outsideOptions} className='relative z-40'>
                <button 
                    type="button" 
                    className='p-1 text-xl rounded-full border border-transparent hover:text-violet hover:border-violet focus:bg-violet focus:text-white ease-out duration-200'
                    onClick={() => showMoreOptions(!moreOptions)}
                ><RiMoreFill /></button>
                {moreOptions && (
                    <span className='flex flex-col absolute top-full mt-1 bg-white right-1 rounded-lg border-black/20 shadow-md'>
                        <button 
                            type="button" 
                            className='px-3 py-2 flex items-center gap-2 rounded-t-lg hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 ease-out duration-200'
                            onClick={handleEdit}
                        >
                            <RiBallPenLine /> Edit
                        </button>
                        <button 
                            type="button" 
                            className='px-3 py-2 flex items-center gap-2 rounded-b-lg hover:text-rose-500 hover:bg-neutral-100 focus:text-red-500 focus:bg-neutral-200 ease-out duration-200'
                            onClick={handleDelete}
                        >
                            <RiDeleteBinLine />Delete
                        </button>
                    </span>
                )}
            </div>
        </div>
        <div className='h-full w-full flex flex-col overflow-x-hidden gap-2 px-1 pl-2 pb-3 admin'>
            {orders.length === 0 && (
                <p className='text-xs text-neutral-400 italic px-3'>No orders in this stage yet.</p>
            )}
            {orders.map((order) => (
                <OrderCard 
                    key={order.id} 
                    order={order}
                    statuses={allStatuses}
                    showOrderInfo={showOrderInfo}
                    onSelectOrder={onSelectOrder}
                    onMoveOrder={onMoveOrder}
                    onArchiveRequest={onArchiveRequest}
                />
            ))}
        </div>
    </div>
  )
}

export default StatusCategory