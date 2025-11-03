"use client"

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react'
import { HiChevronRight, HiOutlineX } from 'react-icons/hi'
import { MdFormatListBulleted } from 'react-icons/md';

const PrivacyPolicy = () => {
  const [dropdown1, setDropdown1] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);
  const [dropdown3, setDropdown3] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  return (
    <div className='h-[100vh] w-full flex pb-5 overflow-hidden relative'>
        <motion.div 
        initial={{x: 100}}
        className='pt-20 hidden h-full w-[20%] lg:flex flex-col table-of-contents overflow-x-hidden duration-150 ease-out transition-normal'>
            <h2 className='font-bold text-xl mt-5 pl-5'>Table of Contents</h2>
            <a href="#introduction" className='pl-9 focus:bg-light-blue w-full' draggable={false}>Introduction</a>
            <a href="#IandD" className='pl-3' draggable={false} onClick={() => setDropdown1(!dropdown1)}><HiChevronRight className={`${dropdown1 && 'rotate-90'} ease-out duration-200`}/>Interpretation and Definitions</a>
            {dropdown1 && (
                <span className='flex flex-col bg-light-blue/50'>
                    <a href="#interpretation" className='pl-5' draggable={false}>Interpretation</a>
                    <a href="#definitions" className='pl-5' draggable={false}>Definitions</a>
                </span>
            )}
            <a href="#collecting" className='pl-3' draggable={false} onClick={() => setDropdown2(!dropdown2)}><HiChevronRight className={`${dropdown2 && 'rotate-90'} ease-out duration-200`}/>Collecting and Using your Personal Data</a>
            {dropdown2 && (
                <span className='flex flex-col bg-light-blue/50'>
                    <a href="#personalData" className='pl-9' draggable={false}>Personal Data</a>
                    <a href="#usageData" className='pl-5' draggable={false}>Usage Data</a>
                    <a href="#thirdPartyInfo" className='pl-5' draggable={false}>Information from Third-Party Social Media Services</a>
                </span>
            )}
            <a href="#tracking" className='pl-9' draggable={false}>Tracking Technologies and Cookies</a>
            <span className='flex flex-col'>
                <a href="#cookies" className='pl-5' draggable={false} onClick={() => setDropdown3(!dropdown3)}><HiChevronRight className={`${dropdown3 && 'rotate-90'} ease-out duration-200`}/>Browser Cookies</a>
                {dropdown3 && (
                    <span className='flex flex-col'>
                        <a href="#necessaryCookies" className='pl-15' draggable={false}>Necessary/Essential Cookies</a>
                        <a href="#cookiesPolicy" className='pl-15' draggable={false}>Notice Acceptance Cookies</a>
                        <a href="#functionalityCookies" className='pl-15' draggable={false}>Functionality Cookies</a>
                    </span>
                )}
                <a href="#beacons" draggable={false}>Web Beacons</a>
            </span>
            <a href="#legalBases" className='pl-9' draggable={false}>Legal Bases for Processing Personal Data</a>
            <a href="#useOfPersonalData" className='pl-9' draggable={false}>Use of your Personal Data</a>
            <a href="#crossBorder" className='pl-9' draggable={false}>Cross-Border Transfer of Data</a>
            <a href="#rights" className='pl-9' draggable={false}>Rights under Data Privacy Act</a>
            <a href="#exercise" className='pl-9' draggable={false}>How to Exercise your Rights</a>
            <a href="#retention" className='pl-9' draggable={false}>Retention of your Personal Data</a>
            <a href="#security" className='pl-9' draggable={false}>Security of your Personal Data</a>
            <a href="#breach" className='pl-9' draggable={false}>Breach Notification</a>
            <a href="#children" className='pl-9' draggable={false}>Children's Policy</a>
            <a href="#links" className='pl-9' draggable={false}>Links to Other Websites</a>
            <a href="#changes" className='pl-9' draggable={false}>Changes to the Privacy Policy</a>
            <a href="#contact" className='pl-9' draggable={false}>Contact Us</a>
        </motion.div>
        <AnimatePresence mode='wait'>
            {showTableOfContents && (
                <motion.div 
                    initial={{x: 500}}
                    animate={{x: 0}}
                    exit={{x: 500}}
                    transition={{
                        duration: 0.3,
                        ease: 'easeOut'
                    }}
                    className='pt-20 lg:hidden h-full max-h-full w-2/3 flex flex-col table-of-contents overflow-x-hidden duration-150 ease-out transition-normal absolute right-0 bg-white z-10 shadow-xl'
                >
                    <span className='px-5 flex items-center justify-between'>
                        <h2 className='font-bold text-xl'>Table of Contents</h2>
                        <button type="button" className='text-2xl rounded-md border border-transparent hover:text-rose-300 focus:border-rose-500 focus:text-rose-500 ease-out duration-200' onClick={() => setShowTableOfContents(false)}><HiOutlineX /></button>
                    </span>
                    <a href="#introduction" className='pl-9 focus:bg-light-blue w-full' draggable={false}>Introduction</a>
                    <a href="#IandD" className='pl-3' draggable={false} onClick={() => setDropdown1(!dropdown1)}><HiChevronRight className={`${dropdown1 && 'rotate-90'} ease-out duration-200`}/>Interpretation and Definitions</a>
                    {dropdown1 && (
                        <span className='flex flex-col bg-light-blue/50'>
                            <a href="#interpretation" className='pl-5' draggable={false}>Interpretation</a>
                            <a href="#definitions" className='pl-5' draggable={false}>Definitions</a>
                        </span>
                    )}
                    <a href="#collecting" className='pl-3' draggable={false} onClick={() => setDropdown2(!dropdown2)}><HiChevronRight className={`${dropdown2 && 'rotate-90'} ease-out duration-200`}/>Collecting and Using your Personal Data</a>
                    {dropdown2 && (
                        <span className='flex flex-col bg-light-blue/50'>
                            <a href="#personalData" className='pl-9' draggable={false}>Personal Data</a>
                            <a href="#usageData" className='pl-5' draggable={false}>Usage Data</a>
                            <a href="#thirdPartyInfo" className='pl-5' draggable={false}>Information from Third-Party Social Media Services</a>
                        </span>
                    )}
                    <a href="#tracking" className='pl-9' draggable={false}>Tracking Technologies and Cookies</a>
                    <span className='flex flex-col'>
                        <a href="#cookies" className='pl-5' draggable={false} onClick={() => setDropdown3(!dropdown3)}><HiChevronRight className={`${dropdown3 && 'rotate-90'} ease-out duration-200`}/>Browser Cookies</a>
                        {dropdown3 && (
                            <span className='flex flex-col'>
                                <a href="#necessaryCookies" className='pl-15' draggable={false}>Necessary/Essential Cookies</a>
                                <a href="#cookiesPolicy" className='pl-15' draggable={false}>Notice Acceptance Cookies</a>
                                <a href="#functionalityCookies" className='pl-15' draggable={false}>Functionality Cookies</a>
                            </span>
                        )}
                        <a href="#beacons" draggable={false}>Web Beacons</a>
                    </span>
                    <a href="#legalBases" className='pl-9' draggable={false}>Legal Bases for Processing Personal Data</a>
                    <a href="#useOfPersonalData" className='pl-9' draggable={false}>Use of your Personal Data</a>
                    <a href="#crossBorder" className='pl-9' draggable={false}>Cross-Border Transfer of Data</a>
                    <a href="#rights" className='pl-9' draggable={false}>Rights under Data Privacy Act</a>
                    <a href="#exercise" className='pl-9' draggable={false}>How to Exercise your Rights</a>
                    <a href="#retention" className='pl-9' draggable={false}>Retention of your Personal Data</a>
                    <a href="#security" className='pl-9' draggable={false}>Security of your Personal Data</a>
                    <a href="#breach" className='pl-9' draggable={false}>Breach Notification</a>
                    <a href="#children" className='pl-9' draggable={false}>Children's Policy</a>
                    <a href="#links" className='pl-9' draggable={false}>Links to Other Websites</a>
                    <a href="#changes" className='pl-9' draggable={false}>Changes to the Privacy Policy</a>
                    <a href="#contact" className='pl-9' draggable={false}>Contact Us</a>
                </motion.div>
            )}
        </AnimatePresence>
        <div className='pt-14 w-full lg:w-[80%] h-full flex flex-col overflow-hidden'>
            <div className='w-full flex flex-col p-5 pb-3 gap-3'>
                <span className='flex items-center justify-between'>
                    <h1 className='text-4xl'>Privacy Policy</h1>
                    <button type="button" className='text-2xl hover:text-blue focus:text-dark-blue ease-out duration-200' onClick={() => setShowTableOfContents(true)}><MdFormatListBulleted /></button>
                </span>
                <span className='text-dark-blue uppercase text-xs font-bold'>Last updated: October 2025</span>
            </div>

            <div className='w-full h-full overflow-x-hidden p-5 px-5 lg:px-10 privacy-parent'>
                <p id='introduction'>
                    <strong>On Tap Creatives</strong> ("the Company," "We," "Us," or "Our") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy describes how we collect, use, disclose, and protect your personal data in accordance with the Philippine Data Privacy Act of 2012 (RA 10173) and other applicable laws.
                </p>

                    <p>
                        By using our Service, you consent to the data practices described in this policy. You also acknowledge the rights granted to you by law and how you can exercise them with us.
                    </p>

                    <h2 id='IandD'>Interpretation and Definitions</h2>
                    <h3 id='interpretation'>Interpretation</h3>
                    <p>
                        The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                    </p>

                    <h3 id='definitions'>Definitions</h3>
                    <p>For the purposes of this Privacy Policy:</p>

                    <ul>
                        <li>
                            <strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.
                        </li>
                        <li>
                            <strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.
                        </li>
                        <li>
                            <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to On Tap Creatives, 17 Vatican Bldg. Unit 109 BF Resort Village, Las Piñas City.
                        </li>
                        <li>
                            <strong>Consent</strong> means any freely given, specific, informed indication of will, whereby you agree to the collection and processing of your personal data.
                        </li>
                        <li>
                            <strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.
                        </li>
                        <li>
                            <strong>Country</strong> refers to: Philippines
                        </li>
                        <li>
                            <strong>Data Subject</strong> refers to you, the individual whose personal data is processed.
                        </li>
                        <li>
                            <strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.
                        </li>
                        <li>
                            <strong>Personal Data</strong> is any information that relates to an identified or identifiable individual. This is any information, whether recorded in a material form or not, from which the identity of an individual is apparent or can be reasonably and directly ascertained by the entity holding the information, or when put together with other information would directly and certainly identify an individual.
                        </li>
                        <li>
                            <strong>Service</strong> refers to the Website.
                        </li>
                        <li>
                            <strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used. Service Providers are considered Personal Information Processors under Philippine law.
                        </li>
                        <li>
                            <strong>Third-party Social Media Service</strong> refers to any website or any social network website through which a User can log in or create an account to use the Service.
                        </li>
                        <li>
                            <strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).
                        </li>
                        <li>
                            <strong>Website</strong> refers to On Tap, accessible from <a href="https://ontap.ph" target="_blank" 
                            rel="noopener noreferrer">https://ontap.ph</a>
                        </li>
                        <li>
                            <strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
                        </li>
                    </ul>

                    <h2 id='collecting'>Collecting and Using Your Personal Data</h2>
                    <h3>Types of Data Collected</h3>

                    <strong id='personalData'>Personal Data</strong>
                    <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>

                    <ul>
                        <li>Email address</li>
                        <li>First name and last name</li>
                        <li>Phone number</li>
                        <li>Address, State, Province, ZIP/Postal code, City</li>
                        <li>Business Designation</li>
                        <li>Company details</li>
                        <li>Usage Data</li>
                    </ul>
                    <strong id='usageData'>Usage Data</strong>
                    <p>
                        Usage Data is collected automatically when using the Service.
                        <br /><br />
                        Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                        When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.
                        <br /><br />
                        We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.
                    </p>

                    <strong id='thirdPartyInfo'>Information from Third-Party Social Media Services</strong>
                    <p>The Company allows You to create an account and log in to use the Service through the following Third-party Social Media Services:</p>

                    <ul>
                        <li>Google</li>
                    </ul>

                    <p>If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We may collect Personal data that is already associated with Your Third-Party Social Media Service's account, such as Your name, Your email address, Your activities or Your contact list associated with that account.
                    <br /><br />
                    You may also have the option of sharing additional information with the Company through Your Third-Party Social Media Service's account. If You choose to provide such information and Personal Data, during registration or otherwise, You are giving the Company permission to use, share, and store it in a manner consistent with this Privacy Policy.</p>

                    <strong id='tracking'>Tracking Technologies and Cookies</strong>
                    <p>We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:</p>

                    <ul>
                        <li id='cookies'><strong>Cookies or Browser Cookies</strong>. A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</li>
                        <li id='beacons'><strong>Web Beacons</strong>. Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity).</li>
                    </ul>

                    <p>Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.
                    We use both Session and Persistent Cookies for the purposes set out below:</p>
                    
                    <ul>
                        <li id='necessaryCookies'>
                            <strong>Necessary / Essential Cookies</strong>
                            <span>Type: Session Cookies</span>
                            <span>Administered by: Us</span>
                            Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.
                        </li>
                        <li id='cookiesPolicy'>
                            <strong>Cookies Policy / Notice Acceptance Cookies</strong>
                            <span>Type: Persistent Cookies</span>
                            <span>Administered by: Us</span>
                            Purpose: These Cookies identify if users have accepted the use of cookies on the Website.
                        </li>
                        <li id='functionalityCookies'>
                            <strong>Functionality Cookies</strong>
                            <span>Type: Persistent Cookies</span>
                            <span>Administered by: Us</span>
                            Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.
                        </li>
                    </ul>
                    
                    <p>
                        For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of our Privacy Policy.
                    </p>

                    <strong id='legalBases'>Legal Bases for Processing Your Personal Data</strong>
                    <p>Under the Philippine Data Privacy Act, we process your personal data based on the following legal grounds:</p>
                    
                    <ul>
                        <li>Your consent;</li>
                        <li>The performance of a contract with you (e.g., to provide the services you request);</li>
                        <li>To comply with our legal obligations;</li>
                        <li>To protect your vital interests;</li>
                        <li><strong>For the legitimate interests pursued by us or a third party</strong>, such as improving our services, marketing, and preventing fraud, provided that your fundamental rights and freedoms do not override those interests.</li>
                    </ul>

                    <strong id='useOfPersonalData'>Use of Your Personal Data</strong>
                    <p>The Company may use Personal Data for the following purposes:</p>

                    <ul>
                        <li><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
                        <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</li>
                        <li><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
                        <li><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
                        <li><strong>To provide You with news, special offers and general information </strong>about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.</li>
                        <li><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
                        <li><strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</li>
                        <li><strong>For other purposes:</strong> We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.</li>
                    </ul>

                    <p>We may share Your personal information in the following situations:</p>

                    <ul>
                        <li><strong>With Service Providers:</strong> We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You. We ensure that such third parties are contractually bound to comply with the Data Privacy Act.</li>
                        <li><strong>For business transfers:</strong> We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.</li>
                        <li><strong>With Affiliates:</strong> We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.</li>
                        <li>With business partners: We may share Your information with Our business partners to offer You certain products, services or promotions.</li>
                        <li><strong>With other users:</strong> when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside. If You interact with other users or register through a Third-Party Social Media Service, Your contacts on the Third-Party Social Media Service may see Your name, profile, pictures and description of Your activity. Similarly, other users will be able to view descriptions of Your activity, communicate with You and view Your profile.</li>
                        <li><strong>With Your consent:</strong> We may disclose Your personal information for any other purpose with Your consent.</li>
                    </ul>

                    <strong id='crossBorder'>Cross-Border Transfer of Data</strong>
                    <p>Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to, and maintained on computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.
                        <br /><br />
                    Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer. In any instance of cross-border data transfer, we shall ensure that we comply with the requirements of the National Privacy Commission (NPC), and that the receiving country has adequate data protection standards or that we have secured contractual agreements to protect your data.
                    <br /><br />
                    The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy.</p>

                    <strong id='rights'>Your Rights Under the Data Privacy Act</strong>
                    <p>As a data subject, you have the following rights:</p>

                    <ol>
                        <li><strong>Right to be Informed:</strong> You have the right to be informed whether your personal data is being, or have been, processed.</li>
                        <li>Right to Access: You have the right to reasonable access to the contents of your personal data that was processed.</li>
                        <li><strong>Right to Rectify:</strong> You have the right to have any inaccurate or incomplete personal data corrected.</li>
                        <li><strong>Right to Erasure or Blocking (Right to be Forgotten):</strong> You have the right to suspend, withdraw, or order the blocking, removal, or destruction of your personal data from our filing system based on lawful grounds.</li>
                        <li><strong>Right to Object:</strong> You have the right to object to the processing of your personal data, including processing for direct marketing.</li>
                        <li><strong>Right to Data Portability:</strong> You have the right to obtain a copy of your personal data in an electronic or structured format.</li>
                        <li><strong>Right to Damages:</strong> You have the right to be indemnified for any damages sustained due to such inaccurate, incomplete, outdated, false, unlawfully obtained, or unauthorized use of your personal data.</li>
                    </ol>
                    
                    <p id='exercise' className='flex flex-col my-3'>
                        <strong>How to Exercise Your Rights</strong>
                        To exercise any of these rights, you may contact our Data Protection Officer (DPO) using the contact details provided at the end of this policy. We will respond to your request within a reasonable period upon verification of your identity.
                    </p>

                    <p id='retention' className='flex flex-col my-3'>
                        <strong>Retention of Your Personal Data</strong>
                        The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy, including to satisfy any legal, accounting, or reporting requirements. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
                        Upon expiration of the retention period, we will securely destroy, delete, or anonymize your personal data.
                    </p>

                    <p id='security' className='flex flex-col my-3'>
                        <strong>Security of Your Personal Data</strong>
                        The security of Your Personal Data is important to Us. We implement appropriate organizational, physical, and technical security measures intended to protect your personal data. These measures include encryption, strict access controls, and regular security audits. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
                    </p>

                    <p id='breach' className='flex flex-col my-3'>
                        <strong>Breach Notification</strong>
                        In the event that your personal data is compromised due to a security breach, and such breach poses a real risk to your rights and freedoms, we undertake to notify you and the National Privacy Commission (NPC) within the period prescribed by law.
                    </p>

                    <p id='children' className='flex flex-col my-3'>
                        <strong>Children's Privacy</strong>
                        Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 13 without verification of parental consent, We take steps to remove that information from Our servers.
                    </p>

                    <p id='links' className='flex flex-col my-3'>
                        <strong>Links to Other Websites</strong>
                        Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.
                        <br /><br />
                        We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
                    </p>

                    <p id='changes' className='flex flex-col my-3'>
                        <strong>Changes to this Privacy Policy</strong>
                        We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.
                        We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.
                        <br /><br />
                        You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                    </p>

                    <p id='contact' className='flex flex-col my-3'>
                        <strong>Contact Us</strong>
                        If you have any questions about this Privacy Policy, your personal data, or your rights under the Data Privacy Act, you may contact us:
                    </p>

                    <ul>
                        <li>
                            <strong>By email:</strong> ontapcreatives@gmail.com
                        </li>
                        <li>       
                            <strong>By mail:</strong>
                            On Tap Creatives
                            17 Vatican Bldg. Unit 109 BF Resort Village
                            Las Piñas City, Philippines
                        </li>
                        <li><strong>Mobile:</strong> +63 976 366 0377</li>
                    </ul>

                    <p>
                        You also have the right to lodge a complaint with the <strong>National Privacy Commission</strong>.
                        <br /><br />
                        Address: 5th Floor, PICPA Building, 510 Pablo Ocampo Sr. Ext, Makati City 1200
                        Website: <a href="https://www.privacy.gov.ph">https://www.privacy.gov.ph</a>
                    </p>
            </div>
        </div>
    </div>
  )
}

export default PrivacyPolicy