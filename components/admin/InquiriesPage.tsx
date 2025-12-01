"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RiAddLine, RiExportFill, RiSearchLine } from 'react-icons/ri';
import StatusCategory from './StatusCategory';
import { AnimatePresence } from 'framer-motion';
import AddProcess from './AddProcess';
import EditOrder from './EditOrder';
import ArchiveOrderModal from '@/components/admin/ArchiveOrderModal';

interface StatusColumn {
  id: string;
  label: string;
  orderIndex?: number;
}

interface OrderRecord {
  id: string;
  dbOrderId?: number;
  reference: string;
  clientName: string;
  total: number;
  thumbnail: string;
  placedAt: string;
  statusId: string;
  archived?: boolean;
}

interface VisitorProps {
    changePage: (newPage: number) => void;
}

const VisitorsPage = ({ changePage }: VisitorProps) => {
  const [processModal, setProcessModal] = useState<{ open: boolean; mode: 'create' | 'edit'; status: StatusColumn | null }> ({
    open: false,
    mode: 'create',
    status: null,
  });
  const [orderInfo, showOrderInfo] = useState(false);
  const [processes, setProcesses] = useState<any[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [rawOrders, setRawOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<OrderRecord | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [processesLoading, setProcessesLoading] = useState(false);

  // Convert processes to StatusColumn format
  const statuses = useMemo((): StatusColumn[] => 
    processes.map(process => ({
      id: String(process.processID),
      label: process.processName,
      orderIndex: process.orderIndex
    })), [processes]);

  // Fetch processes from API - ONLY real data
  const fetchProcesses = useCallback(async () => {
    setProcessesLoading(true);
    try {
      const response = await fetch('https://ontap-creatives-website.vercel.app/api/processes');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProcesses(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching processes:', error);
    } finally {
      setProcessesLoading(false);
    }
  }, []);

  // Load processes on component mount - ONLY real data
  useEffect(() => {
    fetchProcesses();
  }, [fetchProcesses]);

  const resolveStatusId = useCallback((processID?: number | null, statusLabel?: string | null) => {
    // If processID is available, use it
    if (processID !== undefined && processID !== null) {
      return String(processID);
    }
    
    // Fallback to status label matching
    if (!statuses.length) return '';
    
    const normalized = statusLabel?.toLowerCase().trim() || '';
    if (normalized === 'order placed' || normalized === 'newly ordered') {
      return statuses[0]?.id ?? '';
    }

    const matchByLabel = statuses.find(
      (status) => status.label.toLowerCase() === normalized
    );
    if (matchByLabel) return matchByLabel.id;

    return statuses[0]?.id ?? '';
  }, [statuses]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchOrders = async () => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const response = await fetch('https://ontap-creatives-website.vercel.app/api/orders/get', { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Failed to fetch orders.');
        }
        const payload = await response.json();
        if (!isMounted) return;

        if (!payload?.success || !Array.isArray(payload?.data)) {
          throw new Error('Unexpected response from orders endpoint.');
        }

        setRawOrders(payload.data);

        const transformed: OrderRecord[] = payload.data.map((order: any) => {
          const thumbnail =
            order.product?.imgUrl ||
            order.product?.frontUrl ||
            '/images/card-3/front.png';

          return {
            id: String(order.orderID ?? order.transactionID ?? crypto.randomUUID()),
            dbOrderId: typeof order.orderID === 'number' ? order.orderID : undefined,
            reference: order.transactionID ?? `ORD-${order.orderID ?? 'N/A'} `,
            clientName: order.client?.clientName ?? 'Unknown Client',
            total: Number(order.subtotal ?? 0),
            thumbnail,
            placedAt: order.dateOrdered ?? new Date().toISOString(),
            statusId: resolveStatusId(order.processID, order.status),
          };
        });

        setOrders(transformed);
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
        setOrdersError(
          (error as Error)?.message || 'Unable to load orders right now.'
        );
      }
      finally {
        if (isMounted) {
          setOrdersLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [resolveStatusId]);

  const statusLabelMap = useMemo(() => (
    statuses.reduce<Record<string, string>>((acc, status) => {
      acc[status.id] = status.label;
      return acc;
    }, {})
  ), [statuses]);

  const relatedSearchSeeds = useMemo(() => {
    const seeds = new Set<string>();
    orders.forEach((order) => {
      seeds.add(order.clientName);
      seeds.add(order.reference);
    });
    statuses.forEach((status) => seeds.add(status.label));
    return Array.from(seeds).filter(Boolean);
  }, [orders, statuses]);

  const filteredSuggestions = useMemo(() => {
    if (!relatedSearchSeeds.length) return [];
    const query = searchQuery.trim().toLowerCase();
    const baseList = query 
      ? relatedSearchSeeds.filter((seed) => seed.toLowerCase().includes(query))
      : relatedSearchSeeds;
    return baseList.slice(0, 6);
  }, [relatedSearchSeeds, searchQuery]);

  const visibleOrders = useMemo(() => (
    orders.filter((order) => {
      if (order.archived) return false;
      if (!searchQuery.trim()) return true;
      const haystack = [
        order.clientName,
        order.reference,
        statusLabelMap[order.statusId] ?? '',
      ].join(' ').toLowerCase();
      return haystack.includes(searchQuery.trim().toLowerCase());
    })
  ), [orders, searchQuery, statusLabelMap]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleExport = () => {
    if (!visibleOrders.length) return;
    const csvRows = [
      ['Reference', 'Client', 'Status', 'Total', 'Placed At'].join(','),
      ...visibleOrders.map((order) => [
        order.reference,
        order.clientName,
        statusLabelMap[order.statusId] ?? '',
        order.total,
        order.placedAt,
      ].join(',')),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `orders-${Date.now()}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleMoveOrder = async (orderId: string, statusId: string) => {
    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder) return;

    const previousStatusId = currentOrder.statusId;
    const dbOrderId = currentOrder.dbOrderId ?? Number(orderId);

    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, statusId } : order))
    );

    if (!dbOrderId || Number.isNaN(dbOrderId)) {
      console.warn('Cannot update order without a valid database ID.');
      return;
    }

    try {
      const response = await fetch('https://ontap-creatives-website.vercel.app/api/orders/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderID: dbOrderId, 
          processID: statusId ? parseInt(statusId) : null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order process.');
      }
    } catch (error) {
      console.error(error);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, statusId: previousStatusId } : order
        )
      );
      alert('Unable to update order process at the moment. Please try again.');
    }
  };

  const handleArchiveConfirm = () => {
    if (!archiveTarget) return;
    setOrders((prev) => prev.map((order) => (
      order.id === archiveTarget.id ? { ...order, archived: true } : order
    )));
    setArchiveTarget(null);
  };

  const closeArchiveModal = () => setArchiveTarget(null);

  const handleDeleteStatus = async (statusId: string) => {
    if (!window.confirm('Delete this process? Orders will return to the first column.')) return;
    
    try {
      const response = await fetch(`https://ontap-creatives-website.vercel.app/api/processes/${statusId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state
          const remaining = processes.filter((process) => String(process.processID) !== statusId);
          setProcesses(remaining);
          
          if (remaining.length > 0) {
            const fallback = remaining[0];
            setOrders((prev) => prev.map((order) => (
              order.statusId === statusId ? { ...order, statusId: String(fallback.processID) } : order
            )));
          }
        }
      }
    } catch (error) {
      console.error('Error deleting process:', error);
      alert('Failed to delete process. Please try again.');
    }
  };

  const handleSelectOrder = (orderRecord: OrderRecord) => {
    const fullOrder = rawOrders.find(o => o.orderID === orderRecord.dbOrderId);
    setSelectedOrder(fullOrder || null);
  };

  const handleCloseOrderInfo = (open: boolean) => {
    showOrderInfo(open);
    if (!open) {
      setSelectedOrder(null);
    }
  };

  const openCreateProcess = () => {
    setProcessModal({ open: true, mode: 'create', status: null });
  };

  const openEditProcess = (statusId: string) => {
    const target = statuses.find((status) => status.id === statusId) ?? null;
    if (!target) return;
    setProcessModal({ open: true, mode: 'edit', status: target });
  };

  const closeProcessModal = () => {
    setProcessModal((prev) => ({ ...prev, open: false, status: null }));
  };

  const handleProcessSubmit = async ({ 
    label, 
    statusId, 
    afterId, 
    beforeId, 
    notifications 
  }: { 
    label: string; 
    statusId?: string; 
    afterId?: string | null; 
    beforeId?: string | null; 
    notifications: string[]; 
  }) => {
    try {
      if (statusId) {
        // Update existing process
        const response = await fetch('https://ontap-creatives-website.vercel.app/api/processes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            processID: parseInt(statusId),
            processName: label
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProcesses(prev => 
              prev.map(p => 
                p.processID === parseInt(statusId) 
                  ? { ...p, processName: label }
                  : p
              )
            );
            closeProcessModal();
          }
        }
      } else {
        // Create new process
        const response = await fetch('https://ontap-creatives-website.vercel.app/api/processes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            processName: label
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProcesses(prev => [...prev, data.data]);
            closeProcessModal();
          }
        }
      }
    } catch (error) {
      console.error('Error saving process:', error);
      alert('Failed to save process. Please try again.');
    }
  };

  const handleArchiveRequest = (order: OrderRecord) => {
    setArchiveTarget(order);
  };

  // Sort statuses by orderIndex
  const sortedStatuses = useMemo(() => 
    [...statuses].sort((a, b) => {
      const aIndex = a.orderIndex || 0;
      const bIndex = b.orderIndex || 0;
      return aIndex - bIndex;
    }),
    [statuses]
  );

  return (
    <div className='w-full h-full bg-neutral-100 px-5 py-10 gap-3 pb-5 flex flex-col relative md:pl-10 2xl:pl-5'>
        <div className='w-full flex items-center justify-between lg:pr-5'>
            <h1 className='text-2xl font-semibold'>Orders</h1>
            <div className='flex gap-3 text-sm md:text-base relative'>
                <div className='flex gap-2 px-3 border border-violet items-center rounded-md w-60 md:w-80 text-violet relative bg-white'>
                    <RiSearchLine className='text-xl'/>
                    <input 
                        type="text" 
                        placeholder='Search by client, reference, or status...' 
                        className='outline-none w-full h-full text-black placeholder:text-violet'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    />
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className='absolute top-full left-0 w-full bg-white border border-violet/40 rounded-lg shadow-md mt-1 z-30 overflow-hidden'>
                            <span className='text-xs uppercase text-neutral-500 px-3 py-2 font-bold bg-neutral-50 border-b border-neutral-200'>Related searches</span>
                            <div className='flex flex-col'>
                                {filteredSuggestions.map((suggestion) => (
                                    <button 
                                        key={suggestion}
                                        type="button"
                                        className='text-left px-3 py-2 text-sm hover:bg-light-blue focus:bg-violet/10 focus:text-dark-blue ease-out duration-150'
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            setSearchQuery(suggestion);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button 
                    type="button" 
                    className='flex items-center gap-3 rounded-lg bg-blue text-white px-4 py-3 text-xl hover:bg-violet focus:bg-dark-blue ease-out duration-200'
                    onClick={handleExport}
                    disabled={!visibleOrders.length}
                >
                    <RiExportFill />
                </button>
            </div>
        </div>
        <span className='w-full flex items-center justify-end lg:pr-5 mt-2'>
            <button 
                type="button" 
                className='flex items-center gap-1 px-3 py-2 rounded-md bg-blue text-white hover:bg-violet focus:bg-dark-blue hover:text-white focus:text-white ease-out duration-200'
                onClick={openCreateProcess}
            ><RiAddLine className='text-xl'/>New Process</button>
        </span>
        {ordersLoading && (
          <p className='text-xs text-neutral-500 italic lg:pr-5'>Loading latest orders...</p>
        )}
        {ordersError && !ordersLoading && (
          <p className='text-xs text-rose-500 lg:pr-5'>{ordersError}</p>
        )}
        {processesLoading && (
          <p className='text-xs text-neutral-500 italic lg:pr-5'>Loading processes...</p>
        )}
        <div className='max-w-[93vw] lg:max-w-[87vw] w-full h-full flex overflow-hidden'>
            <div className='min-w-full w-auto h-full flex flex-nowrap gap-3 overflow-y-hidden horizontal-scroll pb-3 admin'>
                {sortedStatuses.map((status) => (
                    <StatusCategory 
                        key={status.id} 
                        status={status}
                        orders={visibleOrders.filter((order) => order.statusId === status.id)}
                        allStatuses={sortedStatuses}
                        showOrderInfo={handleCloseOrderInfo}
                        onSelectOrder={handleSelectOrder}
                        onMoveOrder={handleMoveOrder}
                        onArchiveRequest={handleArchiveRequest}
                        onEditStatus={openEditProcess}
                        onDeleteStatus={handleDeleteStatus}
                    />
                ))}
            </div>
        </div>
        <AnimatePresence mode="wait">
            {processModal.open && (
                <AddProcess 
                    key={`processModal`} 
                    showAddProcess={(show) => {
                        if (!show) closeProcessModal();
                    }} 
                    statuses={sortedStatuses}
                    mode={processModal.mode}
                    initialStatus={processModal.status}
                    onSubmit={handleProcessSubmit}
                />
            )}
            {orderInfo && (
                <EditOrder key={`editOrder`} showOrderInfo={handleCloseOrderInfo} order={selectedOrder} />
            )}
        </AnimatePresence>
        {archiveTarget && (
            <ArchiveOrderModal 
                order={archiveTarget} 
                onCancel={closeArchiveModal} 
                onConfirm={handleArchiveConfirm} 
            />
        )}
    </div>
  )
}

export default VisitorsPage;