

import React, { JSX, useState } from 'react'
import Image from 'next/image';
import { RiTruckLine } from 'react-icons/ri';
import { TbTruckDelivery } from 'react-icons/tb';

interface ReceiptProps {
  orderID: string;
  customerName: string;
  items: { name: string; qty: number; price: number }[];
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
          style={{ width: '64px', objectFit: 'contain', position: 'absolute', right: '12px', marginTop: 5 }}
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

const ReceiptTemplate = ({ orderID, customerName, items }: ReceiptProps) => {
  const [modeOfPayment, setModeOfPayment] = useState('ewallet');
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
                    lineHeight: '1.2', // Reduced line height
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
                      gap: 0, // Reduced gap
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
                          padding: '8px', // Reduced padding
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
                                width: '60px', // Slightly smaller
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
                            fontSize: '10px', // Smaller font
                            fontWeight: 'bold', 
                            color: '#1e40af',
                            lineHeight: '1.1',
                            marginTop: '-18px',
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
                          padding: '6px 0px 10px 0px', // Reduced padding
                          borderBottom: '1px solid #d1d5db', 
                          color: '#1e40af',
                          fontSize: '10px', // Smaller font
                          marginTop: '-10px'
                        }}>
                          <a href="tel:+639177008364" style={{ fontWeight: 'bold', margin: 0, padding: 0 }}>+63 9177008364</a>•
                          <a href="tel:+639764183188" style={{ fontWeight: 'bold', margin: 0, padding: 0 }}>+63 9764183188</a>•
                          <a href="tel:+639764183189" style={{ fontWeight: 'bold', margin: 0, padding: 0 }}>+63 9764183189</a>
                        </span>
          
                        {/* Order Details */}
                        <div style={{ 
                          width: '100%', 
                          padding: '16px 8px 8px 8px', // Reduced padding
                          gap: '12px', // Reduced gap
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
                            marginTop: '-10px',
                            padding: 0
                          }}>
                            <h2 style={{ 
                              fontSize: '14px', // Slightly smaller
                              fontWeight: 'bold',
                              margin: 0,
                              padding: 0
                            }}>Order #10132025112</h2>
                            <span style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'flex-end', 
                              fontSize: '8px', // Smaller font
                              color: '#6b7280', 
                              fontWeight: '600', 
                              textTransform: 'uppercase',
                              lineHeight: '1.1',
                              margin: 0,
                              padding: 0
                            }}>
                              <strong style={{ margin: 0, padding: 0 }}>October 16, 2025</strong>
                              <strong style={{ margin: 0, padding: 0 }}>Thursday • 10:59:20 AM</strong>
                            </span>
                          </span>
                          <div style={{ 
                            width: '100%', 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            gap: '6px', // Reduced gap
                            columnGap: '6px',
                            margin: 0,
                            padding: 0
                          }}>
                            {['Client Name', 'Company', 'Contact number', 'Email Address'].map((label) => (
                              <span key={label} style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                width: '100%',
                                margin: 0,
                                padding: 0
                              }}>
                                <p style={{ 
                                  fontSize: '8px', // Smaller font
                                  textTransform: 'uppercase', 
                                  fontWeight: 'bold', 
                                  color: '#6b7280',
                                  margin: '0 0 2px 0', // Tight margin
                                  paddingBottom: 5
                                }}>{label}</p>
                                <span style={{ 
                                  padding: '0px 8px 6px 8px', // Reduced padding
                                  backgroundColor: '#f9fafb', 
                                  fontWeight: 'bold',
                                  fontSize: '10px',
                                  margin: 0
                                }}>Juan Dela Cruz</span>
                              </span>
                            ))}
                            <span style={{ 
                              gridColumn: '1 / -1', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              width: '100%',
                              margin: 0,
                              padding: 0
                            }}>
                              <p style={{ 
                                fontSize: '8px', // Smaller font
                                textTransform: 'uppercase', 
                                fontWeight: 'bold', 
                                color: '#6b7280',
                                margin: '0 0 2px 0', // Tight margin
                                paddingBottom: 10
                              }}>Delivery Address</p>
                              <span style={{ 
                                padding: '0px 8px 6px 8px', // Reduced padding
                                borderRadius: '4px', 
                                backgroundColor: '#f9fafb', 
                                fontWeight: 'bold',
                                fontSize: '10px',
                                margin: 0
                              }}>Blk 123 Lot 14 Madrigal Street, Las Pinas, Metro Manila, 1103</span>
                            </span>
                          </div>
                        </div>
          
                        {/* Order Tracking */}
                        <div style={{ 
                          height: 'max-content', 
                          padding: '8px', // Reduced padding
                          gap: '8px', // Reduced gap
                          display: 'flex', 
                          flexDirection: 'column',
                          margin: 0
                        }}>
                          <span style={{ 
                            fontSize: '12px', 
                            fontWeight: 'bold',
                            marginTop: '-10px',
                            padding: 0
                          }}>Order Tracking</span>
                          <div style={{ 
                            height: '100%', 
                            width: '100%', 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            paddingRight: '4px', // Reduced padding
                            margin: 0
                          }}>
                            <span style={{ 
                              height: 'max-content', 
                              width: '100%', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              paddingLeft: '16px', // Reduced padding
                              paddingTop: '8px', // Reduced padding
                              paddingBottom: '8px', // Reduced padding
                              position: 'relative',
                              margin: 0
                            }}>
                              <div style={{ 
                                height: '8px', // Smaller
                                width: '8px', // Smaller
                                backgroundColor: '#2563eb', 
                                borderRadius: '1px', 
                                position: 'absolute', 
                                zIndex: 20, 
                                left: 0, 
                                top: '2px' // Adjusted position
                              }}></div>
                              <div style={{ 
                                height: '100%', 
                                width: '1px', // Thinner line
                                backgroundColor: '#d1d5db', 
                                position: 'absolute', 
                                left: '3px', // Adjusted position
                                top: '10px' // Adjusted position
                              }}></div>
                              <strong style={{ 
                                textTransform: 'uppercase', 
                                fontWeight: '800', 
                                fontSize: '8px', // Smaller font
                                color: '#6b7280', 
                                margin: '0 0 4px 0', // Tight margin
                                padding: 0
                              }}>today</strong>
                              <span style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '2px', // Reduced gap
                                margin: 0,
                                padding: 0
                              }}>
                                <strong style={{ 
                                  fontSize: '10px', // Smaller font
                                  fontWeight: '800', 
                                  color: '#1e40af',
                                  lineHeight: '1.1',
                                  margin: 0,
                                  padding: 0
                                }}>
                                  10:56 AM <span style={{ color: 'black', fontWeight: 'normal' }}> ● Mock Up Layout Approved</span>
                                </strong>
                                <strong style={{ 
                                  fontSize: '10px', // Smaller font
                                  fontWeight: '800', 
                                  color: '#1e40af',
                                  lineHeight: '1.1',
                                  margin: 0,
                                  padding: 0
                                }}>
                                  09:00 AM <span style={{ color: 'black', fontWeight: 'normal' }}> ● Mock Up Layout for Approval</span>
                                </strong>
                              </span>
                            </span>
                            
                            {/* Additional tracking items with similar compact styling */}
                            <span style={{ 
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
                                borderRadius: '50%', 
                                position: 'absolute', 
                                zIndex: 20, 
                                left: 0, 
                                top: '6px' 
                              }}></div>
                              <div style={{ 
                                height: '100%', 
                                width: '1px', 
                                backgroundColor: '#d1d5db', 
                                position: 'absolute', 
                                left: '3px', 
                                top: '14px' 
                              }}></div>
                              <strong style={{ 
                                textTransform: 'uppercase', 
                                fontWeight: '800', 
                                fontSize: '8px', 
                                color: '#6b7280', 
                                margin: '0 0 4px 0',
                                padding: 0
                              }}>yesterday</strong>
                              <span style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '0px',
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
                                  05:28 PM <span style={{ color: 'black', fontWeight: 'normal' }}> ● Initial Layout Received</span>
                                </strong>
                                <strong style={{ 
                                  fontSize: '10px', 
                                  fontWeight: '800', 
                                  color: '#1e40af',
                                  lineHeight: '1.1',
                                  margin: 0,
                                  padding: 0
                                }}>
                                  09:00 AM <span style={{ color: 'black', fontWeight: 'normal' }}> ● Contacted by Marketing Personnel</span>
                                </strong>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
          
                      {/* Items and Summary Section - Continue with similar compact styling */}
                      <div style={{ 
                        width: '100%', 
                        maxWidth: '100%', 
                        height: 'max-content', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 0, // Reduced gap
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
                          padding: '12px', // Reduced padding
                          margin: 0
                        }}>
                          <h2 style={{ 
                            fontSize: '14px', 
                            color: '#1e40af', 
                            fontWeight: 'bold',
                            margin: '-10px 0px 16px 0px', // Tight margin
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
                            {Array.from({length: 2}).map((_,i) => ( // Reduced to 2 items for compactness
                              <div key={i} style={{ 
                                display: 'flex', 
                                width: '100%', 
                                padding: '8px', // Reduced padding
                                paddingTop: 0,
                                alignItems: 'center', 
                                gap: '8px', // Reduced gap
                                borderBottom: '1px solid #f3f4f6',
                                marginBottom: 5
                              }}>
                                <span style={{ 
                                  height: '40px', // Smaller
                                  aspectRatio: '1/1',  
                                  backgroundColor: '#dbeafe' 
                                }}></span>
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
                                    fontSize: '10px', // Smaller font
                                    margin: 0,
                                    paddingBottom: 10
                                  }}>Carbon Fiber Digital Business Card</h3>
                                  <p style={{ 
                                    fontSize: '8px', // Smaller font
                                    fontWeight: 'bold', 
                                    textTransform: 'uppercase', 
                                    margin: '2px 0 0 0', // Tight margin
                                    padding: 0
                                  }}>Logo: <strong style={{ color: '#1e40af', fontWeight: 'bold' }}>OnTap</strong></p>
                                  <p style={{ 
                                    fontSize: '8px', // Smaller font
                                    fontWeight: 'bold', 
                                    textTransform: 'uppercase', 
                                    margin: '0 0 4px 0', // Tight margin
                                    padding: 0
                                  }}>Color: <strong style={{ color: '#1e40af', fontWeight: 'bold' }}>Default</strong></p>
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
                                    fontSize: '8px', // Smaller font
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '2px', 
                                    color: '#6b7280',
                                    margin: 0,
                                    padding: 0
                                  }}>₱ <strong style={{ fontSize: '9px', marginTop: '-3px' }}>999.00</strong></p>
                                  <strong style={{ color: '#6b7280', fontSize: '10px', margin: 0, padding: 0 }}>99</strong>
                                  <p style={{ 
                                    fontSize: '8px', // Smaller font
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '2px', 
                                    color: '#1e40af',
                                    margin: 0,
                                    padding: 0
                                  }}>₱ <strong style={{ fontSize: '11px', marginTop: '-3px' }}>98,901.00</strong></p>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
          
                        {/* Continue with the rest of the components using the same compact styling approach */}
                        {/* Shipping & Payment */}
                        <div style={{ 
                          width: '100%', 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(2, 1fr)', 
                          alignItems: 'flex-start', 
                          gap: '8px', // Reduced gap
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
                            paddingTop: 0, // Reduced padding
                            justifyContent: 'space-between',
                            margin: 0
                          }}>
                            <span style={{ 
                              fontSize: '11px', // Smaller font
                              fontWeight: 'bold', 
                              paddingLeft: '8px', // Reduced padding
                              margin: '0 0 12px 0', // Tight margin
                              padding: 0
                            }}>Shipping Method</span>
                            <span style={{ 
                              width: '100%', 
                              paddingTop: '4px', // Reduced padding
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '6px', // Reduced gap
                              margin: 0,
                              padding: 0
                            }}>
                              <span style={{ 
                                height: '24px', // Smaller
                                aspectRatio: '1/1', 
                                borderRadius: '6px', 
                                backgroundColor: '#1e40af', 
                                color: 'white', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                display: 'flex', 
                                fontSize: '14px', // Smaller
                                margin: 0
                              }}>
                                <RiTruckLine />
                              </span>
                              <span style={{ 
                                width: '100%', 
                                fontSize: '10px', // Smaller font
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                marginTop: '-5px',
                                padding: 0
                              }}>
                                <strong style={{ fontWeight: '800', color: '#374151' }}>Door-to-door Delivery</strong>
                                <span style={{ 
                                  fontSize: '8px', // Smaller font
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '2px', 
                                  marginLeft: 'auto'
                                }}>₱<strong style={{ fontSize: '11px', fontWeight: '800' }}>250.00</strong></span>
                              </span>
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
                              paddingTop: 0, // Reduced padding
                              margin: 0
                            }}>
                              <span style={{ 
                                fontSize: '11px', // Smaller font
                                fontWeight: 'bold',
                                margin: 0,
                                paddingBottom: 5
                              }}>Mode of Payment</span>
                              {payment[modeOfPayment].image}
                            </span>
                            {modeOfPayment === 'cod' ? (
                              <span style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                width: '100%', 
                                marginTop: '4px', // Reduced margin
                                padding: '6px 8px', // Reduced padding
                                color: 'white', 
                                borderRadius: '4px', 
                                backgroundColor: '#1e40af',
                                margin: 0
                              }}>
                                <span style={{ 
                                  textTransform: 'uppercase', 
                                  fontWeight: 'bold', 
                                  display: 'flex', 
                                  fontSize: '8px', // Smaller font
                                  gap: '4px', // Reduced gap
                                  alignItems: 'center',
                                  margin: 0,
                                  padding: 0
                                }}><TbTruckDelivery style={{ fontSize: '14px' }}/>cash on delivery</span>
                                <p style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '2px', 
                                  fontSize: '8px', // Smaller font
                                  margin: 0,
                                  padding: 0
                                }}>₱<span style={{ fontWeight: 'bold', fontSize: '11px' }}>999.00</span></p>
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
                                paddingTop: 0, // Reduced padding
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
                                    fontSize: '7px', // Smaller font
                                    fontWeight: 'bold', 
                                    letterSpacing: '0.05em',
                                    marginTop: '-2px',
                                    padding: 0
                                  }}>{payment[modeOfPayment].title}</p>
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
                                      <strong style={{ fontWeight: '800', fontSize: '10px' }}><span style={{ fontSize: '7px', marginTop: 2 }}>+63</span> 912 345 6789</strong>
                                    </span>
                                  </span>
                                  <p style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '2px', 
                                    fontSize: '8px', // Smaller font
                                    margin: 0,
                                    paddingBottom: 5
                                  }}>₱<span style={{ fontWeight: 'bold', fontSize: '11px', marginTop: '-5px' }}>999.00</span></p>
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
                          padding: 0, // Reduced padding
                          margin: 0
                        }}>
                          <span style={{ 
                            fontSize: '12px', // Smaller font
                            fontWeight: 'bold', 
                            paddingLeft: '8px', // Reduced padding
                            margin: '0 0 8px 0', // Tight margin
                            padding: '0 10px'
                          }}>Summary</span>
                          <div style={{ 
                            width: '100%', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            marginTop: '8px', // Reduced margin
                            margin: 0,
                            padding: 0
                          }}>
                            {[
                              { label: 'Subtotal', value: '98,901.00' },
                              { label: 'Delivery Fee', value: '250.00' },
                              { label: 'Discount', value: '9,890.10', note: '(10% less)' }
                            ].map((item, index) => (
                              <span key={index} style={{ 
                                width: '100%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                padding: '2px 12px', // Reduced padding
                                margin: 0,
                                gap: 3
                              }}>
                                <strong style={{ fontWeight: '800', fontSize: '10px' }}>{item.label}</strong>
                                {item.note && <strong style={{ marginRight: 'auto', fontWeight: '600', fontSize: '8px', marginTop: 2 }}>{item.note}</strong>}
                                <span style={{ 
                                  fontSize: '8px', // Smaller font
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '2px'
                                }}>₱<strong style={{ fontWeight: '800', fontSize: '11px', marginTop: '-3px' }}>{item.value}</strong></span>
                              </span>
                            ))}
                            <span style={{ 
                              width: '100%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between', 
                              padding: '0px 10px 20px 10px', // Reduced padding
                              backgroundColor: '#1e40af', 
                              color: 'white',
                              marginTop: 10
                            }}>
                              <strong style={{ fontWeight: '800', fontSize: '14px' }}>Total</strong>
                              <span style={{ 
                                fontSize: '10px', // Smaller font
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '2px'
                              }}>₱<strong style={{ fontWeight: '800', fontSize: '14px' }}>89,260.90</strong></span>
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