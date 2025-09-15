"use client";

import React, { useEffect, useState } from 'react';
import FAQsCategory from './FAQsCategory';
import { HiMiniArrowLeftStartOnRectangle, HiMiniArrowRightStartOnRectangle } from 'react-icons/hi2';

const QA = [
    {
        topic: 'General Information',
        question: [
            'What is a smart business card?',
            'How does the NFC feature work on the card?',
            'Do I need a special app to use the card?',
            'Can I customize the design of my smart business card?',
            'Is there a limit to how many times the card can be tapped?'
        ]
    },
    {
        topic: 'Compatibility and Usage',
        question: [
            'Which phones are compatible with the NFC business card?',
            'Will the card work on both Android and iOS devices?',
            'What happens if the phone does not support NFC?',
            'Can I use the card without an internet connection?',
            'Does the card work with all browsers when the link opens?'
        ]
    },
    {
        topic: 'Setup and Customization',
        question: [
            'How do I program or set up the link on my smart business card?',
            'Can I update the website link after the card has been printed?',
            'Can I link the card to my social media profiles instead of a website?',
            'How long does it take to activate my card?',
            'Can I manage multiple links for different occasions?'
        ]
    },
    {
        topic: 'Security and Privacy',
        question: [
            'Is my personal data stored on the smart business card?',
            'Can someone copy the NFC data from my card?',
            'How secure is the link sharing process?',
            'Can I disable my card if it gets lost?',
            'Does tapping the card expose my phone to viruses or malware?'
        ]
    },
    {
        topic: 'Orders, Pricing, and Support',
        question: [
            'How much does a smart business card cost?',
            'Are there discounts for bulk or corporate orders?',
            'How long does it take to receive my card after ordering?',
            'What should I do if my card is damaged or not working?',
            'Do you offer customer support for setup and troubleshooting?'
        ]
    },
]

const Answers = [
  [
    // Category 1: General Information
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          A smart business card is a modern upgrade to the traditional paper card. Unlike the old version that only displays printed contact details, this one comes with an embedded <strong>NFC (Near Field Communication)</strong> chip. When someone taps the card against their NFC-enabled smartphone, it immediately pulls up a link, whether that's your website, online portfolio, LinkedIn profile, or any other digital destination you choose.
        </p>
        <p className="indent-5">
          This means you don't need to rely on someone manually typing in your number or website address, which often gets lost or forgotten. With just one tap, your contact details and brand are instantly accessible, giving you a professional edge.
        </p>
        <p className="indent-5">
          Smart business cards combine physical branding with digital convenience. They bridge the gap between traditional networking and the fast pace of today's digital communication, helping you make a lasting impression while staying eco-friendly by reducing paper waste.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          Inside the card, there is a tiny NFC chip that works similarly to the technology used in contactless payments. When tapped against a smartphone that supports NFC, the chip transmits a signal containing the link you've programmed. The phone detects this automatically and displays a notification, prompting the user to open it.
        </p>
        <p className="indent-5">
          What makes this effective is that the process is instant, no apps, no scanning, no manual input. It's a frictionless way of sharing your details. The chip itself does not need batteries or charging, as it uses the phone's radio frequency to power the connection.
        </p>
        <p className="indent-5">
          This ensures a reliable experience every time you use the card. Whether at events, conferences, or client meetings, your card works as long as the other person has an NFC-enabled device.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          No special app is required to use the smart business card. Most modern smartphones (both iOS and Android) already come with built-in NFC readers. This means anyone with a recent phone can simply tap your card, and the link will pop up automatically on their screen.
        </p>
        <p className="indent-5">
          This is one of the biggest advantages of NFC cards over QR codes or specialized apps. There's no need for the other person to download anything, which often creates friction and prevents smooth networking. Instead, the process is natural and requires no explanation.
        </p>
        <p className="indent-5">
          That said, if someone's phone doesn't have NFC, you can still add a QR code to your card as a backup. This way, your card remains versatile and usable by everyone, regardless of their phone model.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          Smart business cards are built to last. They are typically made with durable PVC plastic, metal, or even premium wooden finishes, depending on your design preference. The embedded NFC chip is protected inside the card and does not wear out with normal usage.
        </p>
        <p className="indent-5">
          Unlike paper business cards that can tear, smudge, or be thrown away, these smart cards are reusable indefinitely. The information on them can also be reprogrammed, meaning if you change jobs, phone numbers, or websites, you don't need to print new cards,just update the link in the NFC chip.
        </p>
        <p className="indent-5">
          This makes them not only cost-effective over time but also eco-friendly. You avoid wasting resources on repeatedly printing paper cards, all while maintaining a sleek and professional presentation that stands out.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          Yes, you can fully customize the design of your smart business card. Just like traditional cards, you can choose your preferred colors, logos, layouts, and text. The difference is that beyond the design, you also have the digital capability embedded in the card.
        </p>
        <p className="indent-5">
          Businesses often use the front of the card for branding and logos, while the back may include a QR code as a backup option for phones without NFC. You can even design it to highlight your tagline or showcase your professional personality.
        </p>
        <p className="indent-5">
          Because the NFC function works invisibly, your card design remains clean and unaffected by the technology inside. This ensures your brand identity is not compromised, while still offering a futuristic and highly functional edge in networking.
        </p>
      </span>
    ),
  ],
  [
    // Category 2: Technical Aspects
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          Smart business cards are compatible with most smartphones released in the last several years. For Android, nearly all devices have built-in NFC readers, while for iPhones, models from iPhone 7 and newer support NFC functionality.
        </p>
        <p className="indent-5">
          This means that at least 90% of the people you meet will be able to use the card without any issues. In rare cases where someone has an older device without NFC, you can provide a QR code as an alternative method of accessing your information.
        </p>
        <p className="indent-5">
          The widespread compatibility of NFC technology ensures that your card is a reliable networking tool, no matter the audience. As smartphones continue evolving, NFC support will only grow stronger, making this solution even more future-proof.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          Updating the information on your NFC card is quick and simple. You don't need to physically replace the card each time your contact details change. Instead, the NFC chip is programmed with a link that points to your digital profile, website, or landing page.
        </p>
        <p className="indent-5">
          Whenever your details change, you just update the content of the link (for example, your personal website or profile page). The NFC card doesn't need to be modified because it always directs users to that same link.
        </p>
        <p className="indent-5">
          Some providers also offer mobile apps or dashboards where you can easily log in and manage your card's linked content. This makes it seamless to keep your information fresh and relevant without needing a reprint.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          NFC chips in smart business cards are designed to be safe. They are passive chips, meaning they don't store sensitive data like bank cards do. Instead, they only contain a link that directs users to a secure page or contact profile.
        </p>
        <p className="indent-5">
          Because the chip does not transmit personal data directly, there's no risk of someone stealing information by tapping your card without your consent. The card only activates when you intentionally bring it near a smartphone.
        </p>
        <p className="indent-5">
          If you want extra security, you can link the card to a protected website or profile that requires login. This ensures that only people you choose can access your full details, giving you complete control over your privacy.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          No, NFC cards do not require batteries or charging. The technology is powered passively when a smartphone's NFC reader comes close to it. The energy from the phone's radio waves powers the chip just enough to transmit its signal.
        </p>
        <p className="indent-5">
          This makes the cards highly convenient, as you never need to worry about charging them before use. Unlike electronic gadgets, they're always ready to function as long as you have your card with you.
        </p>
        <p className="indent-5">
          The absence of batteries also makes the cards slim, lightweight, and eco-friendly. They don't degrade over time the way rechargeable devices do, making them a long-lasting networking tool.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          You can store almost any type of digital link on an NFC business card. This includes your personal or company website, a LinkedIn profile, an online portfolio, contact details, or even a direct download link to a document or presentation.
        </p>
        <p className="indent-5">
          Many professionals link their card to a customizable landing page that houses all their contact information, including phone, email, and social media links. This makes it a one-stop solution for sharing your identity online.
        </p>
        <p className="indent-5">
          The chip itself doesn't hold the data, it simply acts as a bridge. By directing people to a live digital space, you ensure your information is always current and flexible enough to adapt to different networking situations.
        </p>
      </span>
    ),
  ],
  [
    // Category 3: Practical Use
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          Using the smart business card is straightforward. When you meet someone, simply ask them to tap the card on the back or top of their smartphone, depending on the device. A notification will instantly appear on their screen with a link to your profile or website.
        </p>
        <p className="indent-5">
          This process is much faster than handing over a paper card, waiting for them to store it, or hoping they don't lose it later. Instead, your digital presence is immediately in their hands, ready for saving or action.
        </p>
        <p className="indent-5">
          The best part is the simplicity. You don't need to explain complicated steps, apps, or installations. One tap, one instant connection,it's networking made effortless and modern.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          If the other person's phone does not support NFC, you're not out of options. Most smart business cards can be designed with a QR code printed on them as a backup. The recipient can simply scan the QR code using their phone's camera to access your information.
        </p>
        <p className="indent-5">
          This dual functionality makes the card highly versatile, covering both NFC and non-NFC users. It ensures your networking isn't limited by technology gaps.
        </p>
        <p className="indent-5">
          By combining both features, you maximize the chances of your details being accessible to anyone you meet, whether they're using the latest smartphone or an older model.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          Smart business cards work best in professional settings such as networking events, trade shows, client meetings, and conferences. They allow you to stand out in a crowd where everyone else is handing out paper cards.
        </p>
        <p className="indent-5">
          They are also valuable in everyday business interactions, whether meeting a client for the first time or attending an internal company event. The card instantly communicates that you're tech-savvy and modern in your approach.
        </p>
        <p className="indent-5">
          Additionally, they're useful for personal branding. Freelancers, entrepreneurs, and creatives can all use them to connect their portfolio, social media, and work samples directly, making networking more impactful.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          Yes, smart business cards can be shared internationally. NFC technology works globally, as it's the same system used in contactless payments and transit systems around the world.
        </p>
        <p className="indent-5">
          The only limitation is whether the phone has NFC enabled, which is common in nearly all modern smartphones. If NFC doesn't work, the QR code backup ensures that your card is still usable across different countries.
        </p>
        <p className="indent-5">
          This global functionality makes smart business cards ideal for business travelers, international entrepreneurs, and companies looking to expand their reach without barriers.
        </p>
      </span>
    ),
    (
      <span className="h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl">
        <p className="indent-5">
          The number of people who can tap your card is unlimited. The NFC chip doesn't get “used up” or wear out when someone accesses it. You can share your card hundreds or thousands of times without affecting its performance.
        </p>
        <p className="indent-5">
          Each tap is just a signal being transmitted, so the card remains as effective after the 1,000th use as it was the first time. This durability makes it one of the most cost-effective networking investments available.
        </p>
        <p className="indent-5">
          With just one card, you can reach countless contacts, making it far more powerful than traditional paper cards, which need to be replaced once you run out.
        </p>
      </span>
    ),
  ],
  [
    (
      <span className='h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl'>
        <p className='indent-5'>
          Yes, smart business cards work with both Android and iOS smartphones. Modern devices from both platforms are equipped with <strong>NFC (Near Field Communication)</strong> technology, which allows them to read the chip embedded inside the card. When you tap the card to the back of a phone, it automatically prompts a notification to open the link you programmed into the card.
        </p>
        <p className='indent-5'>
          For iPhones, models from the iPhone 7 and above support NFC, with newer models (iPhone XS and later) enabling background scanning that doesn't require opening a specific app. On Android, most mid-range and flagship devices also come with built-in NFC capability. This wide compatibility ensures that the vast majority of users can interact with your card without issues.
        </p>
        <p className='indent-5'>
          To maximize compatibility, many businesses also choose to include a QR code printed on the card. This serves as a backup option for users whose phones may not support NFC. This dual setup guarantees a seamless networking experience regardless of the device.
        </p>
      </span>
    ),
    (
      <span className='h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl'>
        <p className='indent-5'>
          Absolutely. Along with embedding NFC technology, smart business cards can also display a printed <strong>QR code</strong>. This makes the card universally accessible since QR codes can be scanned by any smartphone with a camera. It's particularly useful when dealing with older devices that might lack NFC capability.
        </p>
        <p className='indent-5'>
          Having both NFC and QR options ensures that no opportunity for connection is lost. For example, at networking events, some attendees may use older phones or prefer scanning codes over tapping. In this case, the QR code provides a reliable backup, ensuring inclusivity across all devices.
        </p>
        <p className='indent-5'>
          The combination of these two technologies makes your card future-proof and versatile. While NFC is sleek and modern, QR codes still offer a familiar method for quick access, giving you the best of both worlds.
        </p>
      </span>
    ),
    (
      <span className='h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl'>
        <p className='indent-5'>
          The NFC chip inside the business card is entirely passive, meaning it does not store any sensitive information beyond the link you choose to encode. The chip does not collect data, track activity, or require an internet connection. When tapped, it simply transmits the pre-programmed link to the smartphone.
        </p>
        <p className='indent-5'>
          This makes NFC cards highly secure. Unlike digital apps that might store personal information or require logins, the smart business card only contains one piece of information: the URL or contact details you set. The phone user then chooses whether or not to open the link, giving them full control.
        </p>
        <p className='indent-5'>
          Additionally, you can update the link associated with your card at any time, without physically changing the card. This allows you to keep your information current while maintaining security and reliability.
        </p>
      </span>
    ),
    (
      <span className='h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl'>
        <p className='indent-5'>
          NFC chips used in smart business cards are designed to last a long time,often up to 10 years or more with normal use. Because the chip is passive and does not rely on a battery, it doesn't wear out from transmitting signals. The durability mainly depends on the physical condition of the card itself.
        </p>
        <p className='indent-5'>
          If the card is well cared for, stored properly, and not bent or physically damaged, it will continue to function seamlessly. The NFC chip is embedded within the card's layers, which provides additional protection from wear and tear.
        </p>
        <p className='indent-5'>
          This longevity makes NFC business cards a worthwhile investment compared to traditional paper cards, which are often lost, discarded, or need reprinting when your information changes.
        </p>
      </span>
    ),
    (
      <span className='h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl'>
        <p className='indent-5'>
          One of the best features of NFC smart business cards is that the link embedded inside can be updated without needing to replace the physical card. This is done through an online dashboard or software provided by the card manufacturer. You can change the URL anytime to point to a new website, portfolio, or updated business information.
        </p>
        <p className='indent-5'>
          This flexibility ensures that your card never becomes outdated, even if your brand evolves, you change jobs, or you rebrand your online presence. Instead of reprinting new cards, you can instantly make changes in the backend system.
        </p>
        <p className='indent-5'>
          This feature not only saves you money but also makes your card more sustainable and versatile. Your single card can adapt to any business or personal changes over time, offering long-term value.
        </p>
      </span>
    ),
  ],
  [
    (
      <span className='h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl'>
        <p className='indent-5'>
          Smart business cards are designed to be very low maintenance. The NFC chip itself does not require batteries, charging, or software updates. Once the link is programmed, it continues to work for years without any additional upkeep. This makes them far more convenient than digital apps or devices that need regular updates.
        </p>
        <p className='indent-5'>
          The main aspect of maintenance comes from keeping your card physically intact. Since the card is used frequently in social or business settings, you'll want to protect it from scratches, bending, or exposure to water. Some providers even offer durable materials like PVC or metal cards for added longevity.
        </p>
        <p className='indent-5'>
          Another form of upkeep is digital. You may occasionally update the link or destination your card points to, depending on changes in your business or career. These updates are easy to do and ensure your card always reflects the latest information.
        </p>
      </span>
    ),
    (
      <span className='h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl'>
        <p className='indent-5'>
          If your card stops working, the issue is rarely with the NFC chip itself, as they are very durable. Common causes might include physical damage, such as bending or scratching the card, which may interfere with the chip's readability. The first step is always to test the card on multiple devices to rule out a phone-specific issue.
        </p>
        <p className='indent-5'>
          If it still doesn't work, contact the provider or manufacturer. Most companies offer troubleshooting support and may even replace defective cards under warranty. Some providers also give customers access to online support portals for quick solutions.
        </p>
        <p className='indent-5'>
          Having both NFC and QR code options also reduces downtime. If the NFC feature fails temporarily, the printed QR code still allows you to share your details seamlessly without interruption.
        </p>
      </span>
    ),
    (
      <span className='h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl'>
        <p className='indent-5'>
          Yes, most smart business card providers offer warranties that cover the functionality of the NFC chip for a certain period, often ranging from one to three years. This ensures peace of mind that your card will continue working as expected during its normal usage lifespan.
        </p>
        <p className='indent-5'>
          Some companies may also provide replacement guarantees if your card arrives defective or fails under reasonable use conditions. These warranties demonstrate the reliability of NFC technology and the confidence providers have in their products.
        </p>
        <p className='indent-5'>
          Before purchasing, it's a good idea to check the specific warranty policy of your provider. Understanding the coverage terms can help you know what to expect if issues arise in the future.
        </p>
      </span>
    ),
    (
      <span className='h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl'>
        <p className='indent-5'>
          Customer support is typically provided via multiple channels such as email, phone, or live chat. Many providers also offer an online knowledge base with tutorials, troubleshooting guides, and frequently asked questions to help users resolve issues independently.
        </p>
        <p className='indent-5'>
          In some cases, providers offer dedicated account managers for business clients, ensuring personalized assistance and quick resolution of issues. This level of support is especially valuable for companies that order bulk cards for employees.
        </p>
        <p className='indent-5'>
          Access to responsive customer support ensures that your investment in NFC business cards remains hassle-free and reliable, allowing you to focus on networking and growing your brand.
        </p>
      </span>
    ),
    (
      <span className='h-full w-full md:w-3/4 text-lg flex flex-col gap-5 text-justify mt-10 md:text-xl'>
        <p className='indent-5'>
          Yes, smart business cards can absolutely be updated as your business grows. The embedded NFC chip allows you to change the programmed link at any time, ensuring your card always reflects your most current information. Whether you've launched a new website, updated your social media, or changed companies, your card can adapt instantly.
        </p>
        <p className='indent-5'>
          This flexibility means you don't have to keep reprinting new paper cards whenever something changes. Instead, a simple digital update keeps everything current and accessible. This makes NFC cards both cost-effective and sustainable over the long term.
        </p>
        <p className='indent-5'>
          By leveraging this adaptability, your card can serve as a permanent tool for networking, continuously evolving with your career or business without losing its effectiveness.
        </p>
      </span>
    ),
  ],
]

const FAQs = () => {
  const [showFAQs, setShowFAQs] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<[number, number]>([0,0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='h-[100vh] w-full bg-neutral-100 mt-16 flex flex-col gap-3 overflow-hidden md:py-3'>
        <div className='h-full w-full flex gap-3 relative px-3'>
            <div 
                className={`bg-white ${showFAQs ? 'w-3/4 h-full md:min-w-1/4 md:max-w-1/4 py-1 md:py-5 md:h-min' : 'w-min h-min md:min-w-1/4 md:max-w-1/4 md:h-min py-0 md:py-3'} absolute left-0 top-2 md:top-0 md:relative rounded-r-xl md:rounded-none gap-5 shadow-md overflow-x-hidden transition-all ease-out duration-200`}>
                <button 
                    type='button'
                    className='md:hidden w-full px-3 py-2 flex items-center justify-between gap-3 '
                    onClick={() => setShowFAQs(!showFAQs)}
                >
                    <h2 className='text-lg font-medium'>Topics</h2>
                    <span
                        className='text-2xl px-2 py-2 rounded-md hover:bg-light-blue focus:bg-blueease-out duration-200'
                    >
                        {showFAQs ? (
                            <HiMiniArrowLeftStartOnRectangle />
                        ) : (
                            <HiMiniArrowRightStartOnRectangle />
                        )}
                    </span>
                </button>
                <h2 className='hidden md:block text-lg font-medium w-full text-center mb-5'>Topics</h2>
                {showFAQs && (
                    QA.map((val, i) => (
                        <FAQsCategory 
                            key={`FAQsCategory${i}`}
                            topic={val.topic}
                            questions={val.question}
                            qNum={i}
                            setSelectedQuestion={setSelectedQuestion}
                        />
                    ))
                )}
            </div>
            <div className='w-full px-3 py-3'>
                <h4 className='mt-16 text-2xl md:text-3xl font-semibold w-full md:w-3/4 text-center'>{QA[selectedQuestion[0]].topic}</h4>
                {Answers[selectedQuestion[0]][selectedQuestion[1]]}
            </div>
        </div>
    </div>
  )
}

export default FAQs