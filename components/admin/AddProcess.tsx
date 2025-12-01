import { useClickOutside } from '@/hooks';
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { StatusColumn } from './types';

interface AddProcessProps { 
    showAddProcess: (showProcess: boolean) => void;
    statuses: StatusColumn[];
    mode?: 'create' | 'edit';
    initialStatus?: StatusColumn | null;
    onSubmit: (payload: { label: string; statusId?: string; afterId?: string | null; beforeId?: string | null; notifications: string[] }) => void;
}

const notificationOptions = [
    { id: 'status-change', label: 'Admin changed order status.' },
    { id: 'edit-properties', label: 'Admin edited properties.' },
    { id: 'removed-items', label: 'Admin removed item/s.' },
    { id: 'deadline', label: 'Order is nearing deadline.' },
];

const AddProcess = ({ showAddProcess, statuses, mode = 'create', initialStatus, onSubmit }: AddProcessProps) => {
  const [placeAfterOptions, showPlaceAfterOptions] = useState(false);
  const [placeBeforeOptions, showPlaceBeforeOptions] = useState(false);
  const [processName, setProcessName] = useState(initialStatus?.label ?? '');
  const [afterStatusId, setAfterStatusId] = useState<string | null>(null);
  const [beforeStatusId, setBeforeStatusId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>(notificationOptions.map((option) => option.id));

  const outsideAfterOptions = useClickOutside<HTMLDivElement>(() => showPlaceAfterOptions(false), placeAfterOptions);
  const outsideBeforeOptions = useClickOutside<HTMLDivElement>(() => showPlaceBeforeOptions(false), placeBeforeOptions);
  const outsideProcessPage = useClickOutside<HTMLDivElement>(() => showAddProcess(false));

  useEffect(() => {
    setProcessName(initialStatus?.label ?? '');
    setAfterStatusId(null);
    setBeforeStatusId(null);
  }, [initialStatus, mode]);

  const filteredStatuses = useMemo(
    () => statuses.filter((status) => status.id !== initialStatus?.id),
    [statuses, initialStatus?.id]
  );

  const selectedAfterLabel = useMemo(
    () => filteredStatuses.find((status) => status.id === afterStatusId)?.label ?? '',
    [filteredStatuses, afterStatusId]
  );

  const selectedBeforeLabel = useMemo(
    () => filteredStatuses.find((status) => status.id === beforeStatusId)?.label ?? '',
    [filteredStatuses, beforeStatusId]
  );

  const handleToggleNotification = (id: string) => {
    setNotifications((prev) => prev.includes(id) ? prev.filter((note) => note !== id) : [...prev, id]);
  };

  const handleSelectAfter = (id: string) => {
    setAfterStatusId(id);
    setBeforeStatusId(null);
    showPlaceAfterOptions(false);
  };

  const handleSelectBefore = (id: string) => {
    setBeforeStatusId(id);
    setAfterStatusId(null);
    showPlaceBeforeOptions(false);
  };

  const handleSubmit = () => {
    if (!processName.trim()) return;
    onSubmit({
        label: processName.trim(),
        statusId: initialStatus?.id,
        afterId: afterStatusId,
        beforeId: beforeStatusId,
        notifications,
    });
    showAddProcess(false);
  };
  
  return (
    <div className='fixed w-full h-full z-50 bg-black/30 top-0 left-0 flex items-center justify-center px-5'>
        <motion.div 
            initial={{scale: 0.7, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0.7, opacity: 0}}
            transition={{
                duration: 0.3,
                ease: 'easeOut'
            }}
            ref={outsideProcessPage} 
            className='w-full max-w-md h-max rounded-xl bg-white shadow-md shadow-black/20 p-5 flex flex-col gap-5'
        >
            <div className='flex items-center justify-between'>
                <h3 className='text-xl'>{mode === 'edit' ? 'Edit Process' : 'New Process'}</h3>
                <button type="button" className='text-sm underline hover:text-violet' onClick={() => showAddProcess(false)}>Close</button>
            </div>
            <span className='mt-2'>
                <label htmlFor="processName" className='text-sm'>Process Name</label>
                <input 
                    type="text" 
                    name="processName"
                    value={processName}
                    onChange={(event) => setProcessName(event.target.value)}
                    className='w-full mt-1 p-3 overflow-x-hidden text-nowrap overflow-ellipsis rounded-md border border-light-blue hover:border-blue focus:border-dark-blue ease-out duration-200'
                />
            </span>
            <div className='w-full grid grid-cols-2 gap-3 gap-y-0'>
                <span className='col-span-full font-bold text-violet'>Place Process</span>
                <span>
                    <label htmlFor="placeAfter" className='text-sm'>After</label>
                    <div className='relative w-full'>
                        <input 
                            type="text" 
                            name="placeAfter"
                            value={selectedAfterLabel}
                            readOnly
                            placeholder='Select process'
                            className='w-full p-3 mt-1 overflow-x-hidden text-nowrap overflow-ellipsis rounded-md border border-light-blue hover:border-blue focus:border-dark-blue ease-out duration-200 cursor-pointer'
                            onMouseDown={() => showPlaceAfterOptions(true)}
                        />
                        {placeAfterOptions && (
                            <span ref={outsideAfterOptions} className='w-full absolute top-full mt-1 left-0 bg-white rounded-md border border-black/20 flex flex-col overflow-hidden z-30 max-h-56 overflow-y-auto'>
                                {filteredStatuses.map((status) => (
                                    <button 
                                        key={status.id}
                                        type="button" 
                                        className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'
                                        onClick={() => handleSelectAfter(status.id)}
                                    >{status.label}</button>
                                ))}
                            </span>
                        )}
                    </div>
                </span>
                <span>
                    <label htmlFor="placeBefore" className='text-sm'>Before</label>
                    <div className='relative w-full'>
                        <input 
                            type="text" 
                            name="placeBefore"
                            value={selectedBeforeLabel}
                            readOnly
                            placeholder='Select process'
                            className='w-full p-3 mt-1 overflow-x-hidden text-nowrap overflow-ellipsis rounded-md border border-light-blue hover:border-blue focus:border-dark-blue ease-out duration-200 cursor-pointer'
                            onMouseDown={() => showPlaceBeforeOptions(true)}
                        />
                        {placeBeforeOptions && (
                            <span ref={outsideBeforeOptions} className='w-full absolute top-full mt-1 left-0 bg-white rounded-md border border-black/20 flex flex-col overflow-hidden z-30 max-h-56 overflow-y-auto'>
                                {filteredStatuses.map((status) => (
                                    <button 
                                        key={status.id}
                                        type="button" 
                                        className='px-3 py-2 text-sm text-left text-nowrap hover:text-blue hover:bg-neutral-100 focus:text-dark-blue focus:bg-neutral-200 focus:font-bold ease-out duration-200'
                                        onClick={() => handleSelectBefore(status.id)}
                                    >{status.label}</button>
                                ))}
                            </span>
                        )}
                    </div>
                </span>
            </div>
            <div className='w-full flex flex-col gap-3'>
                <h3>Notify me when</h3>
                <div className='w-full flex flex-col gap-2'>
                    {notificationOptions.map((option) => (
                        <label key={option.id} className='w-full flex gap-2 items-center text-sm'>
                            <input 
                                type="checkbox"
                                checked={notifications.includes(option.id)}
                                onChange={() => handleToggleNotification(option.id)}
                            />
                            <p>{option.label}</p>
                        </label>
                    ))}
                </div>
            </div>
            <button 
                type="button" 
                className='py-3 rounded-lg bg-blue text-white mt-4 hover:bg-dark-blue focus:bg-violet ease-out duration-200 disabled:bg-neutral-300 disabled:cursor-not-allowed'
                onClick={handleSubmit}
                disabled={!processName.trim()}
            >
                {mode === 'edit' ? 'Save Changes' : 'Add Process'}
            </button>
        </motion.div>
    </div>
  )
}

export default AddProcess