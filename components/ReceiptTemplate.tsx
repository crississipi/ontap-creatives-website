import React, {JSX} from 'react'
import Image from 'next/image';
import { RiTruckLine, RiStore3Fill } from 'react-icons/ri';
import { TbTruckDelivery } from 'react-icons/tb';

interface ReceiptProps {
  orderID: string;
  customerName: string;
  companyName: string;
  contactNumber: string;
  email: string;
  deliveryAddress: string;
  items: {
    imgUrl: string;
    frontImg: string;
    name: string;
    qty: number;
    price: number;
    subtotal: number;
    logo: string;
  }[];
  shippingMethod: string;
  shippingFee: number;
  paymentMethod: string;
  discount: number;
  subtotal: number;
  total: number;
  orderDate: string;
  trackingEvents?: Array<{
    timestamp: string;
    title: string;
    description?: string;
  }>;
}

type PaymentInfo = {
  title: string;
  image: JSX.Element;
  label: string;
  digit: number;
};

const payment: Record<string, PaymentInfo> = {
  "cod": 
    { title: '', 
      image: <></>, 
      label: '', 
      digit: 0
    },
  "credit": 
    { title: 'credit/debit', 
      image: 
        <Image 
          height={2048}
          width={2048}
          src='https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg' 
          alt="PayPal Logo" 
          style={{ height: '28px', width: 'auto', objectFit: 'cover' }}
        />, 
      label: 'Card Number', 
      digit: 19 
    },
  "ewallet":
    { title: 'e-wallet',
      image: 
        <Image 
          height={2048}
          width={2048}
          src='/icons/gcash-logo.png' 
          alt="E-wallet Logo" 
          style={{ width: '64px', objectFit: 'contain', position: 'absolute', right: '12px', marginTop: '5px !important' }}
        />,
      label: 'Number',
      digit: 11
    },
  "bank": 
    { title: 'bank transfer',
      image: 
        <Image 
          height={2048}
          width={2048}
          src='/icons/bdo.png' 
          alt="Bank Logo" 
          style={{ height: '12px', width: 'auto', objectFit: 'cover' }}
        />,
      label: 'Account Number',
      digit: 10
    }
}

const ReceiptTemplate = ({ 
  orderID, 
  customerName, 
  companyName, 
  contactNumber, 
  email, 
  deliveryAddress, 
  items, 
  shippingMethod, 
  shippingFee, 
  paymentMethod, 
  discount, 
  subtotal, 
  total, 
  orderDate,
  trackingEvents = []
}: ReceiptProps) => {
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      fullDate: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      })
    };
  };

  const formattedDate = formatDate(orderDate);

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculate discount percentage for display
  const discountPercentage = discount > 0 ? Math.round((discount / subtotal) * 100) : 0;

  // Generate default tracking events if none provided
  const defaultTrackingEvents = trackingEvents.length > 0 ? trackingEvents : [
    {
      timestamp: orderDate,
      title: 'Order Placed Successfully',
      description: 'Your order has been received and is being processed'
    },
    {
      timestamp: new Date(new Date(orderDate).getTime() + 30 * 60 * 1000).toISOString(), // 30 minutes later
      title: 'Payment Confirmed',
      description: 'Your payment has been confirmed'
    }
  ];

  return (
    <div 
      style={{
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        userSelect: 'none',
        width: '100%',
        height: 'max-content',
        position: 'relative',
        backgroundColor: '#f9fafb'
      }}
    >
      <div 
        style={{ 
          height: 'max-content', 
          width: '100%', 
          top: 0, 
          left: 0, 
          backgroundColor: 'white', 
          display: 'flex', 
          flexDirection: 'column',
          lineHeight: '1.2',
          margin: 0,
          padding: 0
        }}
      >
        <div style={{ 
          height: 'max-content', 
          width: '100%', 
          backgroundColor: 'white', 
          display: 'flex', 
          justifyContent: 'center',
          margin: 0,
          padding: 0
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 0,
            margin: 0,
            padding: 0
          }}>
            {/* Main Receipt Container */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column', 
              width: '100%', 
              maxWidth: '100%', 
              border: '1px solid #d1d5db',
              margin: 0,
              padding: 0
            }}>
              {/* Header Section */}
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: '100%', 
                gap: '12px', 
                padding: '8px',
                margin: 0,
              }}>
                <a href="https://ontap.ph" style={{ margin: 0, padding: 0 }}>
                  <Image
                    height={2048}
                    width={2048}
                    alt='website logo'
                    src='/images/ontap-logo.png'
                    style={{ 
                      height: '50px',
                      width: '60px',
                      objectFit: 'cover', 
                      objectPosition: 'center',
                      margin: 0
                    }}
                    draggable={false}
                  />
                </a>
                <span style={{ 
                  marginLeft: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-end', 
                  fontSize: '10px',
                  fontWeight: 'bold', 
                  color: '#1e40af',
                  lineHeight: '1.1',
                  marginTop: '-18px !important',
                  padding: 0,
                }}>
                  <a href="mailto:ontapcreatives@gmail.com" style={{ margin: 0, padding: 0 }}>ontapcreatives@gmail.com</a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("BURNBOX PRINTING BFRV BRANCH")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      justifyContent: 'flex-end', 
                      gap: '2px', 
                      width: '66%', 
                      textAlign: 'right', 
                      lineHeight: '1.1',
                      margin: 0,
                      padding: 0
                    }}
                  >
                    17 Vatican City Dr, Las Piñas, 1740 Metro Manila
                  </a>
                  <a href="https://ontap.ph" style={{ textTransform: 'uppercase', margin: 0, padding: 0 }}>On Tap Creatives</a>
                </span>
              </span>

              {/* Phone Numbers */}
              <span style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-around', 
                padding: '6px 0px 10px 0px',
                borderBottom: '1px solid #d1d5db', 
                color: '#1e40af',
                fontSize: '10px',
                marginTop: '-10px !important'
              }}>
                <a href="tel:+639177008364" style={{ fontWeight: 'bold', margin: 0, padding: 0 }}>+63 9177008364</a>•
                <a href="tel:+639764183188" style={{ fontWeight: 'bold', margin: 0, padding: 0 }}>+63 9764183188</a>•
                <a href="tel:+639764183189" style={{ fontWeight: 'bold', margin: 0, padding: 0 }}>+63 9764183189</a>
              </span>

              {/* Order Details */}
              <div style={{ 
                width: '100%', 
                padding: '16px 8px 8px 8px',
                gap: '12px',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                borderBottom: '1px solid #d1d5db',
                margin: 0
              }}>
                <span style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginTop: '-10px !important',
                  padding: 0
                }}>
                  <h2 style={{ 
                    fontSize: '14px',
                    fontWeight: 'bold',
                    margin: 0,
                    padding: 0
                  }}>Order #{orderID}</h2>
                  <span style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end', 
                    fontSize: '8px',
                    color: '#6b7280', 
                    fontWeight: '600', 
                    textTransform: 'uppercase',
                    lineHeight: '1.1',
                    margin: 0,
                    padding: 0
                  }}>
                    <strong style={{ margin: 0, padding: 0 }}>{formattedDate.fullDate}</strong>
                    <strong style={{ margin: 0, padding: 0 }}>{formattedDate.weekday} • {formattedDate.time}</strong>
                  </span>
                </span>
                <div style={{ 
                  width: '100%', 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '6px',
                  columnGap: '6px',
                  margin: 0,
                  padding: 0
                }}>
                  <span style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    width: '100%',
                    margin: 0,
                    padding: 0
                  }}>
                    <p style={{ 
                      fontSize: '8px',
                      textTransform: 'uppercase', 
                      fontWeight: 'bold', 
                      color: '#6b7280',
                      margin: '0 0 2px 0',
                      paddingBottom: 5
                    }}>Client Name</p>
                    <span style={{ 
                      padding: '0px 8px 6px 8px',
                      backgroundColor: '#f9fafb', 
                      fontWeight: 'bold',
                      fontSize: '10px',
                      margin: 0
                    }}>{customerName}</span>
                  </span>
                  <span style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    width: '100%',
                    margin: 0,
                    padding: 0
                  }}>
                    <p style={{ 
                      fontSize: '8px',
                      textTransform: 'uppercase', 
                      fontWeight: 'bold', 
                      color: '#6b7280',
                      margin: '0 0 2px 0',
                      paddingBottom: 5
                    }}>Company</p>
                    <span style={{ 
                      padding: '0px 8px 6px 8px',
                      backgroundColor: '#f9fafb', 
                      fontWeight: 'bold',
                      fontSize: '10px',
                      margin: 0
                    }}>{companyName || 'N/A'}</span>
                  </span>
                  <span style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    width: '100%',
                    margin: 0,
                    padding: 0
                  }}>
                    <p style={{ 
                      fontSize: '8px',
                      textTransform: 'uppercase', 
                      fontWeight: 'bold', 
                      color: '#6b7280',
                      margin: '0 0 2px 0',
                      paddingBottom: 5
                    }}>Contact number</p>
                    <span style={{ 
                      padding: '0px 8px 6px 8px',
                      backgroundColor: '#f9fafb', 
                      fontWeight: 'bold',
                      fontSize: '10px',
                      margin: 0
                    }}>{contactNumber}</span>
                  </span>
                  <span style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    width: '100%',
                    margin: 0,
                    padding: 0
                  }}>
                    <p style={{ 
                      fontSize: '8px',
                      textTransform: 'uppercase', 
                      fontWeight: 'bold', 
                      color: '#6b7280',
                      margin: '0 0 2px 0',
                      paddingBottom: 5
                    }}>Email Address</p>
                    <span style={{ 
                      padding: '0px 8px 6px 8px',
                      backgroundColor: '#f9fafb', 
                      fontWeight: 'bold',
                      fontSize: '10px',
                      margin: 0
                    }}>{email}</span>
                  </span>
                  <span style={{ 
                    gridColumn: '1 / -1', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    width: '100%',
                    margin: 0,
                    padding: 0
                  }}>
                    <p style={{ 
                      fontSize: '8px',
                      textTransform: 'uppercase', 
                      fontWeight: 'bold', 
                      color: '#6b7280',
                      margin: '0 0 2px 0',
                      paddingBottom: 10
                    }}>{shippingMethod === 'delivery' ? 'Delivery Address' : 'Pickup Location'}</p>
                    <span style={{ 
                      padding: '0px 8px 6px 8px',
                      borderRadius: '4px', 
                      backgroundColor: '#f9fafb', 
                      fontWeight: 'bold',
                      fontSize: '10px',
                      margin: 0
                    }}>{deliveryAddress}</span>
                  </span>
                </div>
              </div>

              {/* Order Tracking Section */}
              <div style={{ 
                height: 'max-content', 
                padding: '8px',
                gap: '8px',
                display: 'flex', 
                flexDirection: 'column',
                margin: 0
              }}>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  marginTop: '-10px !important',
                  padding: 0
                }}>Order Tracking</span>
                <div style={{ 
                  height: '100%', 
                  width: '100%', 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  paddingRight: '4px',
                  margin: 0
                }}>
                  {defaultTrackingEvents.slice(0, 4).map((event, index) => (
                    <span key={index} style={{ 
                      height: 'max-content', 
                      width: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      paddingLeft: '16px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      position: 'relative',
                      margin: 0
                    }}>
                      <div style={{ 
                        height: '8px',
                        width: '8px',
                        backgroundColor: '#2563eb', 
                        borderRadius: index === 0 ? '1px' : '50%', 
                        position: 'absolute', 
                        zIndex: 20, 
                        left: 0, 
                        top: index === 0 ? '2px' : '6px'
                      }}></div>
                      <div style={{ 
                        height: '100%', 
                        width: '1px',
                        backgroundColor: '#d1d5db', 
                        position: 'absolute', 
                        left: '3px',
                        top: index === 0 ? '10px' : '14px'
                      }}></div>
                      <strong style={{ 
                        textTransform: 'uppercase', 
                        fontWeight: '800', 
                        fontSize: '8px',
                        color: '#6b7280', 
                        margin: '0 0 4px 0',
                        padding: 0
                      }}>{index === 0 ? 'today' : 'next steps'}</strong>
                      <span style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '2px',
                        margin: 0,
                        padding: 0
                      }}>
                        <strong style={{ 
                          fontSize: '10px',
                          fontWeight: '800', 
                          color: '#1e40af',
                          lineHeight: '1.1',
                          margin: 0,
                          padding: 0
                        }}>
                          {formatDate(event.timestamp).time} <span style={{ color: 'black', fontWeight: 'normal' }}> ● {event.title}</span>
                        </strong>
                        {event.description && (
                          <p style={{ 
                            fontSize: '8px',
                            color: '#6b7280',
                            margin: 0,
                            padding: 0,
                            lineHeight: '1.2'
                          }}>{event.description}</p>
                        )}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Items and Summary Section */}
            <div style={{ 
              width: '100%', 
              maxWidth: '100%', 
              height: 'max-content', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 0,
              margin: 0,
              padding: 0
            }}>
              {/* Items Section */}
              <div style={{ 
                height: 'max-content', 
                width: '100%', 
                border: '1px solid #d1d5db', 
                display: 'flex', 
                flexDirection: 'column', 
                padding: '12px',
                margin: 0
              }}>
                <h2 style={{ 
                  fontSize: '14px', 
                  color: '#1e40af', 
                  fontWeight: 'bold',
                  margin: '-10px 0px 16px 0px',
                  padding: 0
                }}>Items</h2>
                <div style={{ 
                  height: '100%', 
                  width: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  overflowX: 'hidden',
                  margin: 0,
                  padding: 0
                }}>
                  {items.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      width: '100%', 
                      padding: '8px',
                      paddingTop: 0,
                      alignItems: 'center', 
                      gap: '8px',
                      borderBottom: '1px solid #f3f4f6',
                      marginBottom: 5
                    }}>
                      <img
                        src={item.frontImg || item.imgUrl}
                        alt='Item image'
                        style={{ 
                          height: '40px',
                          aspectRatio: '1/1',  
                          backgroundColor: '#dbeafe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '8px',
                          color: '#6b7280'
                        }}
                      />
                      <span style={{ 
                        width: '50%', 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        margin: 0,
                        padding: 0
                      }}>
                        <h3 style={{ 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap', 
                          width: '100%', 
                          overflow: 'hidden',
                          fontSize: '10px',
                          margin: 0,
                          paddingBottom: 10
                        }}>{item.name}</h3>
                        <p style={{ 
                          fontSize: '8px',
                          fontWeight: 'bold', 
                          textTransform: 'uppercase', 
                          margin: '2px 0 0 0',
                          padding: 0
                        }}>Logo: <strong style={{ color: '#1e40af', fontWeight: 'bold' }}>{item.logo}</strong></p>
                      </span>
                      <span style={{ 
                        width: '50%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'flex-end', 
                        justifyContent: 'space-around',
                        margin: 0,
                        padding: 0
                      }}>
                        <p style={{ 
                          fontSize: '8px',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '2px', 
                          color: '#6b7280',
                          margin: 0,
                          padding: 0
                        }}>₱ <strong style={{ fontSize: '9px', marginTop: '-3px' }}>{formatCurrency(item.price)}</strong></p>
                        <strong style={{ color: '#6b7280', fontSize: '10px', margin: 0, padding: 0 }}>{item.qty}</strong>
                        <p style={{ 
                          fontSize: '8px',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '2px', 
                          color: '#1e40af',
                          margin: 0,
                          padding: 0
                        }}>₱ <strong style={{ fontSize: '11px', marginTop: '-3px' }}>{formatCurrency(item.subtotal)}</strong></p>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment */}
              <div style={{ 
                width: '100%', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                alignItems: 'flex-start', 
                gap: '8px',
                margin: 0,
                padding: 0
              }}>
                {/* Shipping Method */}
                <div style={{ 
                  gridColumn: 'span 1', 
                  height: '100%', 
                  width: '100%', 
                  border: '1px solid #d1d5db', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  padding: '8px',
                  paddingTop: 0,
                  justifyContent: 'space-between',
                  margin: 0
                }}>
                  <span style={{ 
                    fontSize: '11px',
                    fontWeight: 'bold', 
                    paddingLeft: '8px',
                    margin: '0 0 12px 0',
                    padding: 0
                  }}>Shipping Method</span>
                  <span style={{ 
                    width: '100%', 
                    paddingTop: '4px',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    margin: 0,
                    padding: 0
                  }}>
                    {shippingMethod === 'delivery' ? (
                      <>
                        <span style={{ 
                          height: '24px',
                          aspectRatio: '1/1', 
                          borderRadius: '6px', 
                          backgroundColor: '#1e40af', 
                          color: 'white', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          display: 'flex', 
                          fontSize: '14px',
                          margin: 0
                        }}>
                          <RiTruckLine />
                        </span>
                        <span style={{ 
                          width: '100%', 
                          fontSize: '10px',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          marginTop: '-5px',
                          padding: 0
                        }}>
                          <strong style={{ fontWeight: '800', color: '#374151' }}>Door-to-door Delivery</strong>
                          <span style={{ 
                            fontSize: '8px',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '2px', 
                            marginLeft: 'auto'
                          }}>₱<strong style={{ fontSize: '11px', fontWeight: '800' }}>{formatCurrency(shippingFee)}</strong></span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ 
                          height: '24px',
                          aspectRatio: '1/1', 
                          borderRadius: '6px', 
                          backgroundColor: '#1e40af', 
                          color: 'white', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          display: 'flex', 
                          fontSize: '14px',
                          margin: 0
                        }}>
                          <RiStore3Fill />
                        </span>
                        <span style={{ 
                          width: '100%', 
                          fontSize: '10px',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          marginTop: '-5px',
                          padding: 0
                        }}>
                          <strong style={{ fontWeight: '800', color: '#374151' }}>Pick up at Store</strong>
                          <span style={{ 
                            fontSize: '8px',
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '2px', 
                            marginLeft: 'auto'
                          }}>₱<strong style={{ fontSize: '11px', fontWeight: '800' }}>0.00</strong></span>
                        </span>
                      </>
                    )}
                  </span>
                </div>

                {/* Payment Method */}
                <div style={{ 
                  gridColumn: 'span 1', 
                  width: '100%', 
                  border: '1px solid #d1d5db', 
                  display: 'flex', 
                  flexDirection: 'column',
                  margin: 0
                }}>
                  <span style={{ 
                    display: 'flex', 
                    width: '100%', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    position: 'relative', 
                    padding: '8px',
                    paddingTop: 0,
                    margin: 0
                  }}>
                    <span style={{ 
                      fontSize: '11px',
                      fontWeight: 'bold',
                      margin: 0,
                      paddingBottom: 5
                    }}>Mode of Payment</span>
                    {payment[paymentMethod]?.image || <></>}
                  </span>
                  {paymentMethod === 'cod' ? (
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      width: '100%', 
                      marginTop: '4px',
                      padding: '6px 8px',
                      color: 'white', 
                      borderRadius: '4px', 
                      backgroundColor: '#1e40af',
                      margin: 0
                    }}>
                      <span style={{ 
                        textTransform: 'uppercase', 
                        fontWeight: 'bold', 
                        display: 'flex', 
                        fontSize: '8px',
                        gap: '4px',
                        alignItems: 'center',
                        margin: '-5px 0 0 0',
                        padding: 0
                      }}><TbTruckDelivery style={{ fontSize: '14px' }}/>cash on delivery</span>
                      <p style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '2px', 
                        fontSize: '8px',
                        margin: '-5px 0 0 0',
                        padding: 0
                      }}>₱<span style={{ fontWeight: 'bold', fontSize: '11px' }}>{formatCurrency(total)}</span></p>
                    </span>
                  ) : (
                    <span style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center', 
                      width: '100%', 
                      backgroundColor: '#1e40af', 
                      color: 'white', 
                      padding: '8px',
                      paddingTop: 0,
                      margin: 0
                    }}>
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        margin: 0,
                        padding: 0
                      }}>
                        <p style={{ 
                          textTransform: 'uppercase', 
                          fontSize: '7px',
                          fontWeight: 'bold', 
                          letterSpacing: '0.05em',
                          marginTop: '-2px',
                          padding: 0
                        }}>{payment[paymentMethod]?.title || paymentMethod}</p>
                      </span>
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'flex-end', 
                        justifyContent: 'space-between',
                        margin: 0,
                        padding: 0
                      }}>
                        <span style={{ 
                          width: '100%', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'flex-start',
                          margin: 0,
                          padding: 0
                        }}>
                          <span style={{ 
                            display: 'flex', 
                            width: '100%', 
                            alignItems: 'center', 
                            gap: '1px',
                            margin: 0,
                            paddingBottom: 5
                          }}>
                            <strong style={{ fontWeight: '800', fontSize: '10px' }}>{paymentMethod.toUpperCase()} Payment</strong>
                          </span>
                        </span>
                        <p style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '2px', 
                          fontSize: '8px',
                          margin: 0,
                          paddingBottom: 5
                        }}>₱<span style={{ fontWeight: 'bold', fontSize: '11px', marginTop: '-5px' }}>{formatCurrency(total)}</span></p>
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div style={{ 
                width: '100%', 
                height: '100%', 
                border: '1px solid #d1d5db', 
                display: 'flex', 
                flexDirection: 'column', 
                padding: 0,
                margin: 0
              }}>
                <span style={{ 
                  fontSize: '12px',
                  fontWeight: 'bold', 
                  paddingLeft: '8px',
                  margin: '0 0 8px 0',
                  padding: '0 10px'
                }}>Summary</span>
                <div style={{ 
                  width: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  marginTop: '8px',
                  margin: 0,
                  padding: 0
                }}>
                  <span style={{ 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '2px 12px',
                    margin: 0,
                    gap: 3
                  }}>
                    <strong style={{ fontWeight: '800', fontSize: '10px' }}>Subtotal</strong>
                    <span style={{ 
                      fontSize: '8px',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '2px'
                    }}>₱<strong style={{ fontWeight: '800', fontSize: '11px', marginTop: '-3px' }}>{formatCurrency(subtotal)}</strong></span>
                  </span>
                  <span style={{ 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '2px 12px',
                    margin: 0,
                    gap: 3
                  }}>
                    <strong style={{ fontWeight: '800', fontSize: '10px' }}>Delivery Fee</strong>
                    <span style={{ 
                      fontSize: '8px',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '2px'
                    }}>₱<strong style={{ fontWeight: '800', fontSize: '11px', marginTop: '-3px' }}>{formatCurrency(shippingFee)}</strong></span>
                  </span>
                  {discount > 0 && (
                    <span style={{ 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '2px 12px',
                      margin: 0,
                      gap: 3
                    }}>
                      <strong style={{ fontWeight: '800', fontSize: '10px' }}>Discount</strong>
                      <strong style={{ marginRight: 'auto', fontWeight: '600', fontSize: '8px', marginTop: 2 }}>({discountPercentage}% less)</strong>
                      <span style={{ 
                        fontSize: '8px',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '2px'
                      }}>₱<strong style={{ fontWeight: '800', fontSize: '11px', marginTop: '-3px' }}>{formatCurrency(discount)}</strong></span>
                    </span>
                  )}
                  <span style={{ 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '0px 10px 20px 10px',
                    backgroundColor: '#1e40af', 
                    color: 'white',
                    marginTop: 10
                  }}>
                    <strong style={{ fontWeight: '800', fontSize: '14px' }}>Total</strong>
                    <span style={{ 
                      fontSize: '10px',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '2px'
                    }}>₱<strong style={{ fontWeight: '800', fontSize: '14px' }}>{formatCurrency(total)}</strong></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReceiptTemplate