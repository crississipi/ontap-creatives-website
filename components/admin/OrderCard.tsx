"use client"

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { RiArchive2Line } from 'react-icons/ri'
import { useClickOutside } from '@/hooks';
import { TbArrowsMoveHorizontal } from 'react-icons/tb';
import { OrderRecord, StatusColumn } from './types';

interface OrderCardProps {
    order: OrderRecord;
    statuses: StatusColumn[];
    showOrderInfo: (orderInfo: boolean) => void;
    onSelectOrder: (order: OrderRecord) => void;
    onMoveOrder: (orderId: string, statusId: string) => void;
    onArchiveRequest: (order: OrderRecord) => void;
}

const OrderCard = ({
    order,
    statuses,
    showOrderInfo,
    onSelectOrder,
    onMoveOrder,
    onArchiveRequest,
}: OrderCardProps) => {
  const [moveOptions, showMoveOptions] = useState(false);
  
  const outsideMoveOptions = useClickOutside<HTMLDivElement>(() => showMoveOptions(false), moveOptions);

  const moveTargets = useMemo(
    () => statuses.filter((status) => status.id !== order.statusId),
    [statuses, order.statusId]
  );

  const formattedDate = useMemo(() => {
    try {
        return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.placedAt));
    } catch {
        return order.placedAt;
    }
  }, [order.placedAt]);

  const formattedTotal = useMemo(() => {
    const formatter = new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formatter.format(order.total);
  }, [order.total]);
  
  return (
    <div className='relative'>
        <button 
            type="button" 
            className='w-full border border-black/10 flex flex-col p-0.5 hover:bg-light-blue focus:bg-dark-blue focus:text-white ease-out duration-200'
            onClick={() => {
                onSelectOrder(order);
                showOrderInfo(true);
            }}
        >
            <div className='w-full flex flex-col gap-1 h-full items-center justify-center py-3 bg-neutral-50'>
                <Image
                    height={2048}
                    width={2048}
                    alt={`${order.clientName} order`}
                    src={order.thumbnail || '/images/card-3/front.png'}
                    className='w-2/3 aspect-[3/2] rounded-lg overflow-hidden object-cover object-center'
                    draggable={false}
                />
            </div>
            <span className='flex items-center justify-between py-2 gap-3 pr-3 pl-1'>
                <p className='flex flex-col items-start leading-4 w-full overflow-hidden overflow-ellipsis'>
                    <strong className='text-sm'>{order.clientName}</strong>
                    <span className='text-xs font-semibold text-black/50'>{formattedDate}</span>
                </p>
                <strong className='text-xs flex font-normal items-center gap-1'>
                    ₱<span className='text-base font-extrabold'>{formattedTotal}</span>
                </strong>
            </span>
        </button>
        <div className='absolute top-2 right-2 flex flex-col items-end'>
            <span className='bg-white/20 backdrop-blur-sm flex flex-col rounded-lg absolute top-full mt-1 shadow-md border border-black/10 hover:bg-white ease-out duration-200'>
                <div className='relative w-full'>
                    <button 
                        type="button" 
                        className='p-2 w-full flex items-center rounded-t-lg gap-2 text-black/50 hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 ease-out duration-200'
                        onClick={() => showMoveOptions(!moveOptions)}
                    ><TbArrowsMoveHorizontal /></button>
                    {moveOptions && (
                        <span ref={outsideMoveOptions} className='absolute bg-white border border-black/20 shadow-md top-0 flex flex-col right-full mr-1 rounded-lg ml-1 overflow-hidden z-10'>
                            <span className='text-[11px] uppercase text-white text-nowrap font-extrabold p-1 px-2 pt-2 w-full bg-dark-blue'>Move To</span>
                            {moveTargets.map((status) => (
                                <button 
                                    key={status.id}
                                    type="button" 
                                    className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'
                                    onClick={() => {
                                        onMoveOrder(order.id, status.id);
                                        showMoveOptions(false);
                                    }}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </span>
                    )}
                </div>
                <button 
                    type="button" 
                    className='p-2 flex items-center gap-2 text-black/50 rounded-b-lg hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 ease-out duration-200'
                    onClick={() => onArchiveRequest(order)}
                >
                    <RiArchive2Line />
                </button>
            </span>
        </div>
    </div>
  )
}

export default OrderCard