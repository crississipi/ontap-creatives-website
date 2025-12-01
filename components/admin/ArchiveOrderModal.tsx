"use client";

import { useClickOutside } from '@/hooks';
import { motion } from 'framer-motion';
import React from 'react';
import { OrderRecord } from './types';

interface ArchiveOrderModalProps {
    order: OrderRecord;
    onCancel: () => void;
    onConfirm: () => void;
}

const ArchiveOrderModal = ({ order, onCancel, onConfirm }: ArchiveOrderModalProps) => {
  const modalRef = useClickOutside<HTMLDivElement>(() => onCancel());
  const placedAt = (() => {
    const parsed = new Date(order.placedAt);
    if (Number.isNaN(parsed.getTime())) return order.placedAt;
    return parsed.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
  })();

  return (
    <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-5'>
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            ref={modalRef}
            className='w-full max-w-md bg-white rounded-2xl shadow-lg shadow-black/30 p-6 flex flex-col gap-4'
        >
            <h3 className='text-xl font-semibold text-dark-blue'>Archive order?</h3>
            <p className='text-sm text-neutral-600'>
                You are about to archive <strong>{order.reference}</strong> for <strong>{order.clientName}</strong>. 
                The order will be hidden from active boards but you can restore it later from your archive list.
            </p>
            <p className='text-xs text-neutral-400'>Placed on {placedAt}.</p>
            <div className='flex items-center justify-end gap-3 mt-2'>
                <button 
                    type="button" 
                    className='px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 focus:bg-neutral-200 ease-out duration-200 text-sm'
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button 
                    type="button" 
                    className='px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 focus:bg-rose-700 ease-out duration-200 text-sm'
                    onClick={onConfirm}
                >
                    Archive
                </button>
            </div>
        </motion.div>
    </div>
  )
}

export default ArchiveOrderModal

