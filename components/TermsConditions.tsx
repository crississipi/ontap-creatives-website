"use client"

import { motion } from 'framer-motion'
import React from 'react'

const TermsConditions = () => {
  return (
    <div className='h-[100vh] w-full bg-white flex items-center justify-center overflow-hidden'>
        <motion.div 
        initial={{y: 300}}
        animate={{y: 0}}
        transition={{
            duration: 0.7,
            ease: 'easeOut'
        }}
        className='h-max max-h-5/6 w-9/10 md:w-1/2 lg:w-2/3 xl:w-1/3 mt-20  bg-neutral-50 shadow-md overflow-x-hidden relative'>
            <span className='w-full flex flex-col sticky top-0 p-5 bg-neutral-50'>
                <h1 className='text-4xl'>Terms and Conditions</h1>
                <span className='text-neutral-600'>Effective Date: October 20, 2026</span>
            </span>
            
            <div className='flex flex-col w-full gap-5 pt-10 p-5'>
                <span>
                    <strong>1. Acceptance of Terms</strong>
                    <p>By accessing, registering for, or using the <strong>ON TAP Smart Business Card</strong>, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the Service.</p>
                </span>
                <span>
                    <strong>2. Description of Service</strong>
                    <p>The <strong>ON TAP Smart Business Card</strong> enables users to generate and personalize their  contact  details, edit information, and  customize the appearance of their virtual card. It facilitates the sharing of electronic representation of smart business card.</p>
                </span>
                <span>
                    <strong>3. Registration</strong>
                    <p>Registration is pre- requisite for accessing and utilize the service. Ensure that all information you provide is accurate. You are responsible for maintaining the confidentiality of your account and password.</p>
                </span>
                <span>
                    <strong>4. Use of Service</strong>
                    <p>You may not use the Service for any illegal purposes. You agree to comply with all local, state, national, and international laws and regulations.</p>
                </span>
                <span>
                    <strong>5. Intellectual Property</strong>
                    <p>The Dynamic content, unique graphics, design, QR codes, propriety software and any innovation technology, methods or processed used in creation or functioning of the smart business card and other matters related to the Service are protected under copyright and other proprietary laws. Unauthorized use may result in legal penalties.</p>
                </span>
                <span>
                    <strong>6. Privacy Policy</strong>
                    <p>Your use of the Service is subject to our Privacy Policy, which describes our data collection and use practices.</p>
                </span>
                <span>
                    <strong>7. Limitations and Modifications</strong>
                    <p>We reserve the right to modify, suspend, or discontinue the Service at any time, with or without notice. We shall not be liable to you or any third party should we exercise this right.</p>
                </span>
                <span>
                    <strong>8. Termination</strong>
                    <p>We may terminate your access to the Service, without cause or notice, which may result in the loss of any content associated with your account.</p>
                </span>
                <span>
                    <strong>9. Disclaimer of Warranties</strong>
                    <p>The Service is provided "as is". We disclaim all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose.</p>
                </span>
                <span>
                    <strong>10. Limitation of Liability</strong>
                    <p>In no event shall we be liable for any damages (including, without limitation, incidental or consequential damages) arising out of the use or inability to use the Service.</p>
                </span>
                <span>
                    <strong>11. Governing Law</strong>
                    <p>Abiding by this stipulation reflects our intention to follow the guidelines established in the Data Privacy Act Law ( Republic Act No. 10173)</p>
                </span>
                <span>
                    <strong>12. Changes to Terms</strong>
                    <p>We may update these Terms at any time. We will notify users of significant changes, and continued use of the Service constitutes agreement to the revised Terms.</p>
                </span>
                <span>
                    <strong>13. Contact Information</strong>
                    <p>For questions or concerns regarding these Terms, please contact us at:</p>
                    <ul className='flex flex-col ml-5'>
                        <li><strong>Email:</strong> ontapcreatives@gmail.com</li>
                        <li><strong>Address:</strong> 17 Vatican Bldg. Unit 109 BF Resort Village Las Piñas City</li>
                        <li className='flex gap-2'><strong>Phone:</strong>
                            <span className='flex flex-col'>
                                <a href="tel:+639763660377">+63 976 366 0377</a>
                                <a href="tel:+639764183188">+63 976 418 3188</a>
                                <a href="tel:+639764183189">+63 976 418 3189</a>
                            </span>
                        </li>
                    </ul>
                </span>
            </div>
        </motion.div>
    </div>
  )
}

export default TermsConditions